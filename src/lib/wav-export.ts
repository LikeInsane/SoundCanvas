/**
 * 录音导出：将录制的音符事件用 OfflineAudioContext 离线重渲染为音频，再编码为 WAV 下载。
 * 为保证导出自包含、稳定，离线渲染采用与 instrument-audio 一致的合成音色（不依赖采样网络资源）。
 */

import { midiToFreq } from "./music-theory";

export interface RecordedEvent {
  midi: number;
  /** 相对录音起点的毫秒数 */
  time: number;
  instrument: "piano" | "guitar";
}

/** 离线渲染单个钢琴音 */
function renderPiano(ctx: OfflineAudioContext, freq: number, startTime: number) {
  const partials: Array<{ ratio: number; level: number; type: OscillatorType }> = [
    { ratio: 1, level: 1, type: "triangle" },
    { ratio: 2, level: 0.35, type: "sine" },
    { ratio: 3, level: 0.12, type: "sine" },
  ];
  const master = ctx.createGain();
  master.connect(ctx.destination);
  const gain = 0.18;
  const release = 1.2;
  master.gain.setValueAtTime(0, startTime);
  master.gain.linearRampToValueAtTime(gain, startTime + 0.005);
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

/** 离线渲染单个拨弦音 */
function renderPluck(ctx: OfflineAudioContext, freq: number, startTime: number) {
  const master = ctx.createGain();
  master.connect(ctx.destination);
  master.gain.setValueAtTime(0, startTime);
  master.gain.linearRampToValueAtTime(0.16, startTime + 0.004);
  master.gain.exponentialRampToValueAtTime(0.0008, startTime + 1.1);
  const osc1 = ctx.createOscillator();
  osc1.type = "triangle";
  osc1.frequency.setValueAtTime(freq, startTime);
  osc1.connect(master);
  osc1.start(startTime);
  osc1.stop(startTime + 1.4);
  const osc2 = ctx.createOscillator();
  osc2.type = "sine";
  osc2.frequency.setValueAtTime(freq * 2, startTime);
  const g2 = ctx.createGain();
  g2.gain.setValueAtTime(0.18, startTime);
  osc2.connect(g2);
  g2.connect(master);
  osc2.start(startTime);
  osc2.stop(startTime + 1.4);
}

/** 把 AudioBuffer 编码为 16-bit PCM 立体声 WAV */
function encodeWav(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const numFrames = buffer.length;
  const bytesPerSample = 2;
  const blockAlign = numChannels * bytesPerSample;
  const dataSize = numFrames * blockAlign;
  const bufferLength = 44 + dataSize;
  const ab = new ArrayBuffer(bufferLength);
  const view = new DataView(ab);

  const writeString = (offset: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(offset + i, s.charCodeAt(i));
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 8 * bytesPerSample, true);
  writeString(36, "data");
  view.setUint32(40, dataSize, true);

  const channels: Float32Array[] = [];
  for (let c = 0; c < numChannels; c++) channels.push(buffer.getChannelData(c));

  let offset = 44;
  for (let i = 0; i < numFrames; i++) {
    for (let c = 0; c < numChannels; c++) {
      let sample = channels[c][i];
      sample = Math.max(-1, Math.min(1, sample));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += 2;
    }
  }

  return new Blob([ab], { type: "audio/wav" });
}

/** 触发浏览器下载 */
function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** 将录音事件导出为 WAV 并下载 */
export async function exportRecordingToWav(events: RecordedEvent[], filename = "recording.wav") {
  if (events.length === 0) return;
  const sampleRate = 44100;
  const tail = 1.6;
  const lastTime = Math.max(...events.map((e) => e.time)) / 1000;
  const durationSec = lastTime + tail;
  const Ctor =
    window.OfflineAudioContext ||
    (window as unknown as { webkitOfflineAudioContext: typeof OfflineAudioContext }).webkitOfflineAudioContext;
  const ctx = new Ctor(2, Math.ceil(sampleRate * durationSec), sampleRate);

  events.forEach((ev) => {
    const freq = midiToFreq(ev.midi);
    const start = ev.time / 1000;
    if (ev.instrument === "guitar") renderPluck(ctx, freq, start);
    else renderPiano(ctx, freq, start);
  });

  const rendered = await ctx.startRendering();
  const wav = encodeWav(rendered);
  triggerDownload(wav, filename);
}
