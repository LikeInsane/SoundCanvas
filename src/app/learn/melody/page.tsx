import Link from "next/link";

/**
 * 旋律入门页：音高、单音与旋律
 */
export default function MelodyLearnPage() {
  return (
    <article className="prose prose-invert max-w-none">
      <h2 className="text-xl font-semibold text-brand-heading">旋律入门</h2>

      <div className="mt-6 space-y-4 text-brand-text text-sm leading-relaxed">
        <p>
          <strong className="text-brand-heading">音高</strong>
          ：每个音都有高低，用 C、D、E、F、G、A、B 表示基本音名，数字表示所在八度（如 C4 表示中央 C）。音高是旋律的「线条」：一连串不同音高按时间排列，就形成旋律。
        </p>
        <p>
          <strong className="text-brand-heading">单音与旋律</strong>
          ：单音是旋律的基本单位。一段旋律由多个单音组成，每个音有音高、开始时间、持续时长。在编曲中，旋律轨通常放在节奏与和弦之上，是人耳最容易记住的部分。
        </p>
        <p>
          <strong className="text-brand-heading">与和弦配合</strong>
          ：好的旋律往往多用当前小节和弦内的音（和弦音），偶尔用和弦外音增加张力。在沙盒里先定好和弦，再在旋律轨上按拍子摆放音符，会更容易写出和谐又好听的乐句。
        </p>
      </div>

      <div className="mt-8 p-4 rounded-xl bg-brand-card border border-brand-border">
        <p className="text-brand-muted text-xs">
          示例音频待接入。在编曲沙盒的旋律轨中，你可以按时间格点击添加音符，用 C4～C5 等音高编织自己的第一段旋律。
        </p>
      </div>

      <div className="mt-8 flex gap-6">
        <Link
          href="/learn/chords"
          className="text-sm font-medium text-brand-muted hover:text-brand-text transition-colors cursor-pointer"
        >
          ← 和弦入门
        </Link>
        <Link
          href="/sandbox"
          className="text-sm font-medium text-brand-cta hover:text-brand-cta-hover transition-colors cursor-pointer"
        >
          去编曲沙盒试试 →
        </Link>
      </div>
    </article>
  );
}
