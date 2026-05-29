import Link from "next/link";

/**
 * 国风分支：从 0 到 1 完整学习方案
 */
export default function GuofengStylePage() {
  return (
    <article className="prose prose-invert max-w-none">
      <h2 className="text-xl font-semibold text-brand-heading">国风编曲</h2>
      <p className="mt-2 text-brand-text text-sm leading-relaxed">
        以五声调式、民族乐器音色与东方意境为核心，从听感建立到实战编曲的完整路径。
      </p>

      <section className="mt-8">
        <h3 className="text-lg font-semibold text-brand-heading border-b border-brand-border pb-2">
          一、风格简介与特点
        </h3>
        <div className="mt-4 space-y-3 text-brand-text text-sm leading-relaxed">
          <p>
            <strong className="text-brand-heading">国风</strong>
            在编曲中常指以中国民族调式、传统乐器音色与东方美学为底色的现代曲风。特点包括：以
            宫、商、角、徵、羽 五声为主，少用或慎用 4、7（偏音）；常用古筝、笛子、二胡、琵琶等音色或采样；节奏上可结合现代律动，但留白与气息感很重要；和声上除三和弦外常用加二度、加六度等色彩音。
          </p>
          <p>
            学习目标：能独立完成一段具有国风辨识度的编曲（含节奏、和弦、旋律轨），并能在沙盒中运用五声阶与简单民族色彩和声。
          </p>
        </div>
      </section>

      <section className="mt-8">
        <h3 className="text-lg font-semibold text-brand-heading border-b border-brand-border pb-2">
          二、前置基础
        </h3>
        <div className="mt-4 space-y-3 text-brand-text text-sm leading-relaxed">
          <p>
            建议先完成本站的 <strong>节奏、和弦、旋律</strong> 入门：理解拍子与小节、强拍弱拍；掌握 C/Am/F/G 等基础三和弦及自然大调进行；理解音高、单音与和弦内音旋律。在此基础上再进入五声调式与国风特有技法，会更容易上手。
          </p>
          <p>
            若尚未学完基础，可先
            <Link href="/learn/rhythm" className="text-brand-cta hover:underline mx-1">
              节奏入门
            </Link>
            、
            <Link href="/learn/chords" className="text-brand-cta hover:underline mx-1">
              和弦入门
            </Link>
            、
            <Link href="/learn/melody" className="text-brand-cta hover:underline mx-1">
              旋律入门
            </Link>
            再回到本页。
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
            ：大量听国风流行、古风、游戏配乐（如《原神》《天涯明月刀》部分曲目）、影视 OST。注意：主旋律是否以五声为主、哪里用了偏音；伴奏里民族乐器与电子/钢琴的搭配；低音与鼓的律动是偏传统还是偏现代。
          </p>
          <p>
            <strong className="text-brand-heading">建立审美标准</strong>
            ：能分辨「只是挂了古风名字」与「真正用调式与音色说话」的区别。关注留白、气息与强弱对比，而不只是堆砌音色。
          </p>
        </div>
      </section>

      <section className="mt-8">
        <h3 className="text-lg font-semibold text-brand-heading border-b border-brand-border pb-2">
          四、阶段二：典型元素与技法
        </h3>
        <ul className="mt-4 space-y-2 text-brand-text text-sm leading-relaxed list-disc pl-5">
          <li>
            <strong className="text-brand-heading">五声调式</strong>
            ：以 C 宫为例，五声为 C D E G A（宫商角徵羽）。写旋律时优先用这五个音；需要色彩时再引入 4（清角）或 7（变宫），通常作为经过音或点缀。
          </li>
          <li>
            <strong className="text-brand-heading">民族色彩和声</strong>
            ：在 C 宫下可常用 C、Dm、Em、G、Am 等；可尝试 Cadd2、Cadd9、G/B 等带二度/六度的色彩和弦；少用强烈属七解决，多用平稳进行与平行进行。
          </li>
          <li>
            <strong className="text-brand-heading">节奏与律动</strong>
            ：可 4/4 为主，底鼓军鼓可偏现代；加花或过门处可参考中国鼓的轻重与疏密；适当留空拍，避免每拍都填满。
          </li>
          <li>
            <strong className="text-brand-heading">音色选择</strong>
            ：旋律轨可选用笛、古筝、二胡等仿真音色；Pad 可用带民族感的合成器或弦乐；沙盒中若暂无民族音色，可先用钢琴或柔和的 Synth 练结构和调式，再在 DAW 中替换音色。
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
            ：国风常用 I – V – vi – IV、I – IV – I – V 等顺滑进行；可尝试 宫–徵–角–羽 的调式内进行（如 C – G – Em – Am）。避免过于「西洋」的 V7–I 强解决，多用三度、四度平稳连接。
          </p>
          <p>
            <strong className="text-brand-heading">曲式</strong>
            ：入门可采用 前奏–主歌–副歌–主歌–副歌–尾奏 的简单结构；主歌可稀疏一些，副歌再铺满；前奏/尾奏可只用 1–2 件乐器突出氛围。
          </p>
        </div>
      </section>

      <section className="mt-8">
        <h3 className="text-lg font-semibold text-brand-heading border-b border-brand-border pb-2">
          六、阶段四：实战编曲步骤
        </h3>
        <ol className="mt-4 space-y-2 text-brand-text text-sm leading-relaxed list-decimal pl-5">
          <li>定调与调式：选 C 宫（或 G 宫等），列出该调五声音阶。</li>
          <li>设计节奏轨：4/4，先做 8 小节底鼓+军鼓基本型，再在部分小节加花或留白。</li>
          <li>设计和弦进行：每小节一个和弦，用五声调式内和弦写 4–8 小节循环。</li>
          <li>写旋律：在五声为主的前提下，按小节在旋律轨上写 1–2 乐句，注意与和弦的协和与呼吸感。</li>
          <li>听整体，调整强弱与密度，必要时加入简单前奏/尾奏。</li>
        </ol>
      </section>

      <section className="mt-8">
        <h3 className="text-lg font-semibold text-brand-heading border-b border-brand-border pb-2">
          七、推荐练习与曲目
        </h3>
        <div className="mt-4 space-y-3 text-brand-text text-sm leading-relaxed">
          <p>
            在沙盒中先做 8 小节「纯五声」旋律+和弦练习；再尝试加入 1–2 个偏音（4 或 7）作为经过音。可参考曲目：如《青花瓷》《卷珠帘》等流行国风的主旋律与和声走向；游戏/影视 OST 中的短片段，模仿其节奏密度与音色搭配。
          </p>
        </div>
      </section>

      <section className="mt-8">
        <h3 className="text-lg font-semibold text-brand-heading border-b border-brand-border pb-2">
          八、在沙盒中的实践建议
        </h3>
        <div className="mt-4 space-y-3 text-brand-text text-sm leading-relaxed">
          <p>
            节奏轨：用现有鼓组做 4/4 基础律动，注意强拍弱拍分布；可少打几拍制造留白。和弦轨：选 C、G、Am、Em、Dm 等，避免 F、B 等偏音多的和弦（若用 C 宫）。旋律轨：只用 C D E G A 写第一版，再在个别音上尝试 F 或 B 作为装饰。保存作品后多听几遍，再考虑加 Pad 或第二旋律（在完整 DAW 中实现）。
          </p>
        </div>
      </section>

      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          href="/learn/styles"
          className="text-sm font-medium text-brand-muted hover:text-brand-text transition-colors cursor-pointer"
        >
          ← 返回风格路线
        </Link>
        <Link
          href="/sandbox?preset=style-guofeng"
          className="text-sm font-medium text-brand-cta hover:text-brand-cta-hover transition-colors cursor-pointer"
        >
          在沙盒中练习
        </Link>
      </div>
    </article>
  );
}
