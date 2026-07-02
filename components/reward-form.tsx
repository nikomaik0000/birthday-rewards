"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { rewardFormSchema, type RewardFormValues } from "@/lib/schema";
import { CATEGORIES, DATE_CATEGORIES } from "@/lib/constants";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StarRatingInput } from "@/components/star-rating-input";
import { TagInput } from "@/components/tag-input";

export function RewardForm({
  defaultValues,
  onSubmit,
  submitLabel = "儲存",
  compact = false,
}: {
  defaultValues?: Partial<RewardFormValues>;
  onSubmit: (values: RewardFormValues) => Promise<void> | void;
  submitLabel?: string;
  compact?: boolean;
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RewardFormValues>({
    resolver: zodResolver(rewardFormSchema),
    defaultValues: {
      store_name: "",
      category: "其他",
      content: "",
      date_category: "其他",
      score: 5,
      official_url: "",
      logo_url: "",
      expiry_date: "",
      notes: "",
      tagNames: [],
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(async (v) => onSubmit(v))} className="stack-16">
      <Field label="店家名稱" error={errors.store_name?.message}>
        <Input {...register("store_name")} placeholder="例如：星巴克" autoFocus />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="類別" error={errors.category?.message}>
          <select
            {...register("category")}
            className="h-9 w-full rounded-lg border border-border bg-surface px-3 text-sm dark:border-border-dark dark:bg-surface-dark"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>

        <Field label="日期分類" error={errors.date_category?.message}>
          <select
            {...register("date_category")}
            className="h-9 w-full rounded-lg border border-border bg-surface px-3 text-sm dark:border-border-dark dark:bg-surface-dark"
          >
            {DATE_CATEGORIES.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="優惠內容" error={errors.content?.message}>
        <Textarea {...register("content")} rows={3} placeholder="例如：生日當天買一送一" />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="官方網址" error={errors.official_url?.message}>
          <Input {...register("official_url")} placeholder="https://" inputMode="url" />
        </Field>
        <Field label="截止日期" error={errors.expiry_date?.message}>
          <Input {...register("expiry_date")} type="date" />
        </Field>
      </div>

      <Field label="分數">
        <Controller
          control={control}
          name="score"
          render={({ field }) => <StarRatingInput value={field.value} onChange={field.onChange} />}
        />
      </Field>

      {!compact && (
        <>
          <Field label="Logo 網址（留空則顯示店名字首）" error={errors.logo_url?.message}>
            <Input {...register("logo_url")} placeholder="https://" inputMode="url" />
          </Field>

          <Field label="標籤">
            <Controller
              control={control}
              name="tagNames"
              render={({ field }) => <TagInput value={field.value ?? []} onChange={field.onChange} />}
            />
          </Field>

          <Field label="使用心得">
            <Textarea {...register("notes")} rows={2} placeholder="例如：需先加入會員" />
          </Field>
        </>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "儲存中..." : submitLabel}
      </Button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
