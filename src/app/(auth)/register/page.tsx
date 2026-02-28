"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Music, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name: name || undefined }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "注册失败，请稍后重试");
        setLoading(false);
        return;
      }
      router.push("/login");
    } catch {
      setError("网络错误，请稍后重试");
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 pt-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-accent/10 mb-5">
            <Music className="w-6 h-6 text-brand-accent" />
          </div>
          <h1 className="text-2xl font-bold text-brand-heading tracking-tight">创建你的账号</h1>
          <p className="mt-2 text-sm text-brand-muted">免费开始你的音乐之旅</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-brand-muted mb-1.5">
              邮箱
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-xs font-medium text-brand-muted mb-1.5">
              密码（至少 6 位）
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor="name" className="block text-xs font-medium text-brand-muted mb-1.5">
              昵称（选填）
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder="你的昵称"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-2 gap-2"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                注册
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-brand-muted">
          已有账号？{" "}
          <Link href="/login" className="text-brand-cta hover:text-brand-cta-hover transition-colors duration-200 cursor-pointer">
            登录
          </Link>
        </p>
      </div>
    </main>
  );
}
