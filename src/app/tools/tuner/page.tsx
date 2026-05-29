"use client";

import { useRef, useState } from "react";
import { Mic, MicOff } from "lucide-react";
import { ToolHeader } from "@/components/tools/ToolHeader";
import { midiToNote } from "@/lib/music-theory";

/**
 * 调音器：通过麦克风采集声音，用自相关法估计基频，并换算到最接近的音与音分偏差。
 */
export default function TunerPage() {
  const [active, setActive] = useState(false);
  const [freq, setFreq] = useState<number | null>(null);
  const [note, setNote] = useState<string>("--");
  const [cents, setCents] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>(0);

  // 自相关法基频检测
  const detectPitch = (buf: Float32Array, sampleRate: number): number => {
    const size = buf.length;
    let rms = 0;
    for (let i = 0; i < size; i++) rms += buf[i] * buf[i];
    rms = Math.sqrt(rms / size);
    if (rms < 0.01) return -1; // 信号太弱

    let r1 = 0;
    let r2 = size - 1;
    const threshold = 0.2;
    for (let i = 0; i < size / 2; i++) {
      if (Math.abs(buf[i]) < threshold) {
        r1 = i;
        break;
      }
    }
    for (let i = 1; i < size / 2; i++) {
      if (Math.abs(buf[size - i]) < threshold) {
        r2 = size - i;
        break;
      }
    }
    const trimmed = buf.slice(r1, r2);
    const n = trimmed.length;
    const c = new Array(n).fill(0);
    for (let lag = 0; lag < n; lag++) {
      for (let i = 0; i < n - lag; i++) {
        c[lag] += trimmed[i] * trimmed[i + lag];
      }
    }
    let d = 0;
    while (c[d] > c[d + 1]) d++;
    let maxVal = -1;
    let maxPos = -1;
    for (let i = d; i < n; i++) {
      if (c[i] > maxVal) {
        maxVal = c[i];
        maxPos = i;
      }
    }
    let t0 = maxPos;
    // 抛物线插值提高精度
    if (maxPos > 0 && maxPos < n - 1) {
      const x1 = c[maxPos - 1];
      const x2 = c[maxPos];
      const x3 = c[maxPos + 1];
      const a = (x1 + x3 - 2 * x2) / 2;
      const b = (x3 - x1) / 2;
      if (a) t0 = maxPos - b / (2 * a);
    }
    return sampleRate / t0;
  };

  const update = () => {
    const analyser = analyserRef.current;
    const ctx = ctxRef.current;
    if (!analyser || !ctx) return;
    const buf = new Float32Array(analyser.fftSize);
    analyser.getFloatTimeDomainData(buf);
    const pitch = detectPitch(buf, ctx.sampleRate);
    if (pitch > 0) {
      setFreq(pitch);
      const midiFloat = 69 + 12 * Math.log2(pitch / 440);
      const midi = Math.round(midiFloat);
      setNote(midiToNote(midi));
      setCents(Math.round((midiFloat - midi) * 100));
    }
    rafRef.current = requestAnimationFrame(update);
  };

  const start = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new Ctor();
      ctxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      analyserRef.current = analyser;
      setActive(true);
      rafRef.current = requestAnimationFrame(update);
    } catch {
      setError("无法访问麦克风，请检查浏览器权限设置。");
    }
  };

  const stop = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    void ctxRef.current?.close();
    ctxRef.current = null;
    analyserRef.current = null;
    setActive(false);
    setFreq(null);
    setNote("--");
    setCents(0);
  };

  // 偏差指示：cents 范围 -50..50
  const inTune = Math.abs(cents) <= 5 && freq !== null;

  return (
    <div>
      <ToolHeader title="调音器" desc="开启麦克风，对准乐器或人声，校准到目标音高。" />

      <div className="glass-card p-8 max-w-md mx-auto text-center">
        <div className={`text-7xl font-bold tabular-nums ${inTune ? "text-brand-green" : "text-brand-heading"}`}>
          {note}
        </div>
        <div className="text-xs text-brand-muted mt-1">
          {freq ? `${freq.toFixed(1)} Hz` : "等待信号"}
        </div>

        {/* 音分偏差指示条 */}
        <div className="relative h-10 mt-8 mx-auto max-w-xs">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-brand-border" />
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-brand-muted/60" />
          <div
            className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full transition-all duration-100 ${
              inTune ? "bg-brand-green" : "bg-brand-cta"
            }`}
            style={{ left: `calc(50% + ${Math.max(-50, Math.min(50, cents)) * 0.9}%)`, transform: "translate(-50%, -50%)" }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-brand-muted mt-1 max-w-xs mx-auto">
          <span>-50</span>
          <span>{freq ? `${cents > 0 ? "+" : ""}${cents} 音分` : ""}</span>
          <span>+50</span>
        </div>

        {error && <p className="text-xs text-red-400 mt-6">{error}</p>}

        <button onClick={active ? stop : start} className="btn-primary mt-8">
          {active ? (
            <>
              <MicOff className="w-4 h-4 mr-1" /> 停止
            </>
          ) : (
            <>
              <Mic className="w-4 h-4 mr-1" /> 开启麦克风
            </>
          )}
        </button>
      </div>
    </div>
  );
}
