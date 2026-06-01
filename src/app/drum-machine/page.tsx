import { DrumMachine } from "@/components/instruments/DrumMachine";

/**
 * 鼓机页：16 步进音序器，编辑并循环播放鼓点。
 */
export default function DrumMachinePage() {
  return (
    <main className="min-h-screen pt-16">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-brand-heading">鼓机</h1>
          <p className="mt-1 text-sm text-brand-muted">
            在步进网格上编排你的鼓点，调整速度并循环播放，创作属于自己的节奏。
          </p>
        </div>
        <DrumMachine />
      </div>
    </main>
  );
}
