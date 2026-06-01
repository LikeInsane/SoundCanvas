/**
 * 其他指板乐器（贝斯、尤克里里）的调弦与电脑键盘映射。
 * 约定与吉他一致：弦索引 0 = 最高音弦（第 1 弦），数值越大越低。
 */

import { noteToMidi } from "./music-theory";

/** 贝斯标准四弦调弦（第 1 弦到第 4 弦，由高到低）：G2 D2 A1 E1 */
export const BASS_TUNING = ["G2", "D2", "A1", "E1"];
export const BASS_OPEN_MIDI = BASS_TUNING.map((n) => noteToMidi(n));
export const BASS_FRET_COUNT = 15;

/** 尤克里里标准调弦（高音 re-entrant G）：第 1 弦 A4、第 2 弦 E4、第 3 弦 C4、第 4 弦 G4 */
export const UKULELE_TUNING = ["A4", "E4", "C4", "G4"];
export const UKULELE_OPEN_MIDI = UKULELE_TUNING.map((n) => noteToMidi(n));
export const UKULELE_FRET_COUNT = 12;

export interface FretKeyEntry {
  stringIndex: number;
  fret: number;
}

/** 四排按键，每排对应一条弦的前若干品 */
const ROW_KEYS: string[][] = [
  ["1", "2", "3", "4", "5", "6"],
  ["q", "w", "e", "r", "t", "y"],
  ["a", "s", "d", "f", "g", "h"],
  ["z", "x", "c", "v", "b", "n"],
];

/**
 * 为多弦指板构建键盘映射：从最低弦到最高弦依次对应 数字行/QWER/ASDF/ZXCV。
 * stringCount 超过 4 时仅映射最低的 4 条弦。
 */
export function buildFretKeyMap(stringCount: number): Record<string, FretKeyEntry> {
  const map: Record<string, FretKeyEntry> = {};
  const rows = Math.min(4, stringCount);
  for (let r = 0; r < rows; r++) {
    // 第 r 排对应弦索引：最低弦(stringCount-1) 在最上排
    const stringIndex = stringCount - 1 - r;
    ROW_KEYS[r].forEach((key, fret) => {
      map[key] = { stringIndex, fret };
    });
  }
  return map;
}

export const BASS_KEY_MAP = buildFretKeyMap(BASS_OPEN_MIDI.length);
export const UKULELE_KEY_MAP = buildFretKeyMap(UKULELE_OPEN_MIDI.length);

/** 尤克里里常用和弦（frets 长度 4：第 1 弦..第 4 弦；-1=闷音，0=空弦） */
export interface UkuleleChord {
  name: string;
  zh: string;
  frets: number[];
}

export const UKULELE_CHORDS: UkuleleChord[] = [
  { name: "C", zh: "C 大三", frets: [3, 0, 0, 0] },
  { name: "F", zh: "F 大三", frets: [0, 1, 0, 2] },
  { name: "G", zh: "G 大三", frets: [2, 3, 2, 0] },
  { name: "Am", zh: "A 小三", frets: [0, 0, 0, 2] },
  { name: "Dm", zh: "D 小三", frets: [0, 1, 2, 2] },
  { name: "Em", zh: "E 小三", frets: [2, 3, 4, 0] },
  { name: "A", zh: "A 大三", frets: [0, 0, 1, 2] },
  { name: "D", zh: "D 大三", frets: [0, 2, 2, 2] },
  { name: "G7", zh: "G 属七", frets: [2, 1, 2, 0] },
  { name: "C7", zh: "C 属七", frets: [1, 0, 0, 0] },
];

/** 返回和弦中各发声弦的 "stringIndex-fret" 键（用于指板高亮） */
export function ukuleleChordKeys(frets: number[]): string[] {
  const keys: string[] = [];
  frets.forEach((f, stringIndex) => {
    if (f >= 0) keys.push(`${stringIndex}-${f}`);
  });
  return keys;
}
