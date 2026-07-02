import { NextResponse } from "next/server";

interface ExtractedReward {
  store_name: string;
  content: string;
  logo_url: string | null;
  official_url: string;
}

/**
 * Best-effort metadata scrape from a store's official promo URL, so the
 * front-end "貼上網址自動擷取" flow has something to prefill from.
 *
 * This intentionally stays simple (title / og:title / favicon) rather than
 * attempting real content extraction. Swap the body of this function for an
 * AI-powered summarizer later — the call signature below is the extension
 * point referenced in the PRD (`extractReward()`).
 */
async function extractReward(url: string): Promise<ExtractedReward> {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; BirthdayRewardsBot/1.0)" },
    signal: AbortSignal.timeout(8000),
  });
  const html = await res.text();

  const ogTitle = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i)?.[1];
  const titleTag = html.match(/<title>([^<]+)<\/title>/i)?.[1];
  const ogImage = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)?.[1];
  const description = html.match(
    /<meta[^>]+(?:name|property)=["'](?:description|og:description)["'][^>]+content=["']([^"']+)["']/i
  )?.[1];

  const origin = new URL(url).origin;

  return {
    store_name: (ogTitle ?? titleTag ?? "").split(/[-|｜]/)[0]?.trim() || "未命名店家",
    content: description?.trim() ?? "",
    logo_url: ogImage ?? `${origin}/favicon.ico`,
    official_url: url,
  };
}

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "請提供網址" }, { status: 400 });
    }

    const parsedUrl = new URL(url); // throws if invalid
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return NextResponse.json({ error: "僅支援 http/https 網址" }, { status: 400 });
    }

    const extracted = await extractReward(url);
    return NextResponse.json({ data: extracted });
  } catch {
    // Extraction failing is expected for many sites — the UI falls back to
    // manual entry, per PRD ("若失敗：保留人工修改").
    return NextResponse.json(
      { error: "自動擷取失敗，請手動輸入資料" },
      { status: 200 }
    );
  }
}
