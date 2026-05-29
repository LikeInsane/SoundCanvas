import Link from "next/link";

/**
 * 爵士分支：从 0 到 1 完整学习方案
 */
export default function JazzStylePage() {
  return (
    <article className="prose prose-invert max-w-none">
      <h2 className="text-xl font-semibold text-brand-heading">爵士编曲</h2>
      <p className="mt-2 text-brand-text text-sm leading-relaxed">
        以摇摆节奏、七和弦与延伸音、即兴与色彩和声为核心，从听感建立到实战编曲的完整路径。
      </p>

      <section className="mt-8">
        <h3 className="text-lg font-semibold text-brand-heading border-b border-brand-border pb-2">
          一、风格简介与特点
        </h3>
        <div className="mt-4 space-y-3 text-brand-text text-sm leading-relaxed">
          <p>
            <strong className="text-brand-heading">爵士</strong>
            强调律动的摇摆感、和声的丰富性（七和弦、九和弦、替代和弦）以及即兴与复节奏。特点包括：Swing 八分音符、切分与反拍；251 进行、属七、小七、大七及延伸音（9、11、13）；Walking Bass、Comping 与即兴线条；Blues 与调式爵士的影响。
          </p>
          <p>
            学习目标：能写出具有爵士和声与律动感的短片段，在沙盒中运用七和弦与简单 251 进行，并为后续即兴与完整曲式打基础。
          </p>
        </div>
      </section>

      <section className="mt-8">
        <h3 className="text-lg font-semibold text-brand-heading border-b border-brand-border pb-2">
          二、前置基础
        </h3>
        <div className="mt-4 space-y-3 text-brand-text text-sm leading-relaxed">
          <p>
            需先掌握基础节奏（拍子、小节、强拍弱拍）、三和弦与自然大调常用进行（C、Am、F、G 等），以及旋律与和弦的配合。在此基础上再引入七和弦、251、Swing 节奏，会更容易理解爵士语汇。
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
            ：听标准爵士（如 Bill Evans、Miles Davis、Chet Baker）、Bossa Nova、Smooth Jazz 等。注意：贝斯 Walking 与根音进行；钢琴/吉他的 Comping 节奏型；七和弦与延伸音带来的色彩；Swing 八分与三连音的感觉。
          </p>
          <p>
            <strong className="text-brand-heading">建立审美</strong>
            ：区分「只是用了七和弦」与「真正有爵士律动与张力解决」的区别；关注 251 的解决感、反拍重音与留白。
          </p>
        </div>
      </section>

      <section className="mt-8">
        <h3 className="text-lg font-semibold text-brand-heading border-b border-brand-border pb-2">
          四、阶段二：典型元素与技法
        </h3>
        <ul className="mt-4 space-y-2 text-brand-text text-sm leading-relaxed list-disc pl-5">
          <li>
            <strong className="text-brand-heading">七和弦</strong>
            ：Cmaj7、Dm7、Em7、G7、Am7 等；属七（G7）解决到 C 或 Cmaj7 的 5–1 感；小调 251 如 Am7–D7–Gm。
          </li>
          <li>
            <strong className="text-brand-heading">251 进行</strong>
            ：在 C 大调中 Dm7–G7–Cmaj7 即为 2–5–1；可循环 8 小节作为入门练习；熟练后可加 9、13 等延伸音。
          </li>
          <li>
            <strong className="text-brand-heading">节奏与律动</strong>
            ：Swing 将八分变成「长-短」感觉；军鼓/Hi-hat 可放在反拍（2、4 拍）；底鼓不必每拍都打，可与贝斯线条配合。
          </li>
          <li>
            <strong className="text-brand-heading">旋律与即兴</strong>
            ：多用和弦音与调内音，适当使用蓝调音与经过音；沙盒中可先写固定旋律，再在 DAW 中尝试即兴变奏。
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
            ：除 251 外，可练 I–vi–ii–V、I–IV–iii–vi 等；小调中 Am7–D7–Gm7 的 251；属七替代与 II–V 转调是进阶内容。
          </p>
          <p>
            <strong className="text-brand-heading">曲式</strong>
            ：入门可 8 小节或 16 小节循环；AABA、主歌–副歌形式在爵士标准曲中常见；前奏/尾奏可只用 1–2 个和弦持续。
          </p>
        </div>
      </section>

      <section className="mt-8">
        <h3 className="text-lg font-semibold text-brand-heading border-b border-brand-border pb-2">
          六、阶段四：实战编曲步骤
        </h3>
        <ol className="mt-4 space-y-2 text-brand-text text-sm leading-relaxed list-decimal pl-5">
          <li>选定调性（如 C 大调），写出 Dm7–G7–Cmaj7 的 251 循环（每小节 1 个或 2 个和弦）。</li>
          <li>节奏轨：4/4，底鼓可轻或只在强拍，军鼓在 2、4 拍，Hi-hat 或镲片做 Swing 感（沙盒中可用现有鼓组模拟）。</li>
          <li>和弦轨：用七和弦按 251 铺满 4–8 小节。</li>
          <li>旋律轨：用 C 大调音阶与和弦内音写 1–2 句旋律，可带一点切分与延留。</li>
          <li>听整体，调整律动与密度，再尝试替换为其他调的 251。</li>
        </ol>
      </section>

      <section className="mt-8">
        <h3 className="text-lg font-semibold text-brand-heading border-b border-brand-border pb-2">
          七、推荐练习与曲目
        </h3>
        <div className="mt-4 space-y-3 text-brand-text text-sm leading-relaxed">
          <p>
            在沙盒中做 8 小节 251 循环（Dm7–G7–Cmaj7 x2）+ 节奏 + 简单旋律；再尝试 Am7–D7–Gm7 小调 251。可参考：Autumn Leaves、Blue Bossa 等标准曲的和声与结构；各类爵士钢琴 Comping 教程。
          </p>
        </div>
      </section>

      <section className="mt-8">
        <h3 className="text-lg font-semibold text-brand-heading border-b border-brand-border pb-2">
          八、在沙盒中的实践建议
        </h3>
        <div className="mt-4 space-y-3 text-brand-text text-sm leading-relaxed">
          <p>
            若沙盒当前仅支持三和弦，可先用 C、G、Am、Dm 等模拟 251 的根音进行（Dm–G–C），旋律上多用 7 音、9 音色彩来靠近爵士感。节奏轨强调 2、4 拍与稀疏底鼓。保存后可在 DAW 中替换为真实七和弦与爵士音色，并扩展为完整曲式。
          </p>
        </div>
      </section>

      <div className="mt-10 flex flex-wrap gap-4">
        <Link href="/learn/styles" className="text-sm font-medium text-brand-muted hover:text-brand-text transition-colors cursor-pointer">← 返回风格路线</Link>
        <Link href="/sandbox?preset=style-jazz" className="text-sm font-medium text-brand-cta hover:text-brand-cta-hover transition-colors cursor-pointer">在沙盒中练习</Link>
      </div>
    </article>
  );
}
