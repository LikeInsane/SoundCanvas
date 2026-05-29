import Link from "next/link";

/**
 * 日系分支：从 0 到 1 完整学习方案
 */
export default function JapaneseStylePage() {
  return (
    <article className="prose prose-invert max-w-none">
      <h2 className="text-xl font-semibold text-brand-heading">日系编曲</h2>
      <p className="mt-2 text-brand-text text-sm leading-relaxed">
        以 J-Pop、动漫与治愈系编曲的典型和声、音色与结构为核心，从听感建立到实战编曲的完整路径。
      </p>

      <section className="mt-8">
        <h3 className="text-lg font-semibold text-brand-heading border-b border-brand-border pb-2">
          一、风格简介与特点
        </h3>
        <div className="mt-4 space-y-3 text-brand-text text-sm leading-relaxed">
          <p>
            <strong className="text-brand-heading">日系</strong>
            编曲常指 J-Pop、动漫 OP/ED、游戏 BGM 与治愈系音乐。特点包括：和声上喜用大调明亮色彩、IV–V–iii–vi 等「日系进行」、副属与转位；节奏以 4/4 为主，副歌常 8 分驱动；音色上钢琴、电钢、弦乐、清音吉他、合成器 Pad 搭配清晰；结构上主歌–副歌分明，Bridge 与 C 段常有转调或情绪起伏。
          </p>
          <p>
            学习目标：能写出具有日系辨识度的短片段（和声进行 + 节奏型 + 旋律感），在沙盒中运用典型进行与清晰织体，为完整 J-Pop/动漫风编曲打基础。
          </p>
        </div>
      </section>

      <section className="mt-8">
        <h3 className="text-lg font-semibold text-brand-heading border-b border-brand-border pb-2">
          二、前置基础
        </h3>
        <div className="mt-4 space-y-3 text-brand-text text-sm leading-relaxed">
          <p>
            需掌握节奏（拍子、小节、强拍弱拍）、三和弦与自然大调进行（C、Am、F、G 等），以及旋律与和弦的配合。在此基础上再学习日系特有进行（如 IV–V–iii–vi、副属和弦）与曲式，会更容易上手。
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
            ：听经典 J-Pop、动漫 OP/ED、RPG 与治愈系 BGM。注意：副歌的和声进行（尤其 IV–V–iii–vi、I–V–vi–IV 等）；主旋律的起伏与重复动机；鼓组与贝斯的简洁与推动感；钢琴/弦乐/合成器的分层方式。
          </p>
          <p>
            <strong className="text-brand-heading">建立审美</strong>
            ：区分「只是用了钢琴」与「有日系和声与织体逻辑」；关注副歌的明亮感、Bridge 的转调与情绪的收放。
          </p>
        </div>
      </section>

      <section className="mt-8">
        <h3 className="text-lg font-semibold text-brand-heading border-b border-brand-border pb-2">
          四、阶段二：典型元素与技法
        </h3>
        <ul className="mt-4 space-y-2 text-brand-text text-sm leading-relaxed list-disc pl-5">
          <li>
            <strong className="text-brand-heading">日系和声进行</strong>
            ：C 大调中 F–G–Em–Am（IV–V–iii–vi）非常常见；I–V–vi–IV、I–IV–V–IV 等；副属如 C–C7–F、G–G7–C 增加张力；可多用三和弦与加音（add9、sus4）。
          </li>
          <li>
            <strong className="text-brand-heading">节奏与织体</strong>
            ：4/4，主歌可稀疏，副歌 8 分律动加强；底鼓常 1、3 或四拍，军鼓 2、4；钢琴/吉他分解或柱式与弦乐 Pad 分层清晰。
          </li>
          <li>
            <strong className="text-brand-heading">旋律</strong>
            ：大调为主，旋律线起伏明显、动机重复；副歌常在高音区与长音；可带少量装饰音与延留。
          </li>
          <li>
            <strong className="text-brand-heading">音色</strong>
            ：钢琴、电钢、弦乐、清音吉他、Synth Pad 是常见组合；沙盒中可先用钢琴与简单鼓组练进行与结构。
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
            ：主歌可用 I–IV–V–I、I–vi–IV–V 等；副歌用 IV–V–iii–vi、I–V–vi–IV 等推动；Bridge 可转关系小调或用 IV–iv–I 等色彩进行。
          </p>
          <p>
            <strong className="text-brand-heading">曲式</strong>
            ：Intro–主歌–副歌–主歌–副歌–Bridge–副歌–Outro；C 段（Bridge）常做情绪转折；前奏 4–8 小节，尾奏可重复副歌或渐弱。
          </p>
        </div>
      </section>

      <section className="mt-8">
        <h3 className="text-lg font-semibold text-brand-heading border-b border-brand-border pb-2">
          六、阶段四：实战编曲步骤
        </h3>
        <ol className="mt-4 space-y-2 text-brand-text text-sm leading-relaxed list-decimal pl-5">
          <li>定调（如 C 大调），选一段 4 小节副歌进行：F–G–Em–Am 或 C–G–Am–F。</li>
          <li>节奏轨：4/4，底鼓 1、3 或每拍，军鼓 2、4，可加 8 分 Hi-hat 或镲片。</li>
          <li>和弦轨：按进行铺满 4–8 小节，可每小节 1 个或 2 个和弦。</li>
          <li>旋律轨：写 1–2 句明亮、起伏的旋律，副歌感可多用高音区与长音。</li>
          <li>听整体，再试主歌段用较简和弦与稀疏织体做对比。</li>
        </ol>
      </section>

      <section className="mt-8">
        <h3 className="text-lg font-semibold text-brand-heading border-b border-brand-border pb-2">
          七、推荐练习与曲目
        </h3>
        <div className="mt-4 space-y-3 text-brand-text text-sm leading-relaxed">
          <p>
            在沙盒中做 8 小节「日系副歌」：F–G–Em–Am 循环 + 节奏 + 旋律；再试主歌 I–IV–V–I 的简化版。可参考经典 J-Pop、动漫主题曲的和声分析与编曲拆解（如 YouTube/B 站上的日系进行分析），再在 DAW 中扩展为完整曲式并丰富音色。
          </p>
        </div>
      </section>

      <section className="mt-8">
        <h3 className="text-lg font-semibold text-brand-heading border-b border-brand-border pb-2">
          八、在沙盒中的实践建议
        </h3>
        <div className="mt-4 space-y-3 text-brand-text text-sm leading-relaxed">
          <p>
            和弦轨用 C、F、G、Am、Em 等实现 F–G–Em–Am 或 C–G–Am–F；节奏轨保持清晰 2、4 与 8 分驱动；旋律轨写一段易记、有起伏的副歌句。保存后在 DAW 中加入钢琴分解、弦乐 Pad 与第二吉他等，并扩展主歌、Bridge 与前尾奏。
          </p>
        </div>
      </section>

      <div className="mt-10 flex flex-wrap gap-4">
        <Link href="/learn/styles" className="text-sm font-medium text-brand-muted hover:text-brand-text transition-colors cursor-pointer">← 返回风格路线</Link>
        <Link href="/sandbox?preset=style-japanese" className="text-sm font-medium text-brand-cta hover:text-brand-cta-hover transition-colors cursor-pointer">在沙盒中练习</Link>
      </div>
    </article>
  );
}
