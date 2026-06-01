"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Play, Square, Eraser, Shuffle } from "lucide-react";
import { getAudioContext } from "@/lib/instrument-audio";
import { playDrum, type DrumVoice } from "@/lib/drums";

const STEPS = 16;

/** 鼓机使用的鼓件行（中文标签） */
const MACHINE_VOICES: Array<{ id: DrumVoice; label: string }> = [
  { id: "crash", label: "强音镲" },
  { id: "ride", label: "节奏镲" },
  { id: "openhat", label: "开镲" },
  { id: "hihat", label: "闭镲" },
  { id: "clap", label: "拍手" },
  { id: "snare", label: "军鼓" },
  { id: "tomHigh", label: "高音嗵鼓" },
  { id: "kick", label: "底鼓" },
];

type Pattern = Record<string, boolean[]>;

function emptyPattern(): Pattern {
  const p: Pattern = {};
  MACHINE_VOICES.forEach((v) => (p[v.id] = Array(STEPS).fill(false)));
  return p;
}

/** 示例节奏：基础摇滚律动 */
function presetRock(): Pattern {
  const p = emptyPattern();
  [0, 8].forEach((s) => (p.kick[s] = true));
  [4, 12].forEach((s) => (p.snare[s] = true));
  for (let s = 0; s < STEPS; s += 2) p.hihat[s] = true;
  return p;
}

/**
 * 鼓机：16 步进音序器，编辑各鼓件的开关，循环播放并高亮当前步。
 * 采用 Web Audio 前瞻调度，保证节奏稳定。
 */
export function DrumMachine() {
  const [pattern, setPattern] = useState<Pattern>(presetRock);
  const [bpm, setBpm] = useState(100);
  const [playing, setPlaying] = useState(false);
  const [displayStep, setDisplayStep] = useState(-1);

  const patternRef = useRef(pattern);
  const bpmRef = useRef(bpm);
  const nextNoteTimeRef = useRef(0);
  const currentStepRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);
  const queueRef = useRef<Array<{ step: number; time: number }>>([]);

  useEffect(() => {
    patternRef.current = pattern;
  }, [pattern]);
  useEffect(() => {
    bpmRef.current = bpm;
  }, [bpm]);

  const toggleCell = (voice: string, step: number) => {
    setPattern((prev) => {
      const next: Pattern = { ...prev, [voice]: [...prev[voice]] };
      next[voice][step] = !next[voice][step];
      return next;
    });
  };

  const stepDuration = useCallback(() => 60 / bpmRef.current / 4, []);

  const stop = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
    queueRef.current = [];
    setPlaying(false);
    setDisplayStep(-1);
  }, []);

  const start = useCallback(() => {
    const ctx = getAudioContext();
    currentStepRef.current = 0;
    nextNoteTimeRef.current = ctx.currentTime + 0.1;

    const scheduler = () => {
      const lookahead = 0.1;
      while (nextNoteTimeRef.current < ctx.currentTime + lookahead) {
        const step = currentStepRef.current;
        const when = nextNoteTimeRef.current;
        MACHINE_VOICES.forEach((v) => {
          if (patternRef.current[v.id][step]) playDrum(v.id, when);
        });
        queueRef.current.push({ step, time: when });
        nextNoteTimeRef.current += stepDuration();
        currentStepRef.current = (step + 1) % STEPS;
      }
    };

    const draw = () => {
      const now = ctx.currentTime;
      while (queueRef.current.length && queueRef.current[0].time <= now) {
        setDisplayStep(queueRef.current[0].step);
        queueRef.current.shift();
      }
      rafRef.current = requestAnimationFrame(draw);
    };

    scheduler();
    timerRef.current = window.setInterval(scheduler, 25);
    rafRef.current = requestAnimationFrame(draw);
    setPlaying(true);
  }, [stepDuration]);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearInterval(timerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const togglePlay = () => {
    if (playing) stop();
    else start();
  };

  const randomize = () => {
    const p = emptyPattern();
    MACHINE_VOICES.forEach((v) => {
      const density = v.id === "hihat" ? 0.5 : v.id === "kick" || v.id === "snare" ? 0.25 : 0.12;
      for (let s = 0; s < STEPS; s++) p[v.id][s] = Math.random() < density;
    });
    setPattern(p);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <button
          onClick={togglePlay}
          className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
            playing
              ? "bg-red-500/20 text-red-400 border border-red-500/40"
              : "bg-brand-cta text-white hover:bg-brand-cta-hover"
          }`}
        >
          {playing ? <Square className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
          {playing ? "停止" : "播放"}
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-brand-muted">速度 {bpm} BPM</span>
          <input
            type="range"
            min={60}
            max={180}
            step={1}
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            className="accent-brand-cta cursor-pointer w-32"
          />
        </div>

        <button
          onClick={() => setPattern(presetRock())}
          className="px-3 py-1 rounded-lg text-xs font-medium bg-brand-card border border-brand-border text-brand-text hover:border-brand-accent/40 transition-colors cursor-pointer"
        >
          示例节奏
        </button>
        <button
          onClick={randomize}
          className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-brand-card border border-brand-border text-brand-text hover:border-brand-accent/40 transition-colors cursor-pointer"
        >
          <Shuffle className="w-3.5 h-3.5 mr-1" /> 随机
        </button>
        <button
          onClick={() => setPattern(emptyPattern())}
          className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium text-brand-muted hover:text-red-400 transition-colors cursor-pointer"
        >
          <Eraser className="w-3.5 h-3.5 mr-1" /> 清空
        </button>
      </div>

      <div className="glass-card p-4 overflow-x-auto">
        <div className="min-w-[640px] space-y-1.5">
          {MACHINE_VOICES.map((v) => (
            <div key={v.id} className="flex items-center gap-2">
              <div className="w-16 shrink-0 text-[11px] text-brand-muted text-right pr-1">{v.label}</div>
              <div className="flex flex-1 gap-1">
                {Array.from({ length: STEPS }).map((_, s) => {
                  const on = pattern[v.id][s];
                  const isBeat = s % 4 === 0;
                  const isCurrent = displayStep === s;
                  return (
                    <button
                      key={s}
                      onClick={() => toggleCell(v.id, s)}
                      className={`flex-1 h-7 rounded transition-colors cursor-pointer ${
                        on
                          ? "bg-brand-cta"
                          : isBeat
                          ? "bg-brand-border/60 hover:bg-brand-border"
                          : "bg-brand-card border border-brand-border hover:border-brand-accent/40"
                      } ${isCurrent ? "ring-2 ring-brand-accent" : ""}`}
                      aria-label={`${v.label} 第 ${s + 1} 步`}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-brand-muted mt-4">
        点击格子开启/关闭对应鼓件在该步的触发；每 4 格为一拍，共 4 拍一小节循环。
      </p>
    </div>
  );
}
