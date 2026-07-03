import type { Category, DateCategory } from "@/lib/types";

export const CATEGORIES: Category[] = ["飲料", "食物", "美妝", "其他"];

export const DATE_CATEGORIES: DateCategory[] = ["月底", "次月底", "其他"];

export const CATEGORY_TAG_CLASSES: Record<Category, string> = {
  飲料: "bg-tag-drink text-tag-drink-fg",
  食物: "bg-tag-food text-tag-food-fg",
  美妝: "bg-tag-beauty text-tag-beauty-fg",
  其他: "bg-tag-other text-tag-other-fg",
};

// v2 UI requirement: every free-form tag must always have a soft pastel
// background (never white). This palette is intentionally low-saturation
// (Material/Apple/MUJI-leaning) and covers a wide spread of hues so tags
// stay visually distinct from one another — 奶茶/珊瑚/綠/紫/粉/黃/青/灰藍 etc.
export const TAG_COLOR_PALETTE = [
  "#EAE2D0", // 奶茶色 latte
  "#F3D9CE", // 珊瑚色 coral
  "#DCEBDD", // 淡綠 sage
  "#E6DCF0", // 淡紫 lavender
  "#F5DFE6", // 淡粉 blush
  "#F5EBC7", // 淡黃 butter
  "#D8ECE8", // 淡青 mint-cyan
  "#DFE4EF", // 灰藍 slate blue
  "#F3E3D3", // 沙色 sand
  "#E7E4DE", // 石灰 stone (fallback-ish, still not white)
];

/**
 * Deterministically assigns a palette color to a tag name so the same tag
 * always renders the same color across the app. Never returns white/none —
 * every entry above is a solid pastel hex.
 */
export function colorForTagName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return TAG_COLOR_PALETTE[hash % TAG_COLOR_PALETTE.length];
}

export const SUGGESTED_TAGS = [
  "需會員",
  "需 APP",
  "需綁定手機",
  "限本人",
  "可提前領取",
  "生日當天限定",
  "生日當月",
  "線上兌換",
  "門市兌換",
  "外帶限定",
  "內用限定",
  "全台適用",
  "指定門市",
  "新會員限定",
  "消費門檻",
  "可重複使用",
];

export const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: "expiry_asc", label: "截止日期：近 → 遠" },
  { value: "score_desc", label: "分數：高 → 低" },
  { value: "clicks_desc", label: "熱門度：高 → 低" },
  { value: "store_name_asc", label: "店家名稱：A ~ Z" },
  { value: "created_desc", label: "建立時間：新 → 舊" },
  { value: "updated_desc", label: "更新時間：新 → 舊" },
];
