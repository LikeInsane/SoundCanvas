"use client";

import type { ProjectContent, RhythmEvent } from "@/lib/sandbox-types";
import { RHYTHM_TYPES } from "@/lib/sandbox-types";

type RhythmType = (typeof RHYTHM_TYPES)[number];

interface RhythmTrackProps {
  content: ProjectContent;
  onContentChange: (updater: (prev: ProjectContent) => ProjectContent) => void;
  currentTime: number;
}

/** 点击循环顺序：空 -> kick -> snare -> hihat -> clap -> 空 */
const TYPE_CYCLE: (RhythmType | null)[] = [null, "kick", "snare", "hihat", "clap"];

/** 节奏轨：按拍渲染格子，点击在 空/kick/snare/hihat/clap 间循环 */
export function RhythmTrack({ content, onContentChange, currentTime }: RhythmTrackProps) {
  const [beatsPerBar] = content.timeSignature;
  const totalBeats = content.bars * beatsPerBar;
  const pattern = content.rhythm.pattern;

  const getTypeAt = (beat: number): RhythmType | null => {
    const ev = pattern.find((e) => e.beat === beat);
    return ev ? ev.type : null;
  };

  const handleCellClick = (beat: number) => {
    const current = getTypeAt(beat);
    const currentIndex = TYPE_CYCLE.indexOf(current);
    const nextIndex = (currentIndex + 1) % TYPE_CYCLE.length;
    const nextType = TYPE_CYCLE[nextIndex];
    onContentChange((prev) => {
      const nextPattern = prev.rhythm.pattern.filter((e) => e.beat !== beat);
      if (nextType) {
        nextPattern.push({ beat, type: nextType });
      }
      return { ...prev, rhythm: { pattern: nextPattern } };
    });
  };

  const beatToTime = (beat: number) => (beat / beatsPerBar) * (60 / content.bpm) * 4;
  const isCurrentBeat = (beat: number) => {
    const t = beatToTime(beat);
    const nextT = beatToTime(beat + 1);
    return currentTime >= t && currentTime < nextT;
  };

  return (
    <div className="rounded-xl border border-brand-border bg-brand-card/40 p-4 overflow-x-auto">
      <div className="flex items-center gap-1 min-w-max">
        {Array.from({ length: totalBeats }, (_, i) => {
          const type = getTypeAt(i);
          const active = isCurrentBeat(i);
          const typeLabel = type === "kick" ? "K" : type === "snare" ? "S" : type === "hihat" ? "H" : type === "clap" ? "C" : "";
          const typeTitle = type === "kick" ? "Kick" : type === "snare" ? "Snare" : type === "hihat" ? "Hi-Hat" : type === "clap" ? "Clap" : "空";
          return (
            <button
              key={i}
              type="button"
              onClick={() => handleCellClick(i)}
              className={`
                w-10 h-10 rounded-lg border text-xs font-medium transition-colors
                focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cta focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark
                ${type === "kick" ? "bg-amber-600 border-amber-500 text-white" : ""}
                ${type === "snare" ? "bg-slate-500 border-slate-400 text-white" : ""}
                ${type === "hihat" ? "bg-cyan-600 border-cyan-500 text-white" : ""}
                ${type === "clap" ? "bg-rose-600 border-rose-500 text-white" : ""}
                ${!type ? "bg-brand-card border-brand-border text-brand-muted hover:border-brand-muted" : ""}
                ${active ? "ring-2 ring-brand-cta ring-offset-2 ring-offset-brand-dark" : ""}
              `}
              title={typeTitle}
            >
              {typeLabel}
            </button>
          );
        })}
      </div>
      <p className="text-brand-muted text-xs mt-2">点击格子切换：空 / Kick(K) / Snare(S) / Hi-Hat(H) / Clap(C)</p>
    </div>
  );
}
