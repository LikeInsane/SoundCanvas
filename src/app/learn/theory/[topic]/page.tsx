import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { THEORY_TOPICS, topicById } from "@/lib/lessons-data";
import { LessonView } from "@/components/lessons/LessonView";

/**
 * 乐理主题详情：依次渲染该主题下的所有课程。
 */
export function generateStaticParams() {
  return THEORY_TOPICS.map((t) => ({ topic: t.id }));
}

export default function TheoryTopicPage({ params }: { params: { topic: string } }) {
  const topic = topicById(params.topic);
  if (!topic) notFound();

  return (
    <div>
      <Link
        href="/learn/theory"
        className="inline-flex items-center gap-1 text-xs text-brand-muted hover:text-brand-text transition-colors cursor-pointer"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        全部乐理主题
      </Link>

      <div className="mt-3 mb-8">
        <h2 className="text-xl font-semibold text-brand-heading">{topic.title}</h2>
        <p className="mt-1 text-sm text-brand-muted">{topic.desc}</p>
      </div>

      <div className="space-y-12">
        {topic.lessons.map((lesson) => (
          <LessonView key={lesson.id} lesson={lesson} />
        ))}
      </div>

      <div className="mt-12 pt-6 border-t border-brand-border">
        <Link
          href="/exercises"
          className="text-sm font-medium text-brand-cta hover:text-brand-cta-hover transition-colors cursor-pointer"
        >
          学完了？去习题中检验一下 →
        </Link>
      </div>
    </div>
  );
}
