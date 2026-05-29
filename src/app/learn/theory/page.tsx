import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { THEORY_TOPICS } from "@/lib/lessons-data";

/**
 * 乐理主题索引：列出全部乐理主题及其课程数。
 */
export default function TheoryIndexPage() {
  return (
    <div>
      <h2 className="text-xl font-semibold text-brand-heading mb-1">乐理基础</h2>
      <p className="text-sm text-brand-muted mb-8">
        从音、音程、音阶到调号，循序理解音乐的语言。
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        {THEORY_TOPICS.map((t) => (
          <Link
            key={t.id}
            href={`/learn/theory/${t.id}`}
            className="glass-card p-5 group cursor-pointer transition-all duration-300 hover:border-brand-accent/30 hover:-translate-y-1"
          >
            <h3 className="text-base font-semibold text-brand-heading">{t.title}</h3>
            <p className="mt-2 text-xs text-brand-muted leading-relaxed">{t.desc}</p>
            <ul className="mt-3 space-y-1">
              {t.lessons.map((l) => (
                <li key={l.id} className="text-xs text-brand-muted">
                  · {l.title}
                </li>
              ))}
            </ul>
            <span className="mt-3 inline-flex items-center text-xs text-brand-cta">
              开始学习 <ArrowRight className="w-3 h-3 ml-1" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
