"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * 仅在风格分支子页显示「返回风格路线」，首页不显示
 */
export default function BackToStyles() {
  const pathname = usePathname();
  if (pathname === "/learn/styles") return null;
  return (
    <div>
      <Link
        href="/learn/styles"
        className="text-sm font-medium text-brand-muted hover:text-brand-text transition-colors cursor-pointer"
      >
        ← 返回风格路线
      </Link>
    </div>
  );
}
