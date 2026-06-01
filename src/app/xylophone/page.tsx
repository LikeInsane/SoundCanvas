import { Suspense } from "react";
import { ExtKeyboardContent } from "@/components/instruments/ExtKeyboardContent";

/**
 * 虚拟木琴页：包一层 Suspense 以支持 useSearchParams 读取分享链接。
 */
export default function XylophonePage() {
  return (
    <main className="min-h-screen pt-16">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <Suspense fallback={<div className="text-brand-muted text-sm">加载中...</div>}>
          <ExtKeyboardContent kind="xylophone" />
        </Suspense>
      </div>
    </main>
  );
}
