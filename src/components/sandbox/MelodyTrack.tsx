"use client";

import type { ProjectContent, MelodyEvent } from "@/lib/sandbox-types";
import { MELODY_NOTE_OPTIONS } from "@/lib/sandbox-types";

interface MelodyTrackProps {
  content: ProjectContent;
  onContentChange: (updater: (prev: ProjectContent) => ProjectContent) => void;
  currentTime: number;
}

/** 旋律轨：时间 x 音高网格，点击添加/删除音符 */
export function MelodyTrack({ content, onContentChange, currentTime }: MelodyTrackProps) {
  const [beatsPerBar] = content.timeSignature;
  const totalBeats = content.bars * beatsPerBar;
  const melody = content.melody;

  const getNoteAt = (barIndex: number, beat: number): MelodyEvent | undefined =>
    melody.find((m) => m.barIndex === barIndex && m.beat === beat);

  const handleCellClick = (barIndex: number, beat: number, note: string) => {
    const existing = getNoteAt(barIndex, beat);
    onContentChange((prev) => {
      if (existing && existing.note === note) {
        return {
          ...prev,
          melody: prev.melody.filter(
            (m) => !(m.barIndex === barIndex && m.beat === beat && m.note === note)
          ),
        };
      }
      const without = prev.melody.filter(
        (m) => !(m.barIndex === barIndex && m.beat === beat)
      );
      return {
        ...prev,
        melody: [...without, { barIndex, beat, note, duration: 0.5 }].sort(
          (a, b) => a.barIndex - b.barIndex || a.beat - b.beat
        ),
      };
    });
  };

  const beatToTime = (globalBeat: number) =>
    (globalBeat / beatsPerBar) * (60 / content.bpm) * 4;
  const isCurrentBeat = (globalBeat: number) => {
    const t = beatToTime(globalBeat);
    const nextT = beatToTime(globalBeat + 1);
    return currentTime >= t && currentTime < nextT;
  };

  const notes = [...MELODY_NOTE_OPTIONS].reverse();

  return (
    <div className="rounded-xl border border-brand-border bg-brand-card/40 p-4 overflow-x-auto overflow-y-auto">
      <div className="flex flex-col gap-px min-h-0">
        {notes.map((note) => (
          <div key={note} className="flex items-stretch gap-px min-w-max">
            <div className="w-10 h-6 flex items-center justify-center text-brand-muted text-xs border border-brand-border/50 rounded-sm shrink-0">
              {note}
            </div>
            {Array.from({ length: totalBeats }, (_, i) => {
              const barIndex = Math.floor(i / beatsPerBar);
              const beat = i % beatsPerBar;
              const ev = getNoteAt(barIndex, beat);
              const hasNote = ev?.note === note;
              const active = isCurrentBeat(i);
              return (
                <button
                  key={`${note}-${i}`}
                  type="button"
                  onClick={() => handleCellClick(barIndex, beat, note)}
                  className={`
                    w-8 h-6 border border-brand-border/50 rounded-sm transition-colors shrink-0
                    focus:outline-none focus-visible:ring-1 focus-visible:ring-brand-cta
                    ${hasNote ? "bg-brand-cta/80 text-white border-brand-cta" : "bg-brand-card hover:bg-brand-border/50"}
                    ${active ? "ring-1 ring-brand-cta" : ""}
                  `}
                  title={hasNote ? "点击删除" : "点击添加"}
                />
              );
            })}
          </div>
        ))}
      </div>
      <p className="text-brand-muted text-xs mt-2">纵轴音高，横轴时间；点击格子添加或删除该位置的音符</p>
    </div>
  );
}
