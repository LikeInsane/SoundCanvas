import Link from "next/link";

/**
 * 配乐分支：从 0 到 1 完整学习方案
 */
export default function ScoringStylePage() {
  return (
    <article className="prose prose-invert max-w-none">
      <h2 className="text-xl font-semibold text-brand-heading">配乐编曲</h2>
      <p className="mt-2 text-brand-text text-sm leading-relaxed">
        以影视与游戏中的情绪、叙事与画面配合为核心，从听感建立到实战编曲的完整路径。
      </p>

      <section className="mt-8">
        <h3 className="text-lg font-semibold text-brand-heading border-b border-brand-border pb-2">
          一、风格简介与特点
        </h3>
        <div className="mt-4 space-y-3 text-brand-text text-sm leading-relaxed">
          <p>
            <strong className="text-brand-heading">配乐</strong>
            （Film / Game Scoring）服务于画面与剧情，强调情绪、张力与叙事弧线。特点包括：主题动机（Leitmotif）的重复与变奏；情绪类型（紧张、温暖、悲壮、悬疑等）与和声、音色、织体的对应；动态与留白（静与响的对比）；常见管弦、电子、混合编制；对白与音效的「留空」意识。
          </p>
          <p>
            学习目标：能写出具有明确情绪与简单叙事感的短片段，在沙盒中运用和声色彩与织体变化，为在 DAW 中扩展为完整 cue 打基础。
          </p>
        </div>
      </section>

      <section className="mt-8">
        <h3 className="text-lg font-semibold text-brand-heading border-b border-brand-border pb-2">
          二、前置基础
        </h3>
        <div className="mt-4 space-y-3 text-brand-text text-sm leading-relaxed">
          <p>
            需掌握节奏（拍子、小节、强弱）、基础和弦与自然大调/小调进行，以及旋律与和弦的配合。配乐中「情绪」常通过和声色彩（大/小、紧张/解决）、织体厚薄与动态变化体现，因此和弦选择与旋律动机比复杂节奏型更优先。
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
            ：听影视 OST（如 Hans Zimmer、Thomas Newman）、游戏 BGM（如《旷野之息》《原神》《只狼》等）。注意：主题动机如何在不同场景中变奏；紧张感如何用和声（减七、半音、持续低音）与织体（弦乐颤弓、不协和音）营造；温暖/治愈如何用大调、长音与简单进行；留白与静默如何参与叙事。
          </p>
          <p>
            <strong className="text-brand-heading">建立审美</strong>
            ：区分「只是背景音乐」与「有明确情绪与叙事意图」；关注动机的重复与变形、动态曲线与音色选择。
          </p>
        </div>
      </section>

      <section className="mt-8">
        <h3 className="text-lg font-semibold text-brand-heading border-b border-brand-border pb-2">
          四、阶段二：典型元素与技法
        </h3>
        <ul className="mt-4 space-y-2 text-brand-text text-sm leading-relaxed list-disc pl-5">
          <li>
            <strong className="text-brand-heading">情绪与和声</strong>
            ：温暖/希望常用大调、I–IV–V–I、长音 Pad；紧张/悬疑可用小调、减和弦、半音阶、持续低音（Pedal）；悲壮可用小调、慢速、强力度与厚重织体。沙盒中可先练「一段温暖」与「一段紧张」的对比：同一节奏，不同和弦与旋律走向。
          </li>
          <li>
            <strong className="text-brand-heading">主题动机</strong>
            ：短小、易记的旋律片段（2–4 小节），在不同段落用不同音色、调性、节奏重复或变奏；在沙盒旋律轨先写出一条动机，再在后续小节做简化或移位。
          </li>
          <li>
            <strong className="text-brand-heading">织体与动态</strong>
            ：从稀疏（单乐器或少量声部）到饱满（多声部、加鼓与 Bass）可表示情绪推进；留白与长音可表示停顿或转折。沙盒中可用「前 4 小节少、后 4 小节多」做简单对比。
          </li>
          <li>
            <strong className="text-brand-heading">节奏与律动</strong>
            ：配乐中鼓可弱化或不用；节奏轨可只做轻打击、脉冲或完全交给和弦与旋律的节奏。沙盒中可做简单 4/4 脉动或留空，重点放在和弦与旋律上。
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
            ：大调温暖：C–F–G–C、C–Am–F–G；小调紧张/悲情：Am–Dm–E–Am、Am–F–G–Am；悬疑可加 Em7b5、减七或半音 Bass；解决感用 V–I 或 IV–I。先练 4–8 小节单一情绪，再尝试「从紧张到解决」的短弧线。
          </p>
          <p>
            <strong className="text-brand-heading">曲式</strong>
            ：配乐常按画面/剧情分 cue，单段可为 8–16 小节；结构可为 A–B–A（回归主题）或 A–B（情绪转折）；前奏/尾奏可只有 Pad 或单音，突出留白。
          </p>
        </div>
      </section>

      <section className="mt-8">
        <h3 className="text-lg font-semibold text-brand-heading border-b border-brand-border pb-2">
          六、阶段四：实战编曲步骤
        </h3>
        <ol className="mt-4 space-y-2 text-brand-text text-sm leading-relaxed list-decimal pl-5">
          <li>定情绪（如「温暖」或「紧张」），选调性（大调/小调）与 4 小节和声进行。</li>
          <li>节奏轨：可轻或省略；若做脉动，用简单底鼓或轻打击，避免抢戏。</li>
          <li>和弦轨：按情绪选进行铺满 4–8 小节；可留 1–2 小节只有长音或空拍做留白。</li>
          <li>旋律轨：写 1 条 2–4 小节的主题动机，在后续小节重复或简单变奏（改音高、节奏）。</li>
          <li>听整体，调整织体厚薄（通过音符密度与长度）与动态感；在 DAW 中再扩展音色与完整 cue。</li>
        </ol>
      </section>

      <section className="mt-8">
        <h3 className="text-lg font-semibold text-brand-heading border-b border-brand-border pb-2">
          七、推荐练习与曲目
        </h3>
        <div className="mt-4 space-y-3 text-brand-text text-sm leading-relaxed">
          <p>
            在沙盒中做两段 8 小节对比：一段「温暖」（大调、简单 I–IV–V–I + 上行旋律动机）；一段「紧张」（小调、持续低音 + 半音或减和弦色彩 + 短促动机）。可参考喜欢的影视/游戏配乐片段，分析其和声与动机，再在 DAW 中模仿并扩展。
          </p>
        </div>
      </section>

      <section className="mt-8">
        <h3 className="text-lg font-semibold text-brand-heading border-b border-brand-border pb-2">
          八、在沙盒中的实践建议
        </h3>
        <div className="mt-4 space-y-3 text-brand-text text-sm leading-relaxed">
          <p>
            和弦轨与旋律轨为主：选一条明确情绪的和声进行，写一条短动机并在 8 小节内重复或变奏；节奏轨可简化或只做轻脉动。保存后在 DAW 中用弦乐、Pad、钢琴等丰富音色，并练习与画面/剧情节奏的配合（进点、出点、动态）。
          </p>
        </div>
      </section>

      <div className="mt-10 flex flex-wrap gap-4">
        <Link href="/learn/styles" className="text-sm font-medium text-brand-muted hover:text-brand-text transition-colors cursor-pointer">← 返回风格路线</Link>
        <Link href="/sandbox?preset=style-scoring" className="text-sm font-medium text-brand-cta hover:text-brand-cta-hover transition-colors cursor-pointer">在沙盒中练习</Link>
      </div>
    </article>
  );
}
