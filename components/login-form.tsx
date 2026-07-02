"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { login } from "@/app/actions/auth";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" } });

  async function onSubmit(values: { email: string; password: string }) {
    setServerError(null);
    const result = await login(values);
    if (result.error) {
      setServerError(result.error);
      return;
    }
    router.push(searchParams.get("next") ?? "/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="stack-16">
      <div>
        <label className="mb-1.5 block text-xs font-medium text-muted">Email</label>
        <Input type="email" {...register("email")} placeholder="you@example.com" />
        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-medium text-muted">密碼</label>
        <Input type="password" {...register("password")} placeholder="••••••••" />
        {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
      </div>
      {serverError && <p className="text-xs text-red-500">{serverError}</p>}
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "登入中..." : "登入"}
      </Button>
    </form>
  );
}
