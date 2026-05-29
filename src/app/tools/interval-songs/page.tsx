"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { ToolHeader } from "@/components/tools/ToolHeader";
import { INTERVAL_SONGS } from "@/lib/interval-songs";
import { noteToMidi } from "@/lib/music-theory";
import { playSequenceMidi } from "@/lib/instrument-audio";

/**
 * 音程歌曲表：用熟悉曲目帮助记忆各音程的音响，可上行/下行试听。
 */
export default function IntervalSongsPage() {
  const [direction, setDirection] = useState<"asc" | "desc">("asc");
  const rootMidi = noteToMidi("C4");

  const playInterval = (semitones: number) => {
    const top = rootMidi + semitones;
    const seq = direction === "asc" ? [rootMidi, top] : [top, rootMidi];
    playSequenceMidi(seq, 0.55);
  };

  return (
    <div>
      <ToolHeader title="音程歌曲表" desc="借助熟悉的旋律记住每个音程的音响特征。" />

      <div className="flex items-center gap-2 mb-6">
        <span className="text-xs text-brand-muted">方向</span>
        {[
          { id: "asc" as const, label: "上行" },
          { id: "desc" as const, label: "下行" },
        ].map((d) => (
          <button
            key={d.id}
            onClick={() => setDirection(d.id)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              direction === d.id
                ? "bg-brand-cta text-white"
                : "bg-brand-card border border-brand-border text-brand-muted hover:text-brand-text"
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      <div className="glass-card divide-y divide-brand-border/60">
        {INTERVAL_SONGS.map((iv) => (
          <div key={iv.semitones} className="flex items-center gap-4 p-4">
            <button
              onClick={() => playInterval(iv.semitones)}
              className="w-9 h-9 rounded-full bg-brand-deeper border border-brand-border flex items-center justify-center text-brand-cta hover:border-brand-cta/40 transition-colors cursor-pointer shrink-0"
              aria-label={`播放${iv.zh}`}
            >
              <Play className="w-4 h-4" />
            </button>
            <div className="w-24 shrink-0">
              <div className="text-sm font-semibold text-brand-heading">{iv.zh}</div>
              <div className="text-xs text-brand-muted">{iv.short}</div>
            </div>
            <div className="flex-1 text-xs text-brand-text">
              {direction === "asc" ? iv.ascending : iv.descending}
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-brand-muted mt-4">
        曲名仅用于联想记忆，点击播放听到的是音程本身（以 C4 为根音）。
      </p>
    </div>
  );
}
