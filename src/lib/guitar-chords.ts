/**
 * 吉他常用开放和弦库。
 * frets 按弦索引 [第1弦(高E), 第2弦, 第3弦, 第4弦, 第5弦, 第6弦(低E)] 排列。
 * 值：-1 表示该弦闷音(x)，0 表示空弦，n 表示按第 n 品。
 */

export interface GuitarChord {
  name: string;
  zh: string;
  group: "大三和弦" | "小三和弦" | "属七和弦";
  /** 长度 6：第1弦..第6弦 */
  frets: number[];
}

export const GUITAR_CHORDS: GuitarChord[] = [
  { name: "C", zh: "C 大三", group: "大三和弦", frets: [0, 1, 0, 2, 3, -1] },
  { name: "G", zh: "G 大三", group: "大三和弦", frets: [3, 0, 0, 0, 2, 3] },
  { name: "D", zh: "D 大三", group: "大三和弦", frets: [2, 3, 2, 0, -1, -1] },
  { name: "A", zh: "A 大三", group: "大三和弦", frets: [0, 2, 2, 2, 0, -1] },
  { name: "E", zh: "E 大三", group: "大三和弦", frets: [0, 0, 1, 2, 2, 0] },
  { name: "F", zh: "F 大三", group: "大三和弦", frets: [1, 1, 2, 3, 3, 1] },
  { name: "Am", zh: "A 小三", group: "小三和弦", frets: [0, 1, 2, 2, 0, -1] },
  { name: "Em", zh: "E 小三", group: "小三和弦", frets: [0, 0, 0, 2, 2, 0] },
  { name: "Dm", zh: "D 小三", group: "小三和弦", frets: [1, 3, 2, 0, -1, -1] },
  { name: "G7", zh: "G 属七", group: "属七和弦", frets: [1, 0, 0, 0, 2, 3] },
  { name: "C7", zh: "C 属七", group: "属七和弦", frets: [0, 1, 3, 2, 3, -1] },
  { name: "D7", zh: "D 属七", group: "属七和弦", frets: [2, 1, 2, 0, -1, -1] },
  { name: "A7", zh: "A 属七", group: "属七和弦", frets: [0, 2, 0, 2, 0, -1] },
  { name: "E7", zh: "E 属七", group: "属七和弦", frets: [0, 0, 1, 0, 2, 0] },
];

/** 返回和弦中各发声弦的 "stringIndex-fret" 键（用于指板高亮） */
export function chordPositionKeys(frets: number[]): string[] {
  const keys: string[] = [];
  frets.forEach((f, stringIndex) => {
    if (f >= 0) keys.push(`${stringIndex}-${f}`);
  });
  return keys;
}
