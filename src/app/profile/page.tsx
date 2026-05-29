"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Flame, ArrowRight, Trophy } from "lucide-react";
import { EXERCISE_CATEGORIES } from "@/lib/exercises-data";
import {
  getAllProgress,
  getStreak,
  masteryOf,
  resetAllProgress,
  syncProgressWithServer,
  type LevelProgress,
  type Mastery,
} from "@/lib/progress";

const MASTERY_COLOR: Record<Mastery, string> = {
  none: "bg-brand-border",
  bronze: "bg-amber-600",
  silver: "bg-slate-300",
  gold: "bg-yellow-400",
};
const MASTERY_LABEL: Record<Mastery, string> = {
  none: "未开始",
  bronze: "铜",
  silver: "银",
  gold: "金",
};

export default function ProfilePage() {
  const [progress, setProgress] = useState<Record<string, LevelProgress>>({});
  const [streak, setStreak] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const read = () => {
      setProgress(getAllProgress());
      setStreak(getStreak());
    };
    read();
    void syncProgressWithServer().then((ok) => {
      if (ok) read();
    });
  }, [tick]);

  // 统计
  const allLevels = EXERCISE_CATEGORIES.flatMap((c) => c.levels);
  const totalLevels = allLevels.length;
  const goldLevels = allLevels.filter((l) => masteryOf(progress[l.id]) === "gold").length;
  const startedLevels = allLevels.filter((l) => masteryOf(progress[l.id]) !== "none").length;
  const overallPct = totalLevels > 0 ? Math.round((goldLevels / totalLevels) * 100) : 0;

  // 推荐下一步：按分类顺序取前 3 个未达 gold 的关卡
  const recommended: Array<{ categoryId: string; categoryTitle: string; levelId: string; levelTitle: string }> = [];
  for (const c of EXERCISE_CATEGORIES) {
    for (const l of c.levels) {
      if (recommended.length >= 3) break;
      if (masteryOf(progress[l.id]) !== "gold") {
        recommended.push({ categoryId: c.id, categoryTitle: c.title, levelId: l.id, levelTitle: l.title });
      }
    }
    if (recommended.length >= 3) break;
  }

  const handleReset = () => {
    if (window.confirm("确定要清空全部学习进度吗？此操作不可撤销。")) {
      resetAllProgress();
      setTick((t) => t + 1);
    }
  };

  const circumference = 2 * Math.PI * 52;

  return (
    <main className="min-h-screen pt-16">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-brand-heading">个人学习中心</h1>
          <p className="mt-1 text-sm text-brand-muted">追踪你的练习进度、掌握度与连续打卡。</p>
        </div>

        {/* 概览 */}
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          <div className="glass-card p-6 flex items-center gap-5">
            <svg width={120} height={120} viewBox="0 0 120 120" className="shrink-0">
              <circle cx={60} cy={60} r={52} fill="none" stroke="#1E1E35" strokeWidth={10} />
              <circle
                cx={60}
                cy={60}
                r={52}
                fill="none"
                stroke="#0071E3"
                strokeWidth={10}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - overallPct / 100)}
                transform="rotate(-90 60 60)"
              />
              <text x={60} y={66} textAnchor="middle" fontSize={24} fontWeight={700} fill="#FFFFFF">
                {overallPct}%
              </text>
            </svg>
            <div>
              <div className="text-sm text-brand-muted">总体掌握</div>
              <div className="text-brand-heading font-semibold mt-1">
                {goldLevels}/{totalLevels} 关达金
              </div>
              <div className="text-xs text-brand-muted mt-1">已开始 {startedLevels} 关</div>
            </div>
          </div>

          <div className="glass-card p-6 flex flex-col items-center justify-center">
            <Flame className={`w-8 h-8 ${streak > 0 ? "text-orange-400" : "text-brand-muted"}`} />
            <div className="text-3xl font-bold text-brand-heading mt-2">{streak}</div>
            <div className="text-xs text-brand-muted">连续打卡（天）</div>
          </div>

          <div className="glass-card p-6 flex flex-col items-center justify-center">
            <Trophy className="w-8 h-8 text-yellow-400" />
            <div className="text-3xl font-bold text-brand-heading mt-2">{goldLevels}</div>
            <div className="text-xs text-brand-muted">金牌关卡</div>
          </div>
        </div>

        {/* 推荐下一步 */}
        {recommended.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-semibold text-brand-heading mb-4">推荐下一步</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {recommended.map((r) => (
                <Link
                  key={r.levelId}
                  href={`/exercises/${r.categoryId}/${r.levelId}`}
                  className="glass-card p-4 group cursor-pointer transition-all duration-300 hover:border-brand-accent/30 hover:-translate-y-1"
                >
                  <div className="text-xs text-brand-muted">{r.categoryTitle}</div>
                  <div className="text-sm font-semibold text-brand-heading mt-1">{r.levelTitle}</div>
                  <span className="mt-3 inline-flex items-center text-xs text-brand-cta">
                    去练习 <ArrowRight className="w-3 h-3 ml-1" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 各分类掌握度 */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-brand-heading mb-4">分类掌握度</h2>
          <div className="space-y-3">
            {EXERCISE_CATEGORIES.map((c) => (
              <Link
                key={c.id}
                href={`/exercises/${c.id}`}
                className="glass-card p-4 block group cursor-pointer transition-colors hover:border-brand-accent/30"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-brand-heading">{c.title}</span>
                  <span className="text-xs text-brand-muted">
                    {c.levels.filter((l) => masteryOf(progress[l.id]) === "gold").length}/{c.levels.length} 金
                  </span>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {c.levels.map((l) => {
                    const m = masteryOf(progress[l.id]);
                    return (
                      <span
                        key={l.id}
                        title={`${l.title}：${MASTERY_LABEL[m]}`}
                        className={`w-6 h-2 rounded-full ${MASTERY_COLOR[m]}`}
                      />
                    );
                  })}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 图例与重置 */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4 text-xs text-brand-muted">
            {(["bronze", "silver", "gold"] as Mastery[]).map((m) => (
              <span key={m} className="flex items-center gap-1.5">
                <span className={`w-3 h-3 rounded-full ${MASTERY_COLOR[m]}`} /> {MASTERY_LABEL[m]}（
                {m === "bronze" ? "≥60%" : m === "silver" ? "≥80%" : "100%"}）
              </span>
            ))}
          </div>
          <button
            onClick={handleReset}
            className="text-xs text-brand-muted hover:text-red-400 transition-colors cursor-pointer"
          >
            清空全部进度
          </button>
        </div>
      </div>
    </main>
  );
}
