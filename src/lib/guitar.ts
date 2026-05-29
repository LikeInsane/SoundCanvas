/**
 * 吉他指板内核：标准调弦、品位与 MIDI 换算、电脑键盘映射、某音在各弦上的位置查询。
 * 约定：弦索引 0 = 最高的高音 E 弦（第 1 弦），5 = 最低的低音 E 弦（第 6 弦）。
 */

import { midiToNote, noteToMidi } from "./music-theory";

/** 品格数（含空弦 0 品） */
export const FRET_COUNT = 15;

/**
 * 标准调弦各弦空弦音（从第 1 弦到第 6 弦，即从高到低）。
 * 第1弦 E4、第2弦 B3、第3弦 G3、第4弦 D3、第5弦 A2、第6弦 E2。
 */
export const STANDARD_TUNING = ["E4", "B3", "G3", "D3", "A2", "E2"];

/** 各弦空弦的 MIDI 编号 */
export const OPEN_STRING_MIDI = STANDARD_TUNING.map((n) => noteToMidi(n));

/** 给定弦索引与品位，返回该位置的 MIDI 编号 */
export function fretToMidi(stringIndex: number, fret: number): number {
  return OPEN_STRING_MIDI[stringIndex] + fret;
}

/** 给定弦索引与品位，返回音名 */
export function fretToNote(stringIndex: number, fret: number): string {
  return midiToNote(fretToMidi(stringIndex, fret));
}

export interface FretPosition {
  stringIndex: number;
  fret: number;
}

/**
 * 查询某个 pitch class（0-11）在指板上所有出现位置（用于提示功能）。
 */
export function findPositionsByPitchClass(pc: number): FretPosition[] {
  const positions: FretPosition[] = [];
  for (let s = 0; s < OPEN_STRING_MIDI.length; s++) {
    for (let f = 0; f <= FRET_COUNT; f++) {
      if (((fretToMidi(s, f) % 12) + 12) % 12 === pc) {
        positions.push({ stringIndex: s, fret: f });
      }
    }
  }
  return positions;
}

/**
 * 电脑键盘到指板位置的映射。
 * 四排按键对应下面四条弦（低音侧：第6、5、4、3 弦），每排前几个品。
 * 上面两条弦（第2、1 弦）需配合 Shift（在页面端处理 shiftKey）。
 */
interface KeyMapEntry {
  stringIndex: number;
  fret: number;
}

// 基础四排：数字行/QWER 行/ASDF 行/ZXCV 行，分别对应第6、5、4、3 弦的 0-5 品
const ROW_KEYS: string[][] = [
  ["1", "2", "3", "4", "5", "6"],
  ["q", "w", "e", "r", "t", "y"],
  ["a", "s", "d", "f", "g", "h"],
  ["z", "x", "c", "v", "b", "n"],
];

function buildKeyMap(): Record<string, KeyMapEntry> {
  const map: Record<string, KeyMapEntry> = {};
  // 四排对应第 6,5,4,3 弦（stringIndex 5,4,3,2）
  const rowToString = [5, 4, 3, 2];
  ROW_KEYS.forEach((row, r) => {
    row.forEach((key, fret) => {
      map[key] = { stringIndex: rowToString[r], fret };
    });
  });
  return map;
}

/** 不按 Shift 时的键盘映射（低四弦） */
export const KEY_MAP_LOWER = buildKeyMap();

/**
 * 按 Shift 时，将最上两排映射到第 2、1 弦（stringIndex 1、0）。
 * 这里复用数字行→第2弦、QWER 行→第1弦。
 */
export const KEY_MAP_UPPER: Record<string, KeyMapEntry> = (() => {
  const map: Record<string, KeyMapEntry> = {};
  ROW_KEYS[0].forEach((key, fret) => (map[key] = { stringIndex: 1, fret }));
  ROW_KEYS[1].forEach((key, fret) => (map[key] = { stringIndex: 0, fret }));
  return map;
})();
