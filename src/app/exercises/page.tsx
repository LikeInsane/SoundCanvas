"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { EXERCISE_CATEGORIES, levelIdsOf } from "@/lib/exercises-data";
import { getCategoryProgress, syncProgressWithServer } from "@/lib/progress";

/**
 * 习题中心：八大分类卡片，展示各分类的完成进度。
 */
export default function ExercisesHubPage() {
  const [progress, setProgress] = useState<Record<string, { completed: number; total: number }>>({});

  useEffect(() => {
    const readProgress = () => {
      const map: Record<string, { completed: number; total: number }> = {};
      EXERCISE_CATEGORIES.forEach((c) => {
        map[c.id] = getCategoryProgress(levelIdsOf(c));
      });
      setProgress(map);
    };
    readProgress();
    // 登录态下先与后端同步再刷新显示
    void syncProgressWithServer().then((ok) => {
      if (ok) readProgress();
    });
  }, []);

  const groups = [
    { label: "基础", ids: ["notes", "rhythm"] },
    { label: "结构", ids: ["intervals", "chords", "scales", "keys"] },
    { label: "音乐", ids: ["instruments", "genres"] },
  ];

  return (
    <div>
      <div className="mb-10 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-brand-heading">音乐习题</h1>
          <p className="mt-1 text-sm text-brand-muted">
            通过互动练习与听力训练，巩固你的乐理能力。进度自动保存，可登录后跨设备同步。
          </p>
        </div>
        <Link
          href="/profile"
          className="shrink-0 inline-flex items-center text-sm font-medium text-brand-cta hover:text-brand-cta-hover transition-colors cursor-pointer"
        >
          学习中心
        </Link>
      </div>

      {groups.map((g) => (
        <section key={g.label} className="mb-10">
          <h2 className="text-sm font-semibold text-brand-muted mb-4">{g.label}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {g.ids.map((id) => {
              const cat = EXERCISE_CATEGORIES.find((c) => c.id === id);
              if (!cat) return null;
              const p = progress[id];
              return (
                <Link
                  key={id}
                  href={`/exercises/${id}`}
                  className="glass-card p-5 group cursor-pointer transition-all duration-300 hover:border-brand-accent/30 hover:-translate-y-1"
                >
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-base font-semibold text-brand-heading">{cat.title}</h3>
                    {p && (
                      <span className="text-xs text-brand-muted tabular-nums">
                        {p.completed}/{p.total}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-brand-muted leading-relaxed">{cat.desc}</p>
                  {p && (
                    <div className="mt-3 h-1 rounded-full bg-brand-border overflow-hidden">
                      <div
                        className="h-full bg-brand-cta transition-all"
                        style={{ width: `${p.total ? (p.completed / p.total) * 100 : 0}%` }}
                      />
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
