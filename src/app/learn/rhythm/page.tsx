import Link from "next/link";

/**
 * 节奏入门页：拍子、小节、强拍弱拍
 */
export default function RhythmLearnPage() {
  return (
    <article className="prose prose-invert max-w-none">
      <h2 className="text-xl font-semibold text-brand-heading">节奏入门</h2>

      <div className="mt-6 space-y-4 text-brand-text text-sm leading-relaxed">
        <p>
          <strong className="text-brand-heading">拍子</strong>
          ：音乐中的时间单位。就像心跳一样，一拍一拍均匀地走。常见速度用 BPM（每分钟多少拍）表示，例如 120 BPM 表示每分钟 120 拍。
        </p>
        <p>
          <strong className="text-brand-heading">小节</strong>
          ：把拍子按固定数量分组，就得到小节。例如 4/4 拍表示每小节 4 拍，每拍为一四分音符。小节让音乐有清晰的「格子」，便于编排和记忆。
        </p>
        <p>
          <strong className="text-brand-heading">强拍与弱拍</strong>
          ：在一小节内，通常第 1 拍是强拍，其余为弱拍或次强拍。鼓点常放在强拍（如底鼓）和弱拍（如军鼓）上，形成我们熟悉的节奏型。
        </p>
      </div>

      <div className="mt-8 p-4 rounded-xl bg-brand-card border border-brand-border">
        <p className="text-brand-muted text-xs">
          示例音频待接入。在编曲沙盒中，你可以用节奏轨亲自摆放鼓点，感受强拍与弱拍的区别。
        </p>
      </div>

      <div className="mt-8">
        <Link
          href="/learn/chords"
          className="text-sm font-medium text-brand-cta hover:text-brand-cta-hover transition-colors cursor-pointer"
        >
          下一步：和弦入门 →
        </Link>
      </div>
    </article>
  );
}
