import Link from "next/link";
import { Piano, Guitar, ArrowRight } from "lucide-react";

/**
 * 乐器中心：列出可在线弹奏的虚拟乐器。
 */
const instruments = [
  {
    icon: Piano,
    title: "虚拟钢琴",
    desc: "点击或电脑键盘弹奏，标记音符、分享与录音回放。",
    href: "/piano",
  },
  {
    icon: Guitar,
    title: "虚拟吉他",
    desc: "六弦指板弹奏，音位提示、标记分享与原声/电声切换。",
    href: "/guitar",
  },
];

export default function InstrumentsPage() {
  return (
    <main className="min-h-screen pt-16">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="text-2xl font-semibold text-brand-heading">虚拟乐器</h1>
          <p className="mt-1 text-sm text-brand-muted">在浏览器里直接弹奏，辅助理解乐理与听感。</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {instruments.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className="glass-card p-6 group cursor-pointer transition-all duration-300 hover:border-brand-accent/30 hover:-translate-y-1"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-accent/10 flex items-center justify-center mb-4 transition-colors duration-300 group-hover:bg-brand-accent/20">
                <it.icon className="w-5 h-5 text-brand-accent" />
              </div>
              <h3 className="text-lg font-semibold text-brand-heading">{it.title}</h3>
              <p className="mt-2 text-sm text-brand-muted leading-relaxed">{it.desc}</p>
              <span className="mt-4 inline-flex items-center text-sm font-medium text-brand-cta">
                打开 <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
