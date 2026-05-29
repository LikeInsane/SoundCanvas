/**
 * 共享乐器音频播放：基于 Web Audio 合成，供习题、工具、虚拟钢琴复用。
 * 与沙盒的 audio-engine.ts 相互独立，互不影响。
 * 提供单音、和弦、序列、节拍器点击等播放能力。
 */

import { midiToFreq, noteToMidi } from "./music-theory";
import {
  pianoReady,
  guitarReady,
  samplerPlayMidi,
  samplerPlayChordMidi,
  samplerPlaySequenceMidi,
  samplerPlayPluck,
} from "./sampler";

let sharedCtx: AudioContext | null = null;

/** 获取或创建全局共享的 AudioContext（用户首次交互后才会真正发声） */
export function getAudioContext(): AudioContext {
  if (!sharedCtx) {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    sharedCtx = new Ctor();
  }
  if (sharedCtx.state === "suspended") {
    void sharedCtx.resume();
  }
  return sharedCtx;
}

/**
 * 在指定时间播放一个带包络的音（模拟钢琴音色：多正弦叠加 + 指数衰减）。
 */
function scheduleNote(
  ctx: AudioContext,
  freq: number,
  startTime: number,
  duration: number,
  gain: number,
  destination: AudioNode
) {
  // 主音 + 八度泛音，丰富音色
  const partials: Array<{ ratio: number; level: number; type: OscillatorType }> = [
    { ratio: 1, level: 1, type: "triangle" },
    { ratio: 2, level: 0.35, type: "sine" },
    { ratio: 3, level: 0.12, type: "sine" },
  ];

  const master = ctx.createGain();
  master.connect(destination);
  // 钢琴式包络：快速起音，缓慢衰减
  const attack = 0.005;
  const release = Math.max(0.4, duration);
  master.gain.setValueAtTime(0, startTime);
  master.gain.linearRampToValueAtTime(gain, startTime + attack);
  master.gain.exponentialRampToValueAtTime(0.0008, startTime + release);

  partials.forEach((p) => {
    const osc = ctx.createOscillator();
    const og = ctx.createGain();
    osc.type = p.type;
    osc.frequency.setValueAtTime(freq * p.ratio, startTime);
    og.gain.setValueAtTime(p.level, startTime);
    osc.connect(og);
    og.connect(master);
    osc.start(startTime);
    osc.stop(startTime + release + 0.05);
  });
}

/** 播放单个音（按频率） */
export function playFreq(freq: number, duration = 0.8, gain = 0.18) {
  const ctx = getAudioContext();
  scheduleNote(ctx, freq, ctx.currentTime, duration, gain, ctx.destination);
}

/** 播放单个音（按 MIDI 编号）：采样就绪则用采样钢琴，否则合成器过渡 */
export function playMidi(midi: number, duration = 0.8, gain = 0.18) {
  if (pianoReady()) {
    samplerPlayMidi(midi, duration, gain);
    return;
  }
  playFreq(midiToFreq(midi), duration, gain);
}

/** 播放单个音（按音名，如 "C4"） */
export function playNote(note: string, duration = 0.8, gain = 0.18) {
  playMidi(noteToMidi(note), duration, gain);
}

/** 同时播放一组 MIDI 编号（和弦） */
export function playChordMidi(midis: number[], duration = 1.2, gain = 0.14) {
  if (pianoReady()) {
    samplerPlayChordMidi(midis, duration, gain);
    return;
  }
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  midis.forEach((m) => scheduleNote(ctx, midiToFreq(m), now, duration, gain, ctx.destination));
}

/** 顺序播放一组 MIDI 编号（琶音 / 旋律），interval 为相邻音间隔秒数 */
export function playSequenceMidi(midis: number[], interval = 0.45, noteDuration = 0.6, gain = 0.18) {
  if (pianoReady()) {
    samplerPlaySequenceMidi(midis, interval, noteDuration, gain);
    return;
  }
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  midis.forEach((m, i) => {
    scheduleNote(ctx, midiToFreq(m), now + i * interval, noteDuration, gain, ctx.destination);
  });
}

/**
 * 拨弦音色（吉他）：用锯齿波 + 较快衰减模拟拨弦，bright 控制原声/电声明暗。
 */
export function playPluckMidi(midi: number, bright = false, gain = 0.16) {
  if (guitarReady()) {
    samplerPlayPluck(midi, bright);
    return;
  }
  const ctx = getAudioContext();
  const t = ctx.currentTime;
  const freq = midiToFreq(midi);

  const master = ctx.createGain();
  master.connect(ctx.destination);
  master.gain.setValueAtTime(0, t);
  master.gain.linearRampToValueAtTime(gain, t + 0.004);
  master.gain.exponentialRampToValueAtTime(0.0008, t + (bright ? 1.4 : 1.0));

  // 电声更亮：加一层高通后的锯齿；原声偏暖：三角波为主
  const osc1 = ctx.createOscillator();
  osc1.type = bright ? "sawtooth" : "triangle";
  osc1.frequency.setValueAtTime(freq, t);
  const g1 = ctx.createGain();
  g1.gain.setValueAtTime(1, t);
  osc1.connect(g1);
  g1.connect(master);
  osc1.start(t);
  osc1.stop(t + 1.6);

  const osc2 = ctx.createOscillator();
  osc2.type = "sine";
  osc2.frequency.setValueAtTime(freq * 2, t);
  const g2 = ctx.createGain();
  g2.gain.setValueAtTime(bright ? 0.3 : 0.18, t);
  osc2.connect(g2);
  g2.connect(master);
  osc2.start(t);
  osc2.stop(t + 1.6);
}

/** 节拍器点击声：accent 为重拍（音更高更响） */
export function playClick(accent = false, when?: number) {
  const ctx = getAudioContext();
  const t = when ?? ctx.currentTime;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = "square";
  osc.frequency.setValueAtTime(accent ? 1600 : 1000, t);
  g.gain.setValueAtTime(accent ? 0.25 : 0.15, t);
  g.gain.exponentialRampToValueAtTime(0.0008, t + 0.05);
  osc.connect(g);
  g.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.06);
}
