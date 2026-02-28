import Link from "next/link";

/**
 * 和弦入门页：什么是和弦，C/Am/F/G 等
 */
export default function ChordsLearnPage() {
  return (
    <article className="prose prose-invert max-w-none">
      <h2 className="text-xl font-semibold text-brand-heading">和弦入门</h2>

      <div className="mt-6 space-y-4 text-brand-text text-sm leading-relaxed">
        <p>
          <strong className="text-brand-heading">什么是和弦</strong>
          ：和弦是由多个音同时（或按顺序）发出的组合。它决定了一段音乐的情绪底色：明亮、忧伤、紧张或放松。流行歌里常见的「C、Am、F、G」就是和弦的代号。
        </p>
        <p>
          <strong className="text-brand-heading">自然大调常用和弦</strong>
          ：在 C 大调里，最常用的四个和弦是 <strong>C</strong>（主和弦）、
          <strong>Am</strong>（六级小和弦）、<strong>F</strong>（四级的下属）、
          <strong>G</strong>（五级的属和弦）。很多流行歌整首只用这四个和弦循环，就能写出好听的进行。
        </p>
        <p>
          <strong className="text-brand-heading">Dm</strong>
          ：在 C 大调中，二级小和弦 Dm 也经常出现，用来增加一点色彩。在编曲沙盒里，你可以按小节选择和弦，感受不同进行带来的情绪变化。
        </p>
      </div>

      <div className="mt-8 p-4 rounded-xl bg-brand-card border border-brand-border">
        <p className="text-brand-muted text-xs">
          示例音频待接入。建议在沙盒中先选好节奏，再为每小节配上 C、Am、F、G 等和弦，听整体效果。
        </p>
      </div>

      <div className="mt-8 flex gap-6">
        <Link
          href="/learn/rhythm"
          className="text-sm font-medium text-brand-muted hover:text-brand-text transition-colors cursor-pointer"
        >
          ← 节奏入门
        </Link>
        <Link
          href="/learn/melody"
          className="text-sm font-medium text-brand-cta hover:text-brand-cta-hover transition-colors cursor-pointer"
        >
          下一步：旋律入门 →
        </Link>
      </div>
    </article>
  );
}
