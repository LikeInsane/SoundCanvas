/**
 * 采样音色：基于 Tone.js。钢琴用官方 Salamander 采样，吉他用 PluckSynth（弦拨合成，无需采样）。
 * 仅在浏览器端惰性加载；采样未就绪前调用方应回退到合成器（由 instrument-audio 处理）。
 */

import type * as ToneNS from "tone";
import { midiToFreq } from "./music-theory";

let Tone: typeof ToneNS | null = null;
let piano: ToneNS.Sampler | null = null;
let guitar: ToneNS.PluckSynth | null = null;
let pianoLoaded = false;
let started = false;
let initPromise: Promise<void> | null = null;

/** 扩展乐器类型（音色均由 Tone.js 合成，惰性创建，无需下载额外采样） */
export type ExtInstrument = "synth" | "violin" | "glockenspiel" | "xylophone" | "bass";
/** 合成器可切换的波形 */
export type SynthWave = "sine" | "square" | "sawtooth" | "triangle";

/** 复音合成乐器缓存（按需创建，避免一次性创建过多音频节点） */
const polyCache: Partial<Record<ExtInstrument, ToneNS.PolySynth>> = {};
/** 尤克里里：独立的拨弦合成器（更亮、衰减更快） */
let ukulele: ToneNS.PluckSynth | null = null;

/** 惰性加载 Tone 与乐器实例 */
function load(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (initPromise) return initPromise;
  initPromise = (async () => {
    Tone = await import("tone");
    piano = new Tone.Sampler({
      urls: {
        A0: "A0.mp3", C1: "C1.mp3", "D#1": "Ds1.mp3", "F#1": "Fs1.mp3",
        A1: "A1.mp3", C2: "C2.mp3", "D#2": "Ds2.mp3", "F#2": "Fs2.mp3",
        A2: "A2.mp3", C3: "C3.mp3", "D#3": "Ds3.mp3", "F#3": "Fs3.mp3",
        A3: "A3.mp3", C4: "C4.mp3", "D#4": "Ds4.mp3", "F#4": "Fs4.mp3",
        A4: "A4.mp3", C5: "C5.mp3", "D#5": "Ds5.mp3", "F#5": "Fs5.mp3",
        A5: "A5.mp3", C6: "C6.mp3", "D#6": "Ds6.mp3", "F#6": "Fs6.mp3",
        A6: "A6.mp3", C7: "C7.mp3", "D#7": "Ds7.mp3", "F#7": "Fs7.mp3",
        A7: "A7.mp3", C8: "C8.mp3",
      },
      baseUrl: "https://tonejs.github.io/audio/salamander/",
      release: 1,
      onload: () => {
        pianoLoaded = true;
      },
    }).toDestination();
    guitar = new Tone.PluckSynth({ dampening: 4000, resonance: 0.9 }).toDestination();
  })();
  return initPromise;
}

// 浏览器端立即开始预加载
if (typeof window !== "undefined") {
  void load();
}

/** 首次用户手势时调用，激活音频上下文 */
export async function ensureStarted(): Promise<void> {
  await load();
  if (!started && Tone) {
    await Tone.start();
    started = true;
  }
}

/** 钢琴采样是否已加载就绪 */
export function pianoReady(): boolean {
  return pianoLoaded && !!piano;
}

/** 吉他（合成）是否就绪：Tone 加载完成即可 */
export function guitarReady(): boolean {
  return !!guitar;
}

function midiToNoteName(midi: number): string {
  if (!Tone) return "C4";
  return Tone.Frequency(midiToFreq(midi), "hz").toNote();
}

function gainToVelocity(gain: number): number {
  return Math.max(0.3, Math.min(1, gain * 4 + 0.35));
}

/** 采样钢琴：单音 */
export function samplerPlayMidi(midi: number, duration = 0.9, gain = 0.18) {
  if (!piano || !pianoLoaded || !Tone) return;
  void ensureStarted();
  piano.triggerAttackRelease(midiToNoteName(midi), duration, undefined, gainToVelocity(gain));
}

/** 采样钢琴：和弦 */
export function samplerPlayChordMidi(midis: number[], duration = 1.4, gain = 0.16) {
  if (!piano || !pianoLoaded || !Tone) return;
  void ensureStarted();
  const names = midis.map(midiToNoteName);
  piano.triggerAttackRelease(names, duration, undefined, gainToVelocity(gain));
}

/** 采样钢琴：序列（琶音/旋律） */
export function samplerPlaySequenceMidi(
  midis: number[],
  interval = 0.45,
  noteDuration = 0.7,
  gain = 0.18
) {
  if (!piano || !pianoLoaded || !Tone) return;
  void ensureStarted();
  const t0 = Tone.now();
  midis.forEach((m, i) => {
    piano!.triggerAttackRelease(midiToNoteName(m), noteDuration, t0 + i * interval, gainToVelocity(gain));
  });
}

