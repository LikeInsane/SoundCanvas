"use client";

/**
 * 吉他指板组件：渲染 6 弦 × 若干品，点击发声，高亮按下/标记/提示位置。
 * 仅负责渲染与点击，发声与键盘监听由父组件控制。
 */

import { FRET_COUNT, OPEN_STRING_MIDI } from "@/lib/guitar";
import { midiToNote } from "@/lib/music-theory";

export interface FretboardProps {
  /** 当前按下高亮的 "string-fret" 键集合 */
  activeKeys?: Set<string>;
  /** 已标记的 "string-fret" 键集合 */
  markedKeys?: Set<string>;
  /** 提示高亮的 "string-fret" 键集合 */
  hintKeys?: Set<string>;
  showNoteNames?: boolean;
  /** 各弦空弦 MIDI（从第 1 弦到最低弦）；缺省为标准六弦吉他 */
  openStringMidi?: number[];
  /** 品格数（含 0 品）；缺省为吉他的 FRET_COUNT */
  fretCount?: number;
  onPress?: (stringIndex: number, fret: number) => void;
}

/** 常见品位标记点（单点） */
const DOT_FRETS = [3, 5, 7, 9, 12];

export function Fretboard({
  activeKeys,
  markedKeys,
  hintKeys,
  showNoteNames = false,
  openStringMidi = OPEN_STRING_MIDI,
  fretCount = FRET_COUNT,
  onPress,
}: FretboardProps) {
  const strings = openStringMidi.length;
  /** 按当前调弦计算某弦某品的音名 */
  const noteOf = (s: number, f: number) => midiToNote(openStringMidi[s] + f);

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[680px]">
        {/* 品位标记点行 */}
        <div className="flex pl-10">
          {Array.from({ length: fretCount + 1 }).map((_, f) => (
            <div key={f} className="flex-1 text-center text-[10px] text-brand-muted h-4">
              {DOT_FRETS.includes(f) ? "●" : f === 0 ? "" : ""}
            </div>
          ))}
        </div>

        {Array.from({ length: strings }).map((_, s) => (
          <div key={s} className="flex items-center">
            {/* 弦号 */}
            <div className="w-10 text-center text-[10px] text-brand-muted shrink-0">
              {noteOf(s, 0).replace(/\d/, "")}
            </div>
            <div className="flex flex-1 relative">
              {/* 弦线 */}
              <div
                className="absolute left-0 right-0 top-1/2 -translate-y-1/2 bg-brand-muted/40"
                style={{ height: 1 + (strings - 1 - s) * 0.4 }}
              />
              {Array.from({ length: fretCount + 1 }).map((_, f) => {
                const key = `${s}-${f}`;
                const active = activeKeys?.has(key);
                const marked = markedKeys?.has(key);
                const hint = hintKeys?.has(key);
                return (
                  <button
                    key={f}
                    onMouseDown={() => onPress?.(s, f)}
                    className={`flex-1 h-9 relative flex items-center justify-center group cursor-pointer ${
                      f === 0 ? "border-r-2 border-brand-muted/60" : "border-r border-brand-border"
                    }`}
                    aria-label={noteOf(s, f)}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-medium transition-colors ${
                        active
                          ? "bg-brand-cta text-white"
                          : marked
                          ? "bg-brand-accent text-white"
                          : hint
                          ? "bg-brand-green/70 text-white"
                          : "text-transparent group-hover:bg-white/10 group-hover:text-brand-muted"
                      }`}
                    >
                      {active || marked || hint || showNoteNames
                        ? noteOf(s, f).replace(/\d/, "")
                        : "·"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
