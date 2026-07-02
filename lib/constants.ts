import type { Category, DateCategory } from "@/lib/types";

export const CATEGORIES: Category[] = ["飲料", "食物", "美妝", "其他"];

export const DATE_CATEGORIES: DateCategory[] = ["月底", "次月底", "其他"];

export const CATEGORY_TAG_CLASSES: Record<Category, string> = {
  飲料: "bg-tag-drink text-tag-drink-fg",
  食物: "bg-tag-food text-tag-food-fg",
  美妝: "bg-tag-beauty text-tag-beauty-fg",
  其他: "bg-tag-other text-tag-other-fg",
};

// Low-saturation palette auto-assigned to newly created free-form tags.
export const TAG_COLOR_PALETTE = [
  "#DCEBDD", // sage
  "#F3E3D3", // sand
  "#F5DFE6", // blush
  "#E4E9F0", // powder blue
  "#EAE2D0", // wheat
  "#DDE6E3", // seafoam
  "#EFE0EA", // lilac
  "#E7E4DE", // stone
];

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
