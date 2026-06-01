import Link from "next/link";
import {
  Piano,
  Guitar,
  AudioWaveform,
  Music2,
  Music3,
  Music4,
  Drum,
  Grid3x3,
  Bell,
  Waves,
  ArrowRight,
} from "lucide-react";

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
    icon: AudioWaveform,
    title: "虚拟合成器",
    desc: "可切换波形的减法合成器，弹奏并标记、分享与录音。",
    href: "/synth",
  },
  {
    icon: Guitar,
    title: "虚拟吉他",
    desc: "六弦指板弹奏，音位提示、标记分享与原声/电声切换。",
    href: "/guitar",
  },
  {
    icon: Music2,
    title: "虚拟贝斯",
    desc: "四弦贝斯指板，温暖低频音色，音位提示与录音回放。",
    href: "/bass",
  },
  {
    icon: Music3,
    title: "虚拟尤克里里",
    desc: "四弦指板与常用和弦库，明亮拨弦音色。",
    href: "/ukulele",
  },
  {
    icon: Music4,
    title: "虚拟小提琴",
    desc: "弓弦音色，可视化音符并标记、分享与录音回放。",
    href: "/violin",
  },
  {
    icon: Drum,
    title: "虚拟架子鼓",
    desc: "打击垫 + 电脑键盘敲击，练习底鼓军镲配合。",
    href: "/drum-kit",
  },
  {
    icon: Grid3x3,
    title: "鼓机",
    desc: "16 步进音序器，编排鼓点并循环播放。",
    href: "/drum-machine",
  },
  {
    icon: Bell,
    title: "虚拟钟琴",
    desc: "明亮金属铃声，适合演奏清脆旋律。",
    href: "/glockenspiel",
  },
  {
    icon: Waves,
    title: "虚拟木琴",
    desc: "木质短促音色，颗粒清晰。",
    href: "/xylophone",
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
