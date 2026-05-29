"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { ToolHeader } from "@/components/tools/ToolHeader";
import {
  CHORD_TYPES,
  SHARP_NAMES,
  buildChord,
  chordName,
  midiToNote,
  noteToMidi,
} from "@/lib/music-theory";
import { playChordMidi } from "@/lib/instrument-audio";

/**
 * 和弦查找：选定和弦类型，查看其在十二个根音上的构成音速查表。
 */
export default function ChordFinderPage() {
  const [typeId, setTypeId] = useState("major");
  const def = CHORD_TYPES.find((c) => c.id === typeId);

  return (
    <div>
      <ToolHeader title="和弦查找" desc="选择和弦类型，速查它在所有根音上的构成音。" />

      <div className="glass-card p-6">
        <label className="text-xs text-brand-muted">和弦类型</label>
        <div className="flex flex-wrap gap-2 mt-2 mb-6">
          {CHORD_TYPES.map((c) => (
            <button
              key={c.id}
              onClick={() => setTypeId(c.id)}
              className={`py-1.5 px-3 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                typeId === c.id
                  ? "bg-brand-accent text-white"
                  : "bg-brand-card border border-brand-border text-brand-muted hover:text-brand-text"
              }`}
            >
              {c.zh}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SHARP_NAMES.map((rootName, pc) => {
            const rootMidi = noteToMidi(`${rootName}4`);
            const midis = buildChord(rootMidi, typeId);
            return (
              <div
                key={rootName}
                className="rounded-xl bg-brand-card border border-brand-border p-3 flex items-center justify-between"
              >
                <div>
                  <div className="text-sm font-semibold text-brand-heading">
                    {chordName(rootName, typeId)}
                  </div>
                  <div className="text-xs text-brand-muted mt-0.5">
                    {midis.map((m) => midiToNote(m).replace(/\d/, "")).join(" · ")}
                  </div>
                </div>
                <button
                  onClick={() => playChordMidi(midis)}
                  className="w-8 h-8 rounded-full bg-brand-deeper border border-brand-border flex items-center justify-center text-brand-cta hover:border-brand-cta/40 transition-colors cursor-pointer"
                  aria-label={`播放 ${chordName(rootName, typeId)}`}
                >
                  <Play className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-brand-muted mt-4">
          当前：{def?.zh}（{def?.intervals.join(", ")} 半音叠置）
        </p>
      </div>
    </div>
  );
}
