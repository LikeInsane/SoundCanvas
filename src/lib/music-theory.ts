/**
 * 乐理内核：纯函数库，供习题、工具、记谱、虚拟钢琴共享使用。
 * 约定：音高用科学记谱法字符串（如 "C4"、"F#3"、"Bb5"），
 * 内部统一以 MIDI 编号进行运算（C4 = 60，A4 = 69，对应 440Hz）。
 */

/** 十二个半音的升号拼写（默认拼写） */
export const SHARP_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"] as const;

/** 十二个半音的降号拼写 */
export const FLAT_NAMES = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"] as const;

/** 自然音名到其 pitch class（C=0） */
const LETTER_PC: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

const A4 = 440;

/** 音名（含八度）转 MIDI 编号。无法解析时返回 NaN */
export function noteToMidi(note: string): number {
  const match = note.match(/^([A-Ga-g])(#{1,2}|b{1,2}|x)?(-?\d+)$/);
  if (!match) return NaN;
  const letter = match[1].toUpperCase();
  const accidental = match[2] || "";
  const octave = parseInt(match[3], 10);
  let pc = LETTER_PC[letter];
  for (const ch of accidental) {
    if (ch === "#") pc += 1;
    else if (ch === "b") pc -= 1;
    else if (ch === "x") pc += 2;
  }
  return pc + (octave + 1) * 12;
}

/** MIDI 编号转音名，preferFlat 控制黑键拼写 */
export function midiToNote(midi: number, preferFlat = false): string {
  const names = preferFlat ? FLAT_NAMES : SHARP_NAMES;
  const pc = ((midi % 12) + 12) % 12;
  const octave = Math.floor(midi / 12) - 1;
  return `${names[pc]}${octave}`;
}

/** MIDI 编号转频率（十二平均律，A4=440） */
export function midiToFreq(midi: number): number {
  return A4 * Math.pow(2, (midi - 69) / 12);
}

/** 音名转频率 */
export function noteToFreq(note: string): number {
  return midiToFreq(noteToMidi(note));
}

/** pitch class（0-11）转音名（不含八度） */
export function pcToName(pc: number, preferFlat = false): string {
  const names = preferFlat ? FLAT_NAMES : SHARP_NAMES;
  return names[((pc % 12) + 12) % 12];
}

/** 是否为黑键 */
export function isBlackKey(midi: number): boolean {
  const pc = ((midi % 12) + 12) % 12;
  return [1, 3, 6, 8, 10].includes(pc);
}

/* ----------------------------- 音程 ----------------------------- */

export interface IntervalDef {
  /** 半音数 */
  semitones: number;
  /** 简写，如 P5、M3 */
  short: string;
  /** 中文名 */
  zh: string;
  /** 英文名 */
  en: string;
}

/** 一个八度内的音程定义（按半音数） */
export const INTERVALS: IntervalDef[] = [
  { semitones: 0, short: "P1", zh: "纯一度", en: "Perfect Unison" },
  { semitones: 1, short: "m2", zh: "小二度", en: "Minor 2nd" },
  { semitones: 2, short: "M2", zh: "大二度", en: "Major 2nd" },
  { semitones: 3, short: "m3", zh: "小三度", en: "Minor 3rd" },
  { semitones: 4, short: "M3", zh: "大三度", en: "Major 3rd" },
  { semitones: 5, short: "P4", zh: "纯四度", en: "Perfect 4th" },
  { semitones: 6, short: "TT", zh: "三全音", en: "Tritone" },
  { semitones: 7, short: "P5", zh: "纯五度", en: "Perfect 5th" },
  { semitones: 8, short: "m6", zh: "小六度", en: "Minor 6th" },
  { semitones: 9, short: "M6", zh: "大六度", en: "Major 6th" },
  { semitones: 10, short: "m7", zh: "小七度", en: "Minor 7th" },
  { semitones: 11, short: "M7", zh: "大七度", en: "Major 7th" },
  { semitones: 12, short: "P8", zh: "纯八度", en: "Perfect Octave" },
];

/** 根据半音数取音程定义 */
export function intervalBySemitones(semitones: number): IntervalDef | undefined {
  return INTERVALS.find((i) => i.semitones === semitones);
}

/* ----------------------------- 音阶 ----------------------------- */

export interface ScaleDef {
  id: string;
  zh: string;
  en: string;
  /** 相对根音的半音步进 */
  intervals: number[];
}

export const SCALES: ScaleDef[] = [
  { id: "major", zh: "大调", en: "Major", intervals: [0, 2, 4, 5, 7, 9, 11] },
  { id: "natural-minor", zh: "自然小调", en: "Natural Minor", intervals: [0, 2, 3, 5, 7, 8, 10] },
  { id: "harmonic-minor", zh: "和声小调", en: "Harmonic Minor", intervals: [0, 2, 3, 5, 7, 8, 11] },
  { id: "melodic-minor", zh: "旋律小调", en: "Melodic Minor", intervals: [0, 2, 3, 5, 7, 9, 11] },
  { id: "major-pentatonic", zh: "大调五声", en: "Major Pentatonic", intervals: [0, 2, 4, 7, 9] },
  { id: "minor-pentatonic", zh: "小调五声", en: "Minor Pentatonic", intervals: [0, 3, 5, 7, 10] },
  { id: "blues", zh: "蓝调", en: "Blues", intervals: [0, 3, 5, 6, 7, 10] },
  { id: "dorian", zh: "多利亚", en: "Dorian", intervals: [0, 2, 3, 5, 7, 9, 10] },
  { id: "phrygian", zh: "弗里几亚", en: "Phrygian", intervals: [0, 1, 3, 5, 7, 8, 10] },
  { id: "lydian", zh: "利底亚", en: "Lydian", intervals: [0, 2, 4, 6, 7, 9, 11] },
  { id: "mixolydian", zh: "混合利底亚", en: "Mixolydian", intervals: [0, 2, 4, 5, 7, 9, 10] },
  { id: "locrian", zh: "洛克里亚", en: "Locrian", intervals: [0, 1, 3, 5, 6, 8, 10] },
];

export function scaleById(id: string): ScaleDef | undefined {
  return SCALES.find((s) => s.id === id);
}

/** 构建音阶：返回 MIDI 编号数组（含八度循环音） */
export function buildScale(rootMidi: number, scaleId: string, withOctave = true): number[] {
  const def = scaleById(scaleId);
  if (!def) return [rootMidi];
  const notes = def.intervals.map((st) => rootMidi + st);
  if (withOctave) notes.push(rootMidi + 12);
  return notes;
}

/* ----------------------------- 和弦 ----------------------------- */

export interface ChordDef {
  id: string;
  /** 后缀，如 ""、"m"、"7"、"maj7" */
  suffix: string;
  zh: string;
  /** 相对根音的半音 */
  intervals: number[];
}

export const CHORD_TYPES: ChordDef[] = [
  { id: "major", suffix: "", zh: "大三和弦", intervals: [0, 4, 7] },
  { id: "minor", suffix: "m", zh: "小三和弦", intervals: [0, 3, 7] },
  { id: "diminished", suffix: "dim", zh: "减三和弦", intervals: [0, 3, 6] },
  { id: "augmented", suffix: "aug", zh: "增三和弦", intervals: [0, 4, 8] },
  { id: "sus2", suffix: "sus2", zh: "挂二和弦", intervals: [0, 2, 7] },
  { id: "sus4", suffix: "sus4", zh: "挂四和弦", intervals: [0, 5, 7] },
  { id: "major7", suffix: "maj7", zh: "大七和弦", intervals: [0, 4, 7, 11] },
  { id: "minor7", suffix: "m7", zh: "小七和弦", intervals: [0, 3, 7, 10] },
  { id: "dominant7", suffix: "7", zh: "属七和弦", intervals: [0, 4, 7, 10] },
  { id: "minor7b5", suffix: "m7b5", zh: "半减七和弦", intervals: [0, 3, 6, 10] },
  { id: "diminished7", suffix: "dim7", zh: "减七和弦", intervals: [0, 3, 6, 9] },
  { id: "major6", suffix: "6", zh: "大六和弦", intervals: [0, 4, 7, 9] },
  { id: "minor6", suffix: "m6", zh: "小六和弦", intervals: [0, 3, 7, 9] },
];

export function chordTypeById(id: string): ChordDef | undefined {
  return CHORD_TYPES.find((c) => c.id === id);
}

/** 构建和弦：返回 MIDI 编号数组 */
export function buildChord(rootMidi: number, chordTypeId: string): number[] {
  const def = chordTypeById(chordTypeId);
  if (!def) return [rootMidi];
  return def.intervals.map((st) => rootMidi + st);
}

/** 和弦名（如 "Cmaj7"）= 根音名 + 后缀 */
export function chordName(rootName: string, chordTypeId: string): string {
  const def = chordTypeById(chordTypeId);
  return `${rootName}${def ? def.suffix : ""}`;
}

/* ----------------------------- 调号 / 五度圈 ----------------------------- */

export interface KeyDef {
  /** 大调主音名 */
  major: string;
  /** 关系小调主音名 */
  minor: string;
  /** 升号数（正）或降号数（负） */
  accidentals: number;
  /** 升降记号类型 */
  type: "sharp" | "flat" | "natural";
}

/** 按五度圈顺序排列（从 C 顺时针为升号，逆时针为降号） */
export const CIRCLE_OF_FIFTHS: KeyDef[] = [
  { major: "C", minor: "Am", accidentals: 0, type: "natural" },
  { major: "G", minor: "Em", accidentals: 1, type: "sharp" },
  { major: "D", minor: "Bm", accidentals: 2, type: "sharp" },
  { major: "A", minor: "F#m", accidentals: 3, type: "sharp" },
  { major: "E", minor: "C#m", accidentals: 4, type: "sharp" },
  { major: "B", minor: "G#m", accidentals: 5, type: "sharp" },
  { major: "F#", minor: "D#m", accidentals: 6, type: "sharp" },
  { major: "Db", minor: "Bbm", accidentals: -5, type: "flat" },
  { major: "Ab", minor: "Fm", accidentals: -4, type: "flat" },
  { major: "Eb", minor: "Cm", accidentals: -3, type: "flat" },
  { major: "Bb", minor: "Gm", accidentals: -2, type: "flat" },
  { major: "F", minor: "Dm", accidentals: -1, type: "flat" },
];

/** 升号出现顺序（FCGDAEB） */
export const SHARP_ORDER = ["F", "C", "G", "D", "A", "E", "B"];
/** 降号出现顺序（BEADGCF） */
export const FLAT_ORDER = ["B", "E", "A", "D", "G", "C", "F"];

/* ----------------------------- 键盘布局 ----------------------------- */

export interface PianoKey {
  midi: number;
  note: string;
  isBlack: boolean;
}

/** 生成从 startMidi 到 endMidi 的键盘按键列表 */
export function buildKeyboard(startMidi: number, endMidi: number): PianoKey[] {
  const keys: PianoKey[] = [];
  for (let m = startMidi; m <= endMidi; m++) {
    keys.push({ midi: m, note: midiToNote(m), isBlack: isBlackKey(m) });
  }
  return keys;
}

/** 电脑键盘到相对半音的映射（从 C 开始两排，类似 Musicca） */
export const KEYBOARD_MAP: Record<string, number> = {
  a: 0, w: 1, s: 2, e: 3, d: 4, f: 5, t: 6, g: 7, y: 8, h: 9, u: 10, j: 11,
  k: 12, o: 13, l: 14, p: 15, ";": 16,
};

/* ----------------------------- 记谱辅助 ----------------------------- */

/**
 * MIDI 编号转 VexFlow key 格式，如 60 -> "c/4"、61 -> "c#/4"。
 * preferFlat 控制黑键拼写（降号或升号）。
 */
export function midiToVexKey(midi: number, preferFlat = false): string {
  const name = pcToName(((midi % 12) + 12) % 12, preferFlat);
  const octave = Math.floor(midi / 12) - 1;
  const letter = name[0].toLowerCase();
  const accidental = name.slice(1); // "" | "#" | "b"
  return `${letter}${accidental}/${octave}`;
}

/* ----------------------------- 谱号音域 ----------------------------- */

export type ClefName = "treble" | "bass" | "alto" | "tenor";

/** 各谱号在谱内（不含附加线）较舒适的自然音域（MIDI 起止） */
export const CLEF_RANGES: Record<ClefName, [number, number]> = {
  treble: [noteToMidi("C4"), noteToMidi("A5")],
  bass: [noteToMidi("E2"), noteToMidi("C4")],
  alto: [noteToMidi("C3"), noteToMidi("G4")],
  tenor: [noteToMidi("A2"), noteToMidi("E4")],
};

/** 各谱号谱内自然音名池（仅白键，含八度） */
export function naturalNotesInClef(clef: ClefName): string[] {
  const [lo, hi] = CLEF_RANGES[clef];
  const out: string[] = [];
  for (let m = lo; m <= hi; m++) {
    if (!isBlackKey(m)) out.push(midiToNote(m));
  }
  return out;
}

/** 附加线音（高于或低于谱表的音），用于附加线练习 */
export const LEDGER_NOTES: Record<ClefName, string[]> = {
  treble: ["F3", "G3", "A3", "B5", "C6", "D6", "E6"],
  bass: ["C2", "D2", "B3", "C4", "D4", "E4"],
  alto: ["A2", "B2", "A4", "B4", "C5"],
  tenor: ["F2", "G2", "F4", "G4", "A4"],
};

/* ----------------------------- 节奏型 ----------------------------- */

export interface RhythmCell {
  /** VexFlow 时值：q 四分, h 二分, w 全, 8 八分, 16 十六分；末尾 d 表示附点 */
  dur: string;
  rest?: boolean;
}

export interface RhythmPattern {
  id: string;
  zh: string;
  cells: RhythmCell[];
}

/** 常用一小节(4/4)节奏型 */
export const RHYTHM_PATTERNS: RhythmPattern[] = [
  { id: "quarters", zh: "四分音符 × 4", cells: [{ dur: "q" }, { dur: "q" }, { dur: "q" }, { dur: "q" }] },
  { id: "eighths", zh: "八分音符 × 8", cells: Array.from({ length: 8 }, () => ({ dur: "8" })) },
  {
    id: "half-quarters",
    zh: "二分 + 两个四分",
    cells: [{ dur: "h" }, { dur: "q" }, { dur: "q" }],
  },
  {
    id: "dotted",
    zh: "附点四分 + 八分",
    cells: [{ dur: "qd" }, { dur: "8" }, { dur: "q" }, { dur: "q" }],
  },
  {
    id: "sixteenths",
    zh: "十六分音符组",
    cells: [{ dur: "16" }, { dur: "16" }, { dur: "16" }, { dur: "16" }, { dur: "q" }, { dur: "q" }, { dur: "q" }],
  },
  {
    id: "rest-mix",
    zh: "含休止符",
    cells: [{ dur: "q" }, { dur: "q", rest: true }, { dur: "q" }, { dur: "q" }],
  },
  {
    id: "syncopation",
    zh: "切分节奏",
    cells: [{ dur: "8" }, { dur: "q" }, { dur: "q" }, { dur: "q" }, { dur: "8" }],
  },
];

/** 单个时值换算为拍数（以四分音符为 1 拍） */
export function durToBeats(dur: string): number {
  const dotted = dur.endsWith("d");
  const base = dotted ? dur.slice(0, -1) : dur;
  const map: Record<string, number> = { w: 4, h: 2, q: 1, "8": 0.5, "16": 0.25 };
  const beats = map[base] ?? 1;
  return dotted ? beats * 1.5 : beats;
}

/** 计算一组节奏单元中各「非休止音」的起拍时间（拍） */
export function patternOnsets(cells: RhythmCell[]): number[] {
  const onsets: number[] = [];
  let t = 0;
  for (const c of cells) {
    if (!c.rest) onsets.push(t);
    t += durToBeats(c.dur);
  }
  return onsets;
}
