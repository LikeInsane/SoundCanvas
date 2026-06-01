import { DrumPads } from "@/components/instruments/DrumPads";

/**
 * 虚拟架子鼓页：打击垫 + 电脑键盘敲击。
 */
export default function DrumKitPage() {
  return (
    <main className="min-h-screen pt-16">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-brand-heading">虚拟架子鼓</h1>
          <p className="mt-1 text-sm text-brand-muted">
            点击打击垫或用电脑键盘敲击，练习底鼓、军鼓、镲片与嗵鼓的配合。
          </p>
        </div>
        <DrumPads />
      </div>
    </main>
  );
}
