import { Suspense } from "react";
import { FretInstrumentContent } from "@/components/instruments/FretInstrumentContent";

/**
 * 虚拟尤克里里页：包一层 Suspense 以支持 useSearchParams 读取分享链接。
 */
export default function UkulelePage() {
  return (
    <main className="min-h-screen pt-16">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <Suspense fallback={<div className="text-brand-muted text-sm">加载中...</div>}>
          <FretInstrumentContent kind="ukulele" />
        </Suspense>
      </div>
    </main>
  );
}
