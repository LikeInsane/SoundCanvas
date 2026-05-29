"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { levelById } from "@/lib/exercises-data";
import { QuizEngine } from "@/components/exercises/QuizEngine";

/**
 * 关卡答题页：根据 levelId 加载关卡并交给 QuizEngine 驱动。
 */
export default function ExerciseLevelPage({
  params,
}: {
  params: { category: string; level: string };
}) {
  const found = levelById(params.level);
  if (!found) {
    notFound();
  }

  return (
    <div>
      <Link
        href={`/exercises/${params.category}`}
        className="inline-flex items-center gap-1 text-xs text-brand-muted hover:text-brand-text transition-colors cursor-pointer mb-8"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        {found.category.title} · {found.level.title}
      </Link>

      <QuizEngine level={found.level} categoryId={params.category} />
    </div>
  );
}
