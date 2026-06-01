/**
 * 鼓声合成：基于共享 AudioContext 用 Web Audio 合成各类鼓件，供架子鼓与鼓机复用。
 * 与沙盒的 audio-engine.ts 相互独立、互不影响；此处实现更完整的鼓件集合。
 */

import { getAudioContext } from "./instrument-audio";

/** 鼓件类型 */
export type DrumVoice =
  | "kick"
  | "snare"
  | "hihat"
  | "openhat"
  | "tomLow"
  | "tomMid"
  | "tomHigh"
  | "clap"
  | "crash"
  | "ride";

/** 鼓件展示信息（中文标签与电脑键位） */
export const DRUM_KIT: Array<{ id: DrumVoice; label: string; key: string }> = [
  { id: "kick", label: "底鼓", key: "a" },
  { id: "snare", label: "军鼓", key: "s" },
  { id: "hihat", label: "闭镲", key: "d" },
  { id: "openhat", label: "开镲", key: "f" },
  { id: "tomLow", label: "低音嗵鼓", key: "j" },
  { id: "tomMid", label: "中音嗵鼓", key: "k" },
  { id: "tomHigh", label: "高音嗵鼓", key: "l" },
  { id: "clap", label: "拍手", key: "g" },
  { id: "crash", label: "强音镲", key: "h" },
  { id: "ride", label: "节奏镲", key: ";" },
];

/** 创建一段白噪声 buffer */
function noiseBuffer(ctx: AudioContext, seconds: number): AudioBuffer {
  const len = Math.floor(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < len; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2);
  }
  return buffer;
}

function noiseSource(
  ctx: AudioContext,
  dest: AudioNode,
  start: number,
  duration: number,
  gainVal: number,
  filter?: { type: BiquadFilterType; freq: number }
) {
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer(ctx, duration + 0.02);
  const g = ctx.createGain();
  g.gain.setValueAtTime(gainVal, start);
  g.gain.exponentialRampToValueAtTime(0.0008, start + duration);
  if (filter) {
    const f = ctx.createBiquadFilter();
    f.type = filter.type;
    f.frequency.setValueAtTime(filter.freq, start);
    src.connect(f);
    f.connect(g);
  } else {
    src.connect(g);
  }
  g.connect(dest);
  src.start(start);
  src.stop(start + duration + 0.02);
}

function tone(
  ctx: AudioContext,
  dest: AudioNode,
  start: number,
  fromFreq: number,
  toFreq: number,
  duration: number,
  gainVal: number,
  type: OscillatorType = "sine"
) {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(fromFreq, start);
  osc.frequency.exponentialRampToValueAtTime(Math.max(20, toFreq), start + duration);
  g.gain.setValueAtTime(gainVal, start);
  g.gain.exponentialRampToValueAtTime(0.0008, start + duration);
  osc.connect(g);
  g.connect(dest);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

/** 在指定时间播放某个鼓件（when 缺省为立即） */
export function playDrum(voice: DrumVoice, when?: number, gain = 1) {
  const ctx = getAudioContext();
  const t = when ?? ctx.currentTime;
  const dest = ctx.destination;

  switch (voice) {
    case "kick":
      tone(ctx, dest, t, 150, 40, 0.22, 0.5 * gain, "sine");
      break;
    case "snare":
      noiseSource(ctx, dest, t, 0.16, 0.32 * gain, { type: "highpass", freq: 1200 });
      tone(ctx, dest, t, 220, 180, 0.08, 0.14 * gain, "triangle");
      break;
    case "hihat":
      noiseSource(ctx, dest, t, 0.05, 0.16 * gain, { type: "highpass", freq: 7000 });
      break;
    case "openhat":
      noiseSource(ctx, dest, t, 0.32, 0.14 * gain, { type: "highpass", freq: 6500 });
      break;
    case "tomLow":
      tone(ctx, dest, t, 160, 90, 0.3, 0.32 * gain, "sine");
      break;
    case "tomMid":
      tone(ctx, dest, t, 240, 130, 0.26, 0.3 * gain, "sine");
      break;
    case "tomHigh":
      tone(ctx, dest, t, 340, 190, 0.22, 0.28 * gain, "sine");
      break;
    case "clap":
      noiseSource(ctx, dest, t, 0.12, 0.26 * gain, { type: "bandpass", freq: 1500 });
      noiseSource(ctx, dest, t + 0.02, 0.1, 0.2 * gain, { type: "bandpass", freq: 1500 });
      break;
    case "crash":
      noiseSource(ctx, dest, t, 1.0, 0.18 * gain, { type: "highpass", freq: 5000 });
      break;
    case "ride":
      noiseSource(ctx, dest, t, 0.5, 0.12 * gain, { type: "highpass", freq: 8000 });
      tone(ctx, dest, t, 520, 500, 0.4, 0.05 * gain, "square");
      break;
    default:
      break;
  }
}
