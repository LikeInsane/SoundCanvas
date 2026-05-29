import Link from "next/link";
import { ChevronLeft } from "lucide-react";

/**
 * 工具子页通用页头：返回工具中心的链接 + 标题与说明。
 */
export function ToolHeader({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="mb-8">
      <Link
        href="/tools"
        className="inline-flex items-center gap-1 text-xs text-brand-muted hover:text-brand-text transition-colors cursor-pointer"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        返回工具
      </Link>
      <h1 className="mt-3 text-2xl font-semibold text-brand-heading">{title}</h1>
      <p className="mt-1 text-sm text-brand-muted">{desc}</p>
    </div>
  );
}