/** 拨弦吉他：单音 */
export function samplerPlayPluck(midi: number, bright = false) {
  if (!guitar || !Tone) return;
  void ensureStarted();
  guitar.dampening = bright ? 6000 : 3000;
  guitar.triggerAttackRelease(midiToFreq(midi), 1.2);
}

/** 拨弦吉他：扫弦（按相邻间隔依次触发） */
export function samplerStrum(midis: number[], bright = false, interval = 0.04) {
  if (!guitar || !Tone) return;
  void ensureStarted();
  guitar.dampening = bright ? 6000 : 3000;
  const t0 = Tone.now();
  midis.forEach((m, i) => {
    guitar!.triggerAttackRelease(midiToFreq(m), 1.4, t0 + i * interval);
  });
}

/* ----------------------------- 扩展合成乐器 ----------------------------- */

/** 按需创建某种扩展乐器的复音合成器 */
function createPoly(kind: ExtInstrument): ToneNS.PolySynth | null {
  if (!Tone) return null;
  switch (kind) {
    case "synth":
      // 经典减法合成器音色，波形可后续切换
      return new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "sawtooth" },
        envelope: { attack: 0.02, decay: 0.2, sustain: 0.35, release: 0.8 },
      }).toDestination();
    case "violin":
      // 弓弦：慢起音、长延音的 FM 音色
      return new Tone.PolySynth(Tone.FMSynth, {
        harmonicity: 1.5,
        modulationIndex: 4,
        oscillator: { type: "sine" },
        envelope: { attack: 0.18, decay: 0.2, sustain: 0.85, release: 0.5 },
        modulation: { type: "sine" },
        modulationEnvelope: { attack: 0.3, decay: 0.1, sustain: 0.6, release: 0.4 },
      }).toDestination();
    case "glockenspiel":
      // 钟琴：明亮金属铃声，起音极快、长衰减、无延音
      return new Tone.PolySynth(Tone.FMSynth, {
        harmonicity: 3.01,
        modulationIndex: 12,
        oscillator: { type: "sine" },
        envelope: { attack: 0.001, decay: 1.4, sustain: 0, release: 1.4 },
        modulation: { type: "sine" },
        modulationEnvelope: { attack: 0.001, decay: 0.4, sustain: 0, release: 0.4 },
      }).toDestination();
    case "xylophone":
      // 木琴：木质、短促清脆
      return new Tone.PolySynth(Tone.FMSynth, {
        harmonicity: 2.0,
        modulationIndex: 6,
        oscillator: { type: "triangle" },
        envelope: { attack: 0.001, decay: 0.35, sustain: 0, release: 0.35 },
        modulation: { type: "square" },
        modulationEnvelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.2 },
      }).toDestination();
    case "bass":
      // 贝斯：温暖低频，三角波为主
      return new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "triangle" },
        envelope: { attack: 0.01, decay: 0.3, sustain: 0.45, release: 0.6 },
      }).toDestination();
    default:
      return null;
  }
}

/** 获取（必要时创建）某扩展乐器 */
function getPoly(kind: ExtInstrument): ToneNS.PolySynth | null {
  if (!Tone) return null;
  if (!polyCache[kind]) {
    const inst = createPoly(kind);
    if (inst) polyCache[kind] = inst;
  }
  return polyCache[kind] ?? null;
}

/** 扩展乐器是否可用（Tone 加载完成即可） */
export function extReady(): boolean {
  return !!Tone;
}

/** 切换合成器波形 */
export function samplerSetSynthWave(wave: SynthWave): void {
  const s = getPoly("synth");
  if (!s) return;
  s.set({ oscillator: { type: wave } });
}

/** 播放扩展乐器单音；成功返回 true，未就绪返回 false（调用方回退到合成器） */
export function samplerPlayExtMidi(
  kind: ExtInstrument,
  midi: number,
  duration = 0.9,
  gain = 0.18
): boolean {
  const inst = getPoly(kind);
  if (!inst || !Tone) return false;
  void ensureStarted();
  inst.triggerAttackRelease(midiToNoteName(midi), duration, undefined, gainToVelocity(gain));
  return true;
}

/** 尤克里里：明亮拨弦（独立实例） */
export function samplerPlayUkulele(midi: number): boolean {
  if (!Tone) return false;
  if (!ukulele) {
    ukulele = new Tone.PluckSynth({ dampening: 5200, resonance: 0.95 }).toDestination();
  }
  void ensureStarted();
  ukulele.triggerAttackRelease(midiToFreq(midi), 0.9);
  return true;
}
