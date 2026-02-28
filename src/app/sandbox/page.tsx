"use client";

import { Suspense } from "react";
import { SandboxContent } from "./SandboxContent";

/**
 * 编曲沙盒页：用 Suspense 包裹使用 useSearchParams 的内容，避免静态渲染报错
 */
export default function SandboxPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen pt-16 flex items-center justify-center">
          <p className="text-brand-muted">加载中...</p>
        </main>
      }
    >
      <SandboxContent />
    </Suspense>
  );
}
