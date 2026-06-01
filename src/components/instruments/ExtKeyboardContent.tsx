"use client";

import { useState } from "react";
import { KeyboardInstrument } from "@/components/instruments/KeyboardInstrument";
import { playExtMidi, playSynthMidi } from "@/lib/instrument-audio";
import type { SynthWave } from "@/lib/sampler";
import type { ExportInstrument } from "@/lib/wav-export";

/** 键盘类扩展乐器的种类 */
export type KeyboardKind = "synth" | "violin" | "glockenspiel" | "xylophone";

interface KindConfig {
  title: string;
  desc: string;
  sharePath: string;
  exportInstrument: ExportInstrument;
  defaultOctave: number;
  octaves: number[];
  duration: number;
}

const CONFIG: Record<KeyboardKind, KindConfig> = {
  synth: {
    title: "虚拟合成器",
    desc: "可切换波形的减法合成器，用鼠标或电脑键盘弹奏，标记音符、分享与录音回放。",
    sharePath: "/synth",
    exportInstrument: "synth",
    defaultOctave: 4,
    octaves: [2, 3, 4, 5],
    duration: 0.9,
  },
  violin: {
    title: "虚拟小提琴",
    desc: "弓弦音色，慢起音、长延音；可视化音符并标记、分享、录音回放。",
    sharePath: "/violin",
    exportInstrument: "violin",
    defaultOctave: 4,
    octaves: [3, 4, 5, 6],
    duration: 1.4,
  },
  glockenspiel: {
    title: "虚拟钟琴",
    desc: "明亮金属铃声，适合演奏清脆的旋律；可标记音符、分享与录音回放。",
    sharePath: "/glockenspiel",
    exportInstrument: "glockenspiel",
    defaultOctave: 5,
    octaves: [4, 5, 6],
    duration: 1.2,
  },
  xylophone: {
    title: "虚拟木琴",
    desc: "木质短促音色，颗粒清晰；可标记音符、分享与录音回放。",
    sharePath: "/xylophone",
    exportInstrument: "xylophone",
    defaultOctave: 5,
    octaves: [4, 5, 6],
    duration: 0.5,
  },
};

const WAVES: Array<{ id: SynthWave; label: string }> = [
  { id: "sawtooth", label: "锯齿波" },
  { id: "square", label: "方波" },
  { id: "triangle", label: "三角波" },
  { id: "sine", label: "正弦波" },
];

/**
 * 键盘类扩展乐器内容：根据 kind 注入对应音色，合成器额外提供波形选择。
 */
export function ExtKeyboardContent({ kind }: { kind: KeyboardKind }) {
  const cfg = CONFIG[kind];
  const [wave, setWave] = useState<SynthWave>("sawtooth");

  const play =
    kind === "synth"
      ? (midi: number, gain: number) => playSynthMidi(midi, wave, cfg.duration, gain)
      : (midi: number, gain: number) => playExtMidi(kind, midi, cfg.duration, gain);

  const controls =
    kind === "synth" ? (
      <div className="flex items-center gap-2">
        <span className="text-xs text-brand-muted">波形</span>
        {WAVES.map((w) => (
          <button
            key={w.id}
            onClick={() => setWave(w.id)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              wave === w.id
                ? "bg-brand-cta text-white"
                : "bg-brand-card border border-brand-border text-brand-muted hover:text-brand-text"
            }`}
          >
            {w.label}
          </button>
        ))}
      </div>
    ) : null;

  return (
    <KeyboardInstrument
      title={cfg.title}
      desc={cfg.desc}
      sharePath={cfg.sharePath}
      exportInstrument={cfg.exportInstrument}
      play={play}
      defaultOctave={cfg.defaultOctave}
      octaves={cfg.octaves}
      controls={controls}
    />
  );
}
