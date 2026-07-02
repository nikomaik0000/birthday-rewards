import { z } from "zod";

export const rewardFormSchema = z.object({
  store_name: z.string().trim().min(1, "請輸入店家名稱").max(100),
  category: z.enum(["飲料", "食物", "美妝", "其他"]),
  content: z.string().trim().min(1, "請輸入優惠內容"),
  date_category: z.enum(["月底", "次月底", "其他"]),
  score: z.coerce.number().int().min(1).max(5),
  official_url: z
    .string()
    .trim()
    .url("請輸入正確的網址格式")
    .optional()
    .or(z.literal("")),
  logo_url: z.string().trim().optional().or(z.literal("")),
  expiry_date: z.string().trim().optional().or(z.literal("")),
  notes: z.string().trim().optional().or(z.literal("")),
  tagNames: z.array(z.string()).default([]),
});

export type RewardFormValues = z.infer<typeof rewardFormSchema>;

export const importRowSchema = z.object({
  store_name: z.string().trim().min(1),
  category: z.enum(["飲料", "食物", "美妝", "其他"]).default("其他"),
  content: z.string().trim().default(""),
  date_category: z.enum(["月底", "次月底", "其他"]).default("其他"),
  score: z.coerce.number().int().min(1).max(5).default(5),
  official_url: z.string().trim().optional().default(""),
  expiry_date: z.string().trim().optional().default(""),
  notes: z.string().trim().optional().default(""),
  tags: z.string().trim().optional().default(""), // comma-separated in CSV/Excel
});

export type ImportRow = z.infer<typeof importRowSchema>;

export const loginSchema = z.object({
  email: z.string().trim().email("請輸入正確的 Email"),
  password: z.string().min(6, "密碼至少 6 碼"),
});
