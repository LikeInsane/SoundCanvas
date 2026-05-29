"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Check, Play } from "lucide-react";
import { categoryById } from "@/lib/exercises-data";
import { getLevelProgress, syncProgressWithServer, type LevelProgress } from "@/lib/progress";

/**
 * 某分类下的关卡列表，展示每个关卡的完成情况。
 */
export default function ExerciseCategoryPage({ params }: { params: { category: string } }) {
  const cat = categoryById(params.category);
  const [progress, setProgress] = useState<Record<string, LevelProgress | null>>({});

  useEffect(() => {
    if (!cat) return;
    const readProgress = () => {
      const map: Record<string, LevelProgress | null> = {};
      cat.levels.forEach((l) => {
        map[l.id] = getLevelProgress(l.id);
      });
      setProgress(map);
    };
    readProgress();
    void syncProgressWithServer().then((ok) => {
      if (ok) readProgress();
    });
  }, [cat]);

  if (!cat) {
    notFound();
  }

  return (
    <div>
      <Link
        href="/exercises"
        className="inline-flex items-center gap-1 text-xs text-brand-muted hover:text-brand-text transition-colors cursor-pointer"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        返回习题中心
      </Link>

      <div className="mt-3 mb-8">
        <h1 className="text-2xl font-semibold text-brand-heading">{cat.title}</h1>
        <p className="mt-1 text-sm text-brand-muted">{cat.desc}</p>
      </div>

      <div className="space-y-3 max-w-2xl">
        {cat.levels.map((level) => {
          const p = progress[level.id];
          const done = p?.completed;
          return (
            <Link
              key={level.id}
              href={`/exercises/${cat.id}/${level.id}`}
              className="glass-card p-4 flex items-center justify-between group cursor-pointer transition-all duration-300 hover:border-brand-accent/30"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center ${
                    done ? "bg-brand-green/20 text-brand-green" : "bg-brand-card text-brand-cta"
                  }`}
                >
                  {done ? <Check className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-brand-heading">{level.title}</h3>
                  <p className="text-xs text-brand-muted">
                    {p ? `最好成绩 ${p.correct}/${level.total}` : `${level.total} 题`}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
