"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Music, LogOut } from "lucide-react";

export function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-nav">
      <div className="max-w-6xl mx-auto px-6 h-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 cursor-pointer group">
          <Music className="w-5 h-5 text-brand-cta transition-colors duration-200 group-hover:text-brand-cta-hover" />
          <span className="text-sm font-semibold text-brand-heading transition-colors duration-200 group-hover:text-brand-text">
            SoundCanvas
          </span>
        </Link>

        <nav className="flex items-center gap-5 text-xs font-medium">
          <Link
            href="/learn"
            className="text-brand-muted hover:text-brand-text transition-colors duration-200 cursor-pointer"
          >
            课程
          </Link>
          <Link
            href="/exercises"
            className="text-brand-muted hover:text-brand-text transition-colors duration-200 cursor-pointer"
          >
            习题
          </Link>
          <Link
            href="/tools"
            className="text-brand-muted hover:text-brand-text transition-colors duration-200 cursor-pointer"
          >
            工具
          </Link>
          <Link
            href="/instruments"
            className="text-brand-muted hover:text-brand-text transition-colors duration-200 cursor-pointer"
          >
            乐器
          </Link>
          <Link
            href="/sandbox"
            className="text-brand-muted hover:text-brand-text transition-colors duration-200 cursor-pointer"
          >
            编曲
          </Link>

          {status === "loading" && (
            <span className="w-16 h-3 bg-brand-card rounded animate-pulse" />
          )}

          {status === "authenticated" && session?.user && (
            <>
              <Link
                href="/projects"
                className="text-brand-muted hover:text-brand-text transition-colors duration-200 cursor-pointer"
              >
                我的作品
              </Link>
              <span className="text-brand-muted/60">|</span>
              <Link
                href="/profile"
                className="text-brand-muted hover:text-brand-text text-xs transition-colors duration-200 cursor-pointer"
              >
                {session.user.name || session.user.email}
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-1 text-brand-muted hover:text-red-400 transition-colors duration-200 cursor-pointer"
                title="登出"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {status === "unauthenticated" && (
            <>
              <Link
                href="/login"
                className="text-brand-muted hover:text-brand-text transition-colors duration-200 cursor-pointer"
              >
                登录
              </Link>
              <Link
                href="/register"
                className="px-3 py-1 rounded-full bg-brand-cta text-white hover:bg-brand-cta-hover transition-colors duration-200 cursor-pointer"
              >
                注册
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
