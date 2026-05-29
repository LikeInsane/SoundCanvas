"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { ToolHeader } from "@/components/tools/ToolHeader";
import { Staff } from "@/components/notation/Staff";
import { SCALES, SHARP_NAMES, buildScale, midiToNote, noteToMidi } from "@/lib/music-theory";
import { playSequenceMidi } from "@/lib/instrument-audio";

/**
 * 音阶查找：选择根音与音阶类型，查看构成音、五线谱并顺序聆听。
 */
export default function ScaleFinderPage() {
  const [rootPc, setRootPc] = useState(0);
  const [scaleId, setScaleId] = useState("major");

  const rootName = SHARP_NAMES[rootPc];
  const rootMidi = noteToMidi(`${rootName}4`);
  const midis = buildScale(rootMidi, scaleId, true);
  const def = SCALES.find((s) => s.id === scaleId);

  return (
    <div>
      <ToolHeader title="音阶查找" desc="选择根音与音阶类型，查看构成音并顺序聆听。" />

      <div className="glass-card p-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
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
            <div className="flex-1">
              <label className="text-xs text-brand-muted">音阶类型</label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {SCALES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setScaleId(s.id)}
                    className={`py-2 px-3 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer ${
                      scaleId === s.id
                        ? "bg-brand-accent text-white"
                        : "bg-brand-card border border-brand-border text-brand-muted hover:text-brand-text"
                    }`}
                  >
                    {s.zh}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="text-2xl font-bold text-brand-heading">
              {rootName} {def?.zh}
            </div>
            <div className="text-sm text-brand-muted mt-1">{def?.en}</div>

            <div className="mt-4 rounded-xl bg-brand-deeper/60 border border-brand-border p-3 inline-block overflow-x-auto">
              <Staff midiNotes={midis} width={Math.max(360, midis.length * 42)} height={140} />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {midis.map((m, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-lg bg-brand-card border border-brand-border text-sm text-brand-text"
                >
                  {midiToNote(m)}
                </span>
              ))}
            </div>

            <button onClick={() => playSequenceMidi(midis, 0.32)} className="btn-primary mt-6">
              <Play className="w-4 h-4 mr-1" /> 顺序聆听
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
