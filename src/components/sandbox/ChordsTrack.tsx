"use client";

import type { ProjectContent, ChordEvent } from "@/lib/sandbox-types";
import { CHORD_OPTIONS } from "@/lib/sandbox-types";

interface ChordsTrackProps {
  content: ProjectContent;
  onContentChange: (updater: (prev: ProjectContent) => ProjectContent) => void;
  currentTime: number;
}

/** 和弦轨：每小节一格，下拉选择和弦 */
export function ChordsTrack({ content, onContentChange, currentTime }: ChordsTrackProps) {
  const [beatsPerBar] = content.timeSignature;
  const barDuration = (60 / content.bpm) * beatsPerBar;
  const chordByBar = new Map<number, string>(
    content.chords.map((c) => [c.barIndex, c.chord])
  );

  const getChordAt = (barIndex: number) => chordByBar.get(barIndex) ?? "";

  const handleChordChange = (barIndex: number, chord: string) => {
    onContentChange((prev) => {
      const next = chord
        ? prev.chords.filter((c) => c.barIndex !== barIndex).concat([{ barIndex, chord }])
        : prev.chords.filter((c) => c.barIndex !== barIndex);
      return { ...prev, chords: next.sort((a, b) => a.barIndex - b.barIndex) };
    });
  };

  const currentBar = Math.min(
    content.bars - 1,
    Math.max(0, Math.floor(currentTime / barDuration))
  );

  return (
    <div className="rounded-xl border border-brand-border bg-brand-card/40 p-4 overflow-x-auto">
      <div className="flex items-center gap-2 min-w-max">
        {Array.from({ length: content.bars }, (_, i) => {
          const chord = getChordAt(i);
          const active = currentBar === i;
          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <span className="text-brand-muted text-xs">小节 {i + 1}</span>
              <select
                value={chord}
                onChange={(e) => handleChordChange(i, e.target.value)}
                className={`
                  min-w-[72px] px-2 py-2 rounded-lg border text-sm bg-brand-card text-brand-text
                  focus:outline-none focus:ring-1 focus:ring-brand-accent
                  ${active ? "ring-2 ring-brand-cta border-brand-cta" : "border-brand-border"}
                `}
              >
                <option value="">--</option>
                {CHORD_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>
    </div>
  );
}
