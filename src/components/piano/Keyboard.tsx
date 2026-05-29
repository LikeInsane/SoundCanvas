"use client";

/**
 * 钢琴键盘组件：渲染白键与黑键，支持点击发声、当前按下高亮、音符标记高亮。
 * 仅负责渲染与点击交互，发声与键盘监听由父组件控制。
 */

import { buildKeyboard, isBlackKey, midiToNote } from "@/lib/music-theory";

export interface KeyboardProps {
  startMidi: number;
  endMidi: number;
  /** 当前按下（高亮）的 MIDI 集合 */
  activeMidis?: Set<number>;
  /** 已标记的 MIDI 集合 */
  markedMidis?: Set<number>;
  /** 是否显示音名标签 */
  showLabels?: boolean;
  /** 显示键盘快捷键标签（与音名二选一） */
  shortcutLabels?: Record<number, string>;
  onPress?: (midi: number) => void;
}

export function Keyboard({
  startMidi,
  endMidi,
  activeMidis,
  markedMidis,
  showLabels = true,
  shortcutLabels,
  onPress,
}: KeyboardProps) {
  const keys = buildKeyboard(startMidi, endMidi);
  const whiteKeys = keys.filter((k) => !k.isBlack);
  const whiteWidth = 100 / whiteKeys.length;

  // 计算每个白键的左偏移序号，用于定位黑键
  const whiteIndexByMidi = new Map<number, number>();
  let wi = 0;
  for (const k of keys) {
    if (!k.isBlack) {
      whiteIndexByMidi.set(k.midi, wi);
      wi += 1;
    }
  }

  return (
    <div className="relative w-full select-none" style={{ height: 180 }}>
      {/* 白键 */}
      <div className="flex w-full h-full">
        {whiteKeys.map((k) => {
          const active = activeMidis?.has(k.midi);
          const marked = markedMidis?.has(k.midi);
          return (
            <button
              key={k.midi}
              onMouseDown={() => onPress?.(k.midi)}
              className={`relative h-full border border-brand-border rounded-b-md transition-colors duration-75 cursor-pointer ${
                active
                  ? "bg-brand-cta"
                  : marked
                  ? "bg-brand-accent/40"
                  : "bg-white hover:bg-brand-surface"
              }`}
              style={{ width: `${whiteWidth}%` }}
              aria-label={k.note}
            >
              {(showLabels || shortcutLabels) && (
                <span
                  className={`absolute bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-medium ${
                    active ? "text-white" : "text-gray-500"
                  }`}
                >
                  {shortcutLabels?.[k.midi] ?? (showLabels ? k.note : "")}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 黑键 */}
      {keys
        .filter((k) => k.isBlack)
        .map((k) => {
          // 黑键定位在前一个白键与后一个白键之间
          const prevWhite = whiteIndexByMidi.get(k.midi - 1);
          if (prevWhite === undefined) return null;
          const left = (prevWhite + 1) * whiteWidth;
          const active = activeMidis?.has(k.midi);
          const marked = markedMidis?.has(k.midi);
          return (
            <button
              key={k.midi}
              onMouseDown={() => onPress?.(k.midi)}
              className={`absolute top-0 rounded-b-md border border-black/40 transition-colors duration-75 cursor-pointer z-10 ${
                active ? "bg-brand-cta" : marked ? "bg-brand-accent" : "bg-gray-900 hover:bg-gray-800"
              }`}
              style={{
                left: `${left}%`,
                width: `${whiteWidth * 0.62}%`,
                height: "62%",
                transform: "translateX(-50%)",
              }}
              aria-label={midiToNote(k.midi)}
            >
              {shortcutLabels?.[k.midi] && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[8px] font-medium text-gray-300">
                  {shortcutLabels[k.midi]}
                </span>
              )}
            </button>
          );
        })}
    </div>
  );
}

export { isBlackKey };
