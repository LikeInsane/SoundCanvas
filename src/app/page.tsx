import Link from "next/link";
import { getServerSession } from "next-auth";
import { Music, GraduationCap, ListChecks, Wrench, Piano, SlidersHorizontal, ArrowRight } from "lucide-react";
import { authOptions } from "@/lib/auth";

/**
 * 首页：展示平台四大支柱（课程、习题、工具、虚拟钢琴）与编曲沙盒。
 */
const pillars = [
  {
    icon: GraduationCap,
    title: "系统课程",
    desc: "从音、音程、音阶、调号到风格编曲，循序渐进地学习乐理。",
    href: "/learn",
    cta: "开始学习",
  },
  {
    icon: ListChecks,
    title: "互动习题",
    desc: "识谱、听辨、构建音程和弦——八大分类闯关，进度自动保存。",
    href: "/exercises",
    cta: "去练习",
  },
  {
    icon: Wrench,
    title: "乐理工具",
    desc: "节拍器、调音器、五度圈、和弦与音阶查找等随用随开的小工具。",
    href: "/tools",
    cta: "打开工具",
  },
  {
    icon: Piano,
    title: "虚拟钢琴",
    desc: "用鼠标或电脑键盘弹奏，标记音符、分享与录音回放。",
    href: "/piano",
    cta: "去弹奏",
  },
];

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center min-h-screen px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-accent/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-brand-cta/5 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-card border border-brand-border mb-8">
            <Music className="w-3.5 h-3.5 text-brand-cta" />
            <span className="text-xs text-brand-muted font-medium">零基础友好 -- 从第一个音符开始</span>
          </div>

          <h1 className="text-hero text-brand-heading">
            学乐理，<br />也创造音乐
          </h1>

          <p className="mt-6 text-subtitle text-brand-muted max-w-lg mx-auto">
            SoundCanvas 把系统课程、互动习题、实用工具与虚拟乐器集于一身，让你边学边练，并在编曲沙盒里把想法变成声音。
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/learn" className="btn-secondary">
              去学习
            </Link>
            <Link href="/exercises" className="btn-primary">
              做习题
            </Link>
            <Link href="/sandbox" className="btn-secondary">
              去编曲
            </Link>
          </div>
        </div>
      </section>

      {/* 四大支柱 */}
      <section className="relative py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-section text-brand-heading text-center">四个模块，一站式学习</h2>
          <p className="mt-4 text-brand-muted text-center max-w-md mx-auto">
            学、练、查、弹，覆盖从入门到实践的完整路径。
          </p>

          <div className="mt-16 grid sm:grid-cols-2 gap-6">
            {pillars.map((p) => (
              <Link
                key={p.title}
                href={p.href}
                className="glass-card p-8 group cursor-pointer transition-all duration-300 hover:border-brand-accent/30 hover:-translate-y-1"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-accent/10 flex items-center justify-center mb-5 transition-colors duration-300 group-hover:bg-brand-accent/20">
                  <p.icon className="w-5 h-5 text-brand-accent" />
                </div>
                <h3 className="text-lg font-semibold text-brand-heading">{p.title}</h3>
                <p className="mt-2 text-sm text-brand-muted leading-relaxed">{p.desc}</p>
                <span className="mt-4 inline-flex items-center text-sm font-medium text-brand-cta">
                  {p.cta} <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 编曲沙盒 */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-14 h-14 rounded-2xl bg-brand-cta/10 flex items-center justify-center shrink-0">
              <SlidersHorizontal className="w-7 h-7 text-brand-cta" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-semibold text-brand-heading">编曲沙盒</h2>
              <p className="mt-2 text-sm text-brand-muted leading-relaxed">
                把学到的节奏、和弦与旋律组合起来，在三轨编辑器里实时播放，产出属于你的第一段编曲。
              </p>
            </div>
            <Link href="/sandbox" className="btn-primary shrink-0">
              去编曲
            </Link>
          </div>
          {session && (
            <div className="text-center mt-6">
              <Link href="/projects" className="text-sm text-brand-cta hover:text-brand-cta-hover cursor-pointer">
                查看我的作品 →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-brand-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-brand-muted">
          <span>SoundCanvas</span>
          <span>MIT License</span>
        </div>
      </footer>
    </main>
  );
}
