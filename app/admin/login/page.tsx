import { Suspense } from "react";
import Link from "next/link";
import { LoginForm } from "@/components/login-form";

export const metadata = { title: "後台登入" };

export default function AdminLoginPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4">
      <h1 className="mb-1 text-title font-semibold">後台登入</h1>
      <p className="mb-6 text-sm text-muted">登入後可新增、修改、刪除優惠資料。</p>
      <Suspense>
        <LoginForm />
      </Suspense>
      <Link href="/" className="mt-6 text-center text-xs text-muted hover:text-ink dark:hover:text-ink-dark">
        返回首頁
      </Link>
    </div>
  );
}
