"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type ProjectItem = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};

/**
 * 我的作品列表页：展示当前用户作品，可打开、删除，另有新建入口
 * 未登录由 middleware 重定向到 /login
 */
export default function ProjectsPage() {
  const [list, setList] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/projects");
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "加载失败");
        setList([]);
        return;
      }
      const data = await res.json();
      setList(Array.isArray(data) ? data : []);
    } catch {
      setError("网络错误");
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`确定要删除《${title}》吗？`)) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        setList((prev) => prev.filter((p) => p.id !== id));
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "删除失败");
      }
    } catch {
      alert("网络错误");
    }
  };

  const formatDate = (s: string) => {
    try {
      const d = new Date(s);
      return d.toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return s;
    }
  };

  return (
    <main className="min-h-screen pt-16">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-semibold text-brand-heading">我的作品</h1>
          <Link
            href="/sandbox"
            className="btn-primary text-sm"
          >
            新建作品
          </Link>
        </div>

        {loading && (
          <p className="text-brand-muted text-sm">加载中...</p>
        )}

        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}

        {!loading && !error && list.length === 0 && (
          <div className="rounded-xl border border-brand-border bg-brand-card/40 p-8 text-center">
            <p className="text-brand-muted text-sm">还没有作品</p>
            <Link
              href="/sandbox"
              className="mt-4 inline-block text-brand-cta text-sm font-medium hover:text-brand-cta-hover cursor-pointer"
            >
              去编曲沙盒创建第一首 →
            </Link>
          </div>
        )}

        {!loading && list.length > 0 && (
          <ul className="space-y-3">
            {list.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between gap-4 rounded-xl border border-brand-border bg-brand-card/40 px-4 py-3"
              >
                <Link
                  href={`/sandbox?id=${p.id}`}
                  className="flex-1 min-w-0 cursor-pointer group"
                >
                  <p className="text-brand-heading font-medium truncate group-hover:text-brand-cta transition-colors">
                    {p.title}
                  </p>
                  <p className="text-brand-muted text-xs mt-0.5">
                    更新于 {formatDate(p.updatedAt)}
                  </p>
                </Link>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/sandbox?id=${p.id}`}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-brand-cta border border-brand-cta/30 hover:bg-brand-cta/10 transition-colors cursor-pointer"
                  >
                    打开
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(p.id, p.title)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 border border-red-400/30 hover:bg-red-400/10 transition-colors cursor-pointer"
                  >
                    删除
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
