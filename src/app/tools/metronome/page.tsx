"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Minus, Plus } from "lucide-react";
import { ToolHeader } from "@/components/tools/ToolHeader";
import { getAudioContext, playClick } from "@/lib/instrument-audio";

/**
 * 节拍器：使用 Web Audio 提前调度点击声，保证稳定计时。
 */
export default function MetronomePage() {
  const [bpm, setBpm] = useState(100);
  const [beatsPerBar, setBeatsPerBar] = useState(4);
  const [playing, setPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);

  const nextNoteTimeRef = useRef(0);
  const beatRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const bpmRef = useRef(bpm);
  const beatsRef = useRef(beatsPerBar);

  useEffect(() => {
    bpmRef.current = bpm;
  }, [bpm]);
  useEffect(() => {
    beatsRef.current = beatsPerBar;
  }, [beatsPerBar]);

  useEffect(() => {
    if (!playing) {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
      return;
    }

    const ctx = getAudioContext();
    nextNoteTimeRef.current = ctx.currentTime + 0.1;
    beatRef.current = 0;

    // 提前 0.1s 调度，scheduler 每 25ms 检查一次
    const scheduler = () => {
      const lookahead = 0.1;
      while (nextNoteTimeRef.current < ctx.currentTime + lookahead) {
        const accent = beatRef.current % beatsRef.current === 0;
        playClick(accent, nextNoteTimeRef.current);
        const beatToShow = beatRef.current % beatsRef.current;
        const fireAt = nextNoteTimeRef.current;
        const delay = Math.max(0, (fireAt - ctx.currentTime) * 1000);
        window.setTimeout(() => setCurrentBeat(beatToShow), delay);

        nextNoteTimeRef.current += 60 / bpmRef.current;
        beatRef.current += 1;
      }
    };

    timerRef.current = window.setInterval(scheduler, 25);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [playing]);

  const clampBpm = (v: number) => Math.min(240, Math.max(30, v));

  return (
    <div>
      <ToolHeader title="节拍器" desc="设定速度与拍号，跟随稳定的节拍练习。" />

      <div className="glass-card p-8 max-w-md mx-auto text-center">
        <div className="text-6xl font-bold text-brand-heading tabular-nums">{bpm}</div>
        <div className="text-xs text-brand-muted mt-1">BPM</div>

        <input
          type="range"
          min={30}
          max={240}
          value={bpm}
          onChange={(e) => setBpm(clampBpm(Number(e.target.value)))}
          className="w-full mt-6 accent-brand-cta cursor-pointer"
        />

        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            onClick={() => setBpm((b) => clampBpm(b - 1))}
            className="w-9 h-9 rounded-full bg-brand-card border border-brand-border flex items-center justify-center text-brand-text hover:border-brand-accent/40 transition-colors cursor-pointer"
            aria-label="减速"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={() => setBpm((b) => clampBpm(b + 1))}
            className="w-9 h-9 rounded-full bg-brand-card border border-brand-border flex items-center justify-center text-brand-text hover:border-brand-accent/40 transition-colors cursor-pointer"
            aria-label="加速"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* 拍点指示 */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {Array.from({ length: beatsPerBar }).map((_, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full transition-all duration-100 ${
                playing && currentBeat === i
                  ? i === 0
                    ? "bg-brand-cta scale-125"
                    : "bg-brand-accent scale-125"
                  : "bg-brand-border"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center justify-center gap-2 mt-6">
          <span className="text-xs text-brand-muted">拍号</span>
          {[2, 3, 4, 6].map((b) => (
            <button
              key={b}
              onClick={() => setBeatsPerBar(b)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                beatsPerBar === b
                  ? "bg-brand-cta text-white"
                  : "bg-brand-card border border-brand-border text-brand-muted hover:text-brand-text"
              }`}
            >
              {b}/4
            </button>
          ))}
        </div>

        <button
          onClick={() => setPlaying((p) => !p)}
          className="btn-primary mt-8 w-32"
        >
          {playing ? (
            <>
              <Pause className="w-4 h-4 mr-1" /> 停止
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-1" /> 开始
            </>
          )}
        </button>
      </div>
    </div>
  );
}
