import Link from "next/link";

/**
 * 电子分支：从 0 到 1 完整学习方案
 */
export default function ElectronicStylePage() {
  return (
    <article className="prose prose-invert max-w-none">
      <h2 className="text-xl font-semibold text-brand-heading">电子编曲</h2>
      <p className="mt-2 text-brand-text text-sm leading-relaxed">
        以合成器、律动、舞曲结构与音色设计为核心，从听感建立到实战编曲的完整路径。
      </p>

      <section className="mt-8">
        <h3 className="text-lg font-semibold text-brand-heading border-b border-brand-border pb-2">
          一、风格简介与特点
        </h3>
        <div className="mt-4 space-y-3 text-brand-text text-sm leading-relaxed">
          <p>
            <strong className="text-brand-heading">电子</strong>
            涵盖 House、Techno、Future Bass、Synthwave、EDM 等子风格，共同点包括：以鼓机与合成器为核心的音色；稳定的 4/4 律动与明确的 Build–Drop 结构；Bass、Pad、Pluck、Lead 等分层；自动化与侧链等制作技法。
          </p>
          <p>
            学习目标：能做出具有电子感律动与结构的短片段，在沙盒中运用稳定节奏与简单和声进行，为在 DAW 中扩展音色与编排打基础。
          </p>
        </div>
      </section>

      <section className="mt-8">
        <h3 className="text-lg font-semibold text-brand-heading border-b border-brand-border pb-2">
          二、前置基础
        </h3>
        <div className="mt-4 space-y-3 text-brand-text text-sm leading-relaxed">
          <p>
            需掌握节奏（拍子、小节、强拍弱拍）、基础和弦与自然大调进行，以及旋律与和弦的配合。电子乐中「律动」与「结构」往往比复杂和声更重要，因此节奏轨的设计与段落安排是首要；和声可先以简单三和弦或单音 Bass 为主。
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
            ：听 House、Techno、Future Bass、Synthwave 等代表性曲目。注意：底鼓与 Bass 的配合（常 4 拍或 8 拍循环）；军鼓/Clap 在 2、4 拍的位置；Hi-hat 的 8 分、16 分与开镲；Build 与 Drop 的张力与释放；音色的厚薄与空间感。
          </p>
          <p>
            <strong className="text-brand-heading">建立审美</strong>
            ：区分「只是有鼓点」与「有清晰律动层次与段落设计」；关注能量曲线、音色统一性与低频的稳定感。
          </p>
        </div>
      </section>

      <section className="mt-8">
        <h3 className="text-lg font-semibold text-brand-heading border-b border-brand-border pb-2">
          四、阶段二：典型元素与技法
        </h3>
        <ul className="mt-4 space-y-2 text-brand-text text-sm leading-relaxed list-disc pl-5">
          <li>
            <strong className="text-brand-heading">节奏与律动</strong>
            ：4/4，底鼓每拍或每两拍；军鼓/Clap 在 2、4 拍；Hi-hat 可 8 分或 16 分，开镲放在段落切换处。沙盒中先做 8 小节稳定鼓组，再在部分小节做 Fill 或减配做 Build。
          </li>
          <li>
            <strong className="text-brand-heading">和声</strong>
            ：电子乐常用简单进行：I–V–vi–IV、I–IV–I–V、或单音 Bass + 上方 Pad/Lead；先保证低音与和弦根音清晰，再在 DAW 中加 7 音、延伸音与音色变化。
          </li>
          <li>
            <strong className="text-brand-heading">旋律与 Lead</strong>
            ：主旋律可简短、重复（Riff 式），与和弦内音配合；Pluck、Lead 音色在完整制作中再细化。
          </li>
          <li>
            <strong className="text-brand-heading">结构</strong>
            ：Intro–Verse–Build–Drop–Break–Build–Drop–Outro；入门可先做 8–16 小节「Drop」段：鼓 + Bass + 简单和弦 + 短旋律。
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
            ：电子乐常用 I–V–vi–IV、I–IV–V、vi–IV–I–V 等循环；Bass 与根音要明确；复杂和声可在 Pad 或 Breakdown 段使用。
          </p>
          <p>
            <strong className="text-brand-heading">曲式</strong>
            ：8 小节或 16 小节为单元；Intro 可只有鼓或鼓+Bass；Build 做加法（加 Hi-hat、上升音效等）；Drop 全要素进入；Break 减少鼓或只留 Pad/旋律，再 Build 到下一次 Drop。
          </p>
        </div>
      </section>

      <section className="mt-8">
        <h3 className="text-lg font-semibold text-brand-heading border-b border-brand-border pb-2">
          六、阶段四：实战编曲步骤
        </h3>
        <ol className="mt-4 space-y-2 text-brand-text text-sm leading-relaxed list-decimal pl-5">
          <li>定调（如 C），选简单进行：C–G–Am–F 或 C–Am–F–G，做 4–8 小节循环。</li>
          <li>节奏轨：4/4，底鼓每拍，军鼓 2、4，Hi-hat 8 分或 16 分（沙盒中用现有鼓组模拟）。</li>
          <li>和弦轨：按进行铺满，每小节 1 个和弦；若沙盒支持，可考虑 Bass 与和弦分开（或 Bass 跟根音）。</li>
          <li>旋律轨：写 1–2 句短 Riff 或简单 Lead 句，与和弦内音一致，可重复使用。</li>
          <li>听整体，保证律动稳定、低音清晰；在 DAW 中再扩展 Build/Drop 与音色设计。</li>
        </ol>
      </section>

      <section className="mt-8">
        <h3 className="text-lg font-semibold text-brand-heading border-b border-brand-border pb-2">
          七、推荐练习与曲目
        </h3>
        <div className="mt-4 space-y-3 text-brand-text text-sm leading-relaxed">
          <p>
            在沙盒中做 16 小节「电子 Drop」：稳定鼓组 + C–G–Am–F 循环 + 简单旋律 Riff；再试减少鼓做 4 小节「Break」对比。可参考各子风格的代表曲目结构（House/Techno/Future Bass 等），在 DAW 中学习音色设计与自动化。
          </p>
        </div>
      </section>

      <section className="mt-8">
        <h3 className="text-lg font-semibold text-brand-heading border-b border-brand-border pb-2">
          八、在沙盒中的实践建议
        </h3>
        <div className="mt-4 space-y-3 text-brand-text text-sm leading-relaxed">
          <p>
            节奏轨优先做稳：底鼓 + 军鼓 2、4 + 镲片或 Hi-hat 型；和弦轨用简单三和弦做 4–8 小节循环；旋律轨写短而重复的乐句。保存后在 DAW 中替换为合成器与电子鼓音色，并加入 Build/Drop、侧链与混音处理。
          </p>
        </div>
      </section>

      <div className="mt-10 flex flex-wrap gap-4">
        <Link href="/learn/styles" className="text-sm font-medium text-brand-muted hover:text-brand-text transition-colors cursor-pointer">← 返回风格路线</Link>
        <Link href="/sandbox?preset=style-electronic" className="text-sm font-medium text-brand-cta hover:text-brand-cta-hover transition-colors cursor-pointer">在沙盒中练习</Link>
      </div>
    </article>
  );
}
