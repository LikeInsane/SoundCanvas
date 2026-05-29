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
