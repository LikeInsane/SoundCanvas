"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { ToolHeader } from "@/components/tools/ToolHeader";
import { Staff } from "@/components/notation/Staff";
import { INTERVALS, SHARP_NAMES, midiToNote, noteToMidi } from "@/lib/music-theory";
import { playChordMidi, playSequenceMidi } from "@/lib/instrument-audio";

/**
 * 音程查找：选择根音与音程，查看半音数、名称、五线谱与发声。
 */
export default function IntervalFinderPage() {
  const [rootPc, setRootPc] = useState(0);
  const [semitones, setSemitones] = useState(7); // 纯五度

  const rootName = SHARP_NAMES[rootPc];
  const rootMidi = noteToMidi(`${rootName}4`);
  const topMidi = rootMidi + semitones;
  const def = INTERVALS.find((i) => i.semitones === semitones);

  return (
    <div>
      <ToolHeader title="音程查找" desc="选择根音与音程，了解其名称、半音数与音响。" />

      <div className="glass-card p-8">
        <div className="flex flex-col md:flex-row gap-8">
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
              <label className="text-xs text-brand-muted">音程</label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {INTERVALS.map((iv) => (
                  <button
                    key={iv.semitones}
                    onClick={() => setSemitones(iv.semitones)}
                    className={`py-2 px-3 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer ${
                      semitones === iv.semitones
                        ? "bg-brand-accent text-white"
                        : "bg-brand-card border border-brand-border text-brand-muted hover:text-brand-text"
                    }`}
                  >
                    {iv.zh}
                    <span className="opacity-60 ml-1">{iv.short}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="text-3xl font-bold text-brand-heading">{def?.zh}</div>
            <div className="text-sm text-brand-muted mt-1">
              {def?.en} · {semitones} 个半音
            </div>

            <div className="mt-4 rounded-xl bg-brand-deeper/60 border border-brand-border p-3 inline-block">
              <Staff midiNotes={[[rootMidi, topMidi]]} width={200} height={140} />
            </div>

            <div className="mt-4 flex gap-2">
              <span className="px-3 py-1 rounded-lg bg-brand-card border border-brand-border text-sm text-brand-text">
                {midiToNote(rootMidi)}
              </span>
              <span className="px-3 py-1 rounded-lg bg-brand-card border border-brand-border text-sm text-brand-text">
                {midiToNote(topMidi)}
              </span>
            </div>

            <div className="mt-6 flex gap-3">
              <button onClick={() => playChordMidi([rootMidi, topMidi])} className="btn-primary">
                <Play className="w-4 h-4 mr-1" /> 同时
              </button>
              <button onClick={() => playSequenceMidi([rootMidi, topMidi], 0.5)} className="btn-secondary">
                <Play className="w-4 h-4 mr-1" /> 先后
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
