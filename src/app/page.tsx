import Link from "next/link";
import { getServerSession } from "next-auth";
import { Music, Headphones, Piano, Mic2 } from "lucide-react";
import { authOptions } from "@/lib/auth";

const features = [
  {
    icon: Headphones,
    title: "节奏",
    desc: "从心跳到鼓点，建立你的节奏直觉",
  },
  {
    icon: Piano,
    title: "和弦",
    desc: "用和弦讲述故事，理解音乐的情感基础",
  },
  {
    icon: Mic2,
    title: "旋律",
    desc: "编织你的第一段旋律，让想法变成声音",
  },
];

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center min-h-screen px-6 overflow-hidden">
        {/* 背景光晕 */}
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
            在浏览器里<br />创造你的音乐
          </h1>

          <p className="mt-6 text-subtitle text-brand-muted max-w-lg mx-auto">
            SoundCanvas 是一个交互式音乐编曲学习平台。学节奏、和弦、旋律，边学边做，产出属于你的第一段编曲。
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/learn" className="btn-secondary">
              去学习
            </Link>
            <Link href="/sandbox" className="btn-primary">
              去编曲
            </Link>
            {session ? (
              <Link href="/projects" className="btn-secondary">
                我的作品
              </Link>
            ) : (
              <Link href="/login" className="btn-secondary">
                登录
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-section text-brand-heading text-center">
            三条轨道，一段音乐
          </h2>
          <p className="mt-4 text-brand-muted text-center max-w-md mx-auto">
            我们把编曲拆成最基础的三个维度，逐步引导你搭建一段完整作品。
          </p>

          <div className="mt-16 grid md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="glass-card p-8 group cursor-pointer transition-all duration-300 hover:border-brand-accent/30 hover:-translate-y-1"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-accent/10 flex items-center justify-center mb-5 transition-colors duration-300 group-hover:bg-brand-accent/20">
                  <f.icon className="w-5 h-5 text-brand-accent" />
                </div>
                <h3 className="text-lg font-semibold text-brand-heading">{f.title}</h3>
                <p className="mt-2 text-sm text-brand-muted leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-section text-brand-heading">
            准备好了吗？
          </h2>
          <p className="mt-4 text-brand-muted">
            免费注册，开始你的音乐创作之旅。
          </p>
          <div className="mt-10">
            <Link href="/register" className="btn-primary">
              免费开始
            </Link>
          </div>
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
