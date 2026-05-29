import Link from "next/link";

/**
 * 风格路线首页：六条学习分支入口
 */
const STYLE_BRANCHES = [
  { id: "guofeng", label: "国风", desc: "五声调式、民族乐器与东方意境" },
  { id: "jazz", label: "爵士", desc: "摇摆节奏、七和弦与即兴" },
  { id: "rnb", label: "RnB", desc: "律动、转音与都市感" },
  { id: "japanese", label: "日系", desc: "J-Pop、动漫与治愈系编曲" },
  { id: "electronic", label: "电子", desc: "合成器、律动与舞曲结构" },
  { id: "scoring", label: "配乐", desc: "影视与游戏中的情绪与叙事" },
] as const;

export default function StylesPage() {
  return (
    <article className="prose prose-invert max-w-none">
      <h2 className="text-xl font-semibold text-brand-heading">风格路线</h2>
      <p className="mt-2 text-brand-text text-sm leading-relaxed">
        在掌握节奏、和弦、旋律基础后，可选择一条风格分支进行从 0 到 1 的深入学习。每条路线包含听感建立、典型元素、和声曲式与实战编曲的完整方案。
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {STYLE_BRANCHES.map((branch) => (
          <div key={branch.id} className="p-5 rounded-xl bg-brand-card border border-brand-border hover:border-brand-cta/50 transition-colors">
            <Link href={`/learn/styles/${branch.id}`} className="block">
              <h3 className="text-base font-semibold text-brand-heading">
                {branch.label}
              </h3>
              <p className="mt-1 text-sm text-brand-muted">{branch.desc}</p>
            </Link>
            <Link
              href={`/sandbox?preset=style-${branch.id}`}
              className="mt-3 inline-block text-sm font-medium text-brand-cta hover:text-brand-cta-hover transition-colors cursor-pointer"
            >
              在沙盒中练习
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Link
          href="/learn/rhythm"
          className="text-sm font-medium text-brand-muted hover:text-brand-text transition-colors cursor-pointer"
        >
          ← 返回节奏入门
        </Link>
      </div>
    </article>
  );
}
