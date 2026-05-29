"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { ToolHeader } from "@/components/tools/ToolHeader";
import { Staff } from "@/components/notation/Staff";
import {
  CHORD_TYPES,
  SHARP_NAMES,
  buildChord,
  chordName,
  midiToNote,
  noteToMidi,
} from "@/lib/music-theory";
import { playChordMidi, playSequenceMidi } from "@/lib/instrument-audio";

/**
 * 和弦播放器：选择根音与和弦类型，聆听并查看五线谱及构成音。
 */
export default function ChordPlayerPage() {
  const [rootPc, setRootPc] = useState(0); // C
  const [typeId, setTypeId] = useState("major");

  const rootName = SHARP_NAMES[rootPc];
  const rootMidi = noteToMidi(`${rootName}4`);
  const midis = buildChord(rootMidi, typeId);
  const name = chordName(rootName, typeId);
  const noteNames = midis.map((m) => midiToNote(m));

  return (
    <div>
      <ToolHeader title="和弦播放器" desc="选择根音与和弦类型，即时聆听音响并查看构成音。" />

      <div className="glass-card p-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* 左：选择 */}
          <div className="flex-1 space-y-6">
            <div>
              <label className="text-xs text-brand-muted">根音</label>
              <div className="grid grid-cols-6 gap-2 mt-2">
                {SHARP_NAMES.map((n, pc) => (
                  <button
                    key={n}
                    onClick={() => setRootPc(pc)}
                    className={`py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                      rootPc === pc
                        ? "bg-brand-cta text-white"
                        : "bg-brand-card border border-brand-border text-brand-muted hover:text-brand-text"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-brand-muted">和弦类型</label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {CHORD_TYPES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setTypeId(c.id)}
                    className={`py-2 px-3 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer ${
                      typeId === c.id
                        ? "bg-brand-accent text-white"
                        : "bg-brand-card border border-brand-border text-brand-muted hover:text-brand-text"
                    }`}
                  >
                    {c.zh}
                    <span className="opacity-60 ml-1">{rootName}{c.suffix}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 右：结果 */}
          <div className="flex-1">
            <div className="text-3xl font-bold text-brand-heading">{name}</div>
            <div className="text-sm text-brand-muted mt-1">
              {CHORD_TYPES.find((c) => c.id === typeId)?.zh}
            </div>

            <div className="mt-4 rounded-xl bg-brand-deeper/60 border border-brand-border p-3 inline-block">
              <Staff midiNotes={[midis]} width={220} height={140} />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {noteNames.map((n, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-lg bg-brand-card border border-brand-border text-sm text-brand-text"
                >
                  {n}
                </span>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              <button onClick={() => playChordMidi(midis)} className="btn-primary">
                <Play className="w-4 h-4 mr-1" /> 同时弹奏
              </button>
              <button onClick={() => playSequenceMidi(midis, 0.32)} className="btn-secondary">
                <Play className="w-4 h-4 mr-1" /> 琶音
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
