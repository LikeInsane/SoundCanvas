import Link from "next/link";

/**
 * RnB 分支：从 0 到 1 完整学习方案
 */
export default function RnBStylePage() {
  return (
    <article className="prose prose-invert max-w-none">
      <h2 className="text-xl font-semibold text-brand-heading">RnB 编曲</h2>
      <p className="mt-2 text-brand-text text-sm leading-relaxed">
        以律动、转音、七和弦与都市感为核心，从听感建立到实战编曲的完整路径。
      </p>

      <section className="mt-8">
        <h3 className="text-lg font-semibold text-brand-heading border-b border-brand-border pb-2">
          一、风格简介与特点
        </h3>
        <div className="mt-4 space-y-3 text-brand-text text-sm leading-relaxed">
          <p>
            <strong className="text-brand-heading">RnB</strong>
            （节奏布鲁斯）强调 Groove、反拍与弹性节奏；和声上常用七和弦、九和弦与平滑进行；人声或旋律常带转音、滑音与切分。特点包括：鼓组偏 Hip-Hop/Soul 的律动（底鼓、军鼓、Hi-hat 的错位与摇摆）；贝斯线条与底鼓的配合；键盘/合成器的 Pad 与和声层；旋律的装饰音与即兴感。
          </p>
          <p>
            学习目标：能做出具有 RnB 律动与和声色彩的短片段，在沙盒中运用反拍节奏与七和弦色彩，为完整编曲打基础。
          </p>
        </div>
      </section>

      <section className="mt-8">
        <h3 className="text-lg font-semibold text-brand-heading border-b border-brand-border pb-2">
          二、前置基础
        </h3>
        <div className="mt-4 space-y-3 text-brand-text text-sm leading-relaxed">
          <p>
            需掌握节奏（拍子、强弱、小节）、三和弦与常用进行（C、Am、F、G），以及旋律与和弦的配合。在此基础上再引入反拍、七和弦与律动设计，会更容易抓住 RnB 的感觉。
          </p>
          <p>
            若尚未学完，可先完成
            <Link href="/learn/rhythm" className="text-brand-cta hover:underline mx-1">节奏</Link>
            、
            <Link href="/learn/chords" className="text-brand-cta hover:underline mx-1">和弦</Link>
            、
            <Link href="/learn/melody" className="text-brand-cta hover:underline mx-1">旋律</Link>
            入门再回到本页。
          </p>
        </div>
      </section>

      <section className="mt-8">
        <h3 className="text-lg font-semibold text-brand-heading border-b border-brand-border pb-2">
          三、阶段一：听感与审美
        </h3>
        <div className="mt-4 space-y-3 text-brand-text text-sm leading-relaxed">
          <p>
            <strong className="text-brand-heading">多听</strong>
            ：听经典 RnB、Neo-Soul、Contemporary RnB（如 SZA、Daniel Caesar、H.E.R.）。注意：鼓的 Groove 与 Hi-hat 的细碎节奏；贝斯与底鼓的「锁」与「松」；和声的七和弦与转位；人声/主旋律的转音与节奏错位。
          </p>
          <p>
            <strong className="text-brand-heading">建立审美</strong>
            ：区分「只是慢歌」与「有 RnB 律动与和声张力」；关注反拍、拖拍与留白带来的弹性。
          </p>
        </div>
      </section>

      <section className="mt-8">
        <h3 className="text-lg font-semibold text-brand-heading border-b border-brand-border pb-2">
          四、阶段二：典型元素与技法
        </h3>
        <ul className="mt-4 space-y-2 text-brand-text text-sm leading-relaxed list-disc pl-5">
          <li>
            <strong className="text-brand-heading">律动</strong>
            ：4/4 下底鼓不必每拍都有，常与贝斯对齐；军鼓在 2、4 或反拍；Hi-hat 可 8 分、16 分或带偏移，制造 Swing 感。沙盒中可先做简单 2、4 拍军鼓与稀疏底鼓。
          </li>
          <li>
            <strong className="text-brand-heading">和声</strong>
            ：Cmaj7、Dm7、Em7、G7、Am7 等七和弦常用；进行如 Cmaj7–Am7–Fmaj7–G7、I–iii–IV–V 等；可加 9 音、挂留增加色彩。
          </li>
          <li>
            <strong className="text-brand-heading">旋律与转音</strong>
            ：旋律可多用和弦内音与延伸音，节奏上切分、延留、短促装饰；在 DAW 中可进一步做滑音与转音。
          </li>
          <li>
            <strong className="text-brand-heading">音色</strong>
            ：键盘 Pad、电钢琴、合成器 Pluck 常见；沙盒中可用柔和钢琴或 Synth 先练结构和律动。
          </li>
        </ul>
      </section>

      <section className="mt-8">
        <h3 className="text-lg font-semibold text-brand-heading border-b border-brand-border pb-2">
          五、阶段三：和声与曲式
        </h3>
        <div className="mt-4 space-y-3 text-brand-text text-sm leading-relaxed">
          <p>
            <strong className="text-brand-heading">和声进行</strong>
            ：常见 I–vi–IV–V、I–iii–IV–V、vi–IV–I–V 等；副歌常用更密集的和弦与高音区；桥段可转调或用相对小调。
          </p>
          <p>
            <strong className="text-brand-heading">曲式</strong>
            ：主歌–预副歌–副歌–桥段–副歌；主歌可编配较简，副歌加厚 Pad 与律动；前奏/尾奏可留 4–8 小节做氛围。
          </p>
        </div>
      </section>

      <section className="mt-8">
        <h3 className="text-lg font-semibold text-brand-heading border-b border-brand-border pb-2">
          六、阶段四：实战编曲步骤
        </h3>
        <ol className="mt-4 space-y-2 text-brand-text text-sm leading-relaxed list-decimal pl-5">
          <li>定调（如 C），选一个 4 小节循环的和声进行（如 Cmaj7–Am7–Fmaj7–G7）。</li>
          <li>节奏轨：4/4，底鼓在 1、3 或 1、2、3、4 上做变化，军鼓 2、4，Hi-hat 或镲片做 8 分或 16 分（沙盒中用现有鼓组）。</li>
          <li>和弦轨：按进行铺满 4–8 小节；若沙盒仅支持三和弦，用 C、Am、F、G 并让旋律带 7 音色彩。</li>
          <li>旋律轨：写 1–2 句主旋律，多用切分与和弦内音，可留出呼吸感。</li>
          <li>听整体，调整鼓的疏密与旋律的节奏弹性。</li>
        </ol>
      </section>

      <section className="mt-8">
        <h3 className="text-lg font-semibold text-brand-heading border-b border-brand-border pb-2">
          七、推荐练习与曲目
        </h3>
        <div className="mt-4 space-y-3 text-brand-text text-sm leading-relaxed">
          <p>
            在沙盒中做 8 小节 RnB 律动 + 七和弦进行（或三和弦模拟）+ 简单旋律；可参考经典 RnB 曲目的和弦进行与鼓点型（如 90 年代 R&B、Neo-Soul 歌单），再在 DAW 中细化 Hi-hat 与转音。
          </p>
        </div>
      </section>

      <section className="mt-8">
        <h3 className="text-lg font-semibold text-brand-heading border-b border-brand-border pb-2">
          八、在沙盒中的实践建议
        </h3>
        <div className="mt-4 space-y-3 text-brand-text text-sm leading-relaxed">
          <p>
            节奏轨重点做 2、4 拍军鼓与有弹性的底鼓型；和弦用 C–Am–F–G 或 C–Em–F–G 等，旋律上多用 7 音、9 音与切分来靠近 RnB 色彩。保存后在 DAW 中替换为七和弦、电钢/Pad 音色，并加入贝斯线与人声转音。
          </p>
        </div>
      </section>

      <div className="mt-10 flex flex-wrap gap-4">
        <Link href="/learn/styles" className="text-sm font-medium text-brand-muted hover:text-brand-text transition-colors cursor-pointer">← 返回风格路线</Link>
        <Link href="/sandbox?preset=style-rnb" className="text-sm font-medium text-brand-cta hover:text-brand-cta-hover transition-colors cursor-pointer">在沙盒中练习</Link>
      </div>
    </article>
  );
}
