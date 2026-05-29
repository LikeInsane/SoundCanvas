import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { THEORY_TOPICS } from "@/lib/lessons-data";

/**
 * 学习概览：分三条主线引导——乐理基础、编曲基础、风格路线。
 */
const arrangeTracks = [
  { href: "/learn/rhythm", title: "节奏入门", desc: "拍子、小节与强弱拍。" },
  { href: "/learn/chords", title: "和弦入门", desc: "用和弦铺垫情绪底色。" },
  { href: "/learn/melody", title: "旋律入门", desc: "编织你的第一段旋律。" },
];

export default function LearnHubPage() {
  return (
    <div className="space-y-12">
      <section>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-lg font-semibold text-brand-heading">乐理基础</h2>
          <Link href="/learn/theory" className="text-xs text-brand-cta hover:text-brand-cta-hover cursor-pointer">
            全部乐理 →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {THEORY_TOPICS.map((t) => (
            <Link
              key={t.id}
              href={`/learn/theory/${t.id}`}
              className="glass-card p-5 group cursor-pointer transition-all duration-300 hover:border-brand-accent/30 hover:-translate-y-1"
            >
              <h3 className="text-base font-semibold text-brand-heading">{t.title}</h3>
              <p className="mt-2 text-xs text-brand-muted leading-relaxed">{t.desc}</p>
              <span className="mt-3 inline-flex items-center text-xs text-brand-cta">
                {t.lessons.length} 节 <ArrowRight className="w-3 h-3 ml-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-brand-heading mb-4">编曲基础</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {arrangeTracks.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="glass-card p-5 group cursor-pointer transition-all duration-300 hover:border-brand-accent/30 hover:-translate-y-1"
            >
              <h3 className="text-base font-semibold text-brand-heading">{t.title}</h3>
              <p className="mt-2 text-xs text-brand-muted leading-relaxed">{t.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-brand-heading mb-4">风格路线</h2>
        <Link
          href="/learn/styles"
          className="glass-card p-5 flex items-center justify-between group cursor-pointer transition-all duration-300 hover:border-brand-accent/30"
        >
          <div>
            <h3 className="text-base font-semibold text-brand-heading">六大风格进阶</h3>
            <p className="mt-2 text-xs text-brand-muted leading-relaxed">
              国风、爵士、RnB、日系、电子、配乐，循序渐进地学习各风格编曲。
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-brand-cta shrink-0" />
        </Link>
      </section>
    </div>
  );
}
