"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { ToolHeader } from "@/components/tools/ToolHeader";
import { SHARP_NAMES, FLAT_NAMES, midiToFreq, noteToMidi } from "@/lib/music-theory";
import { playMidi } from "@/lib/instrument-audio";

/**
 * 音名对照器：音名、唱名、降号拼写、频率与八度对照表，可逐音试听。
 */
const SOLFEGE = ["Do", "Di/Ra", "Re", "Ri/Me", "Mi", "Fa", "Fi/Se", "Sol", "Si/Le", "La", "Li/Te", "Ti"];

export default function NoteNamesPage() {
  const [octave, setOctave] = useState(4);

  return (
    <div>
      <ToolHeader title="音名对照器" desc="音名、唱名、降号拼写、频率与键盘八度的对照。" />

      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-xs text-brand-muted">八度</span>
          {[2, 3, 4, 5, 6].map((o) => (
            <button
              key={o}
              onClick={() => setOctave(o)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                octave === o
                  ? "bg-brand-cta text-white"
                  : "bg-brand-card border border-brand-border text-brand-muted hover:text-brand-text"
              }`}
            >
              {o}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-brand-muted border-b border-brand-border">
                <th className="py-2 pr-4 font-medium">音名(升)</th>
                <th className="py-2 pr-4 font-medium">音名(降)</th>
                <th className="py-2 pr-4 font-medium">唱名</th>
                <th className="py-2 pr-4 font-medium">频率(Hz)</th>
                <th className="py-2 font-medium">试听</th>
              </tr>
            </thead>
            <tbody>
              {SHARP_NAMES.map((sharp, pc) => {
                const midi = noteToMidi(`${sharp}${octave}`);
                const flat = FLAT_NAMES[pc];
                return (
                  <tr key={pc} className="border-b border-brand-border/50">
                    <td className="py-2 pr-4 text-brand-heading font-medium">{sharp}{octave}</td>
                    <td className="py-2 pr-4 text-brand-text">{flat !== sharp ? `${flat}${octave}` : "—"}</td>
                    <td className="py-2 pr-4 text-brand-muted">{SOLFEGE[pc]}</td>
                    <td className="py-2 pr-4 text-brand-muted tabular-nums">{midiToFreq(midi).toFixed(2)}</td>
                    <td className="py-2">
                      <button
                        onClick={() => playMidi(midi)}
                        className="w-7 h-7 rounded-full bg-brand-deeper border border-brand-border flex items-center justify-center text-brand-cta hover:border-brand-cta/40 transition-colors cursor-pointer"
                        aria-label={`播放 ${sharp}${octave}`}
                      >
                        <Play className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
