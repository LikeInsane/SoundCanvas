/**
 * 习题题库（配置驱动，题目均为原创乐理练习）。
 * 每个关卡(Level)提供一个题目生成器 gen()，每次调用随机产出一道题。
 * QuizEngine 按 total 数量出题、记录正误并保存进度。
 */

import {
  CHORD_TYPES,
  CIRCLE_OF_FIFTHS,
  INTERVALS,
  SCALES,
  SHARP_NAMES,
  SHARP_ORDER,
  FLAT_ORDER,
  RHYTHM_PATTERNS,
  buildChord,
  buildScale,
  midiToNote,
  noteToMidi,
  naturalNotesInClef,
  LEDGER_NOTES,
  CLEF_RANGES,
  type ClefName,
  type RhythmCell,
} from "./music-theory";

/** 作答模式：选择题 / 钢琴点键 / 钢琴构建 / 节奏打拍 / 记谱书写 / 书写调号 */
export type AnswerMode =
  | "choice"
  | "piano-key"
  | "piano-build"
  | "rhythm-tap"
  | "staff-write"
  | "key-write";

export interface Question {
  prompt: string;
  /** 可选：展示的五线谱（音名字符串） */
  staff?: { notes: string[] | string[][]; clef?: ClefName; keySignature?: string };
  /** 可选：可播放的音频（音名字符串） */
  audio?: { notes: string[]; mode: "note" | "chord" | "sequence"; autoHidden?: boolean };
  /** 作答模式，缺省为选择题 */
  answerMode?: AnswerMode;
  /** 选择题选项与答案 */
  options?: string[];
  answer?: string;
  /** 是否为听力题（隐藏五线谱，必须靠听） */
  ear?: boolean;
  /** 钢琴作答模式：键盘音域与期望按键 */
  pianoRange?: [number, number];
  expectedMidis?: number[];
  /** 节奏打拍模式：节奏型与速度 */
  rhythm?: RhythmCell[];
  bpm?: number;
  /** 记谱书写模式：书写谱号与目标音 */
  writeClef?: "treble" | "bass";
  targetNote?: string;
  /** 书写调号模式：升/降号类型与数量 */
  keyAccidentalType?: "sharp" | "flat";
  keyAccidentalCount?: number;
}

export type QuestionGen = () => Question;

export interface Level {
  id: string;
  title: string;
  total: number;
  gen: QuestionGen;
}

export interface ExCategory {
  id: string;
  title: string;
  desc: string;
  levels: Level[];
}

/* ----------------------------- 工具函数 ----------------------------- */

function sample<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** 由正确答案 + 干扰池生成 n 个选项（含正确答案），去重后打乱 */
function makeOptions(correct: string, pool: string[], n = 4): string[] {
  const wrong = shuffle(pool.filter((p) => p !== correct)).slice(0, n - 1);
  return shuffle([correct, ...wrong]);
}

const NATURAL_LETTERS = ["C", "D", "E", "F", "G", "A", "B"];
const SHARP_SPELLINGS = ["C#", "D#", "F#", "G#", "A#"];
const TREBLE_NATURALS = naturalNotesInClef("treble");

const letterOf = (note: string) => note.replace(/[#b]?-?\d+$/, "");

/** 以 C 为边界、覆盖目标音上下各一个八度的钢琴音域 */
function cFloor(m: number): number {
  return m - (((m % 12) + 12) % 12);
}
function rangeAround(midi: number): [number, number] {
  const start = cFloor(midi) - 12;
  return [start, start + 24];
}
function range2oct(rootMidi: number): [number, number] {
  const start = cFloor(rootMidi);
  return [start, start + 24];
}

/* ----------------------------- 题目生成器 ----------------------------- */

// 五线谱识音（任意谱号）
function genNoteOnStaff(clef: ClefName): QuestionGen {
  const pool = naturalNotesInClef(clef);
  return () => {
    const note = sample(pool);
    const letter = letterOf(note);
    return {
      prompt: "五线谱上的这个音是？",
      staff: { notes: [note], clef },
      options: makeOptions(letter, NATURAL_LETTERS, 4),
      answer: letter,
    };
  };
}

// 钢琴作答：看谱在键盘上点出对应的键（音高与八度都要正确）
function genNotePianoKey(clef: ClefName): QuestionGen {
  const pool = naturalNotesInClef(clef);
  return () => {
    const note = sample(pool);
    const midi = noteToMidi(note);
    return {
      prompt: "在键盘上点出五线谱所示的音",
      staff: { notes: [note], clef },
      answerMode: "piano-key",
      pianoRange: rangeAround(midi),
      expectedMidis: [midi],
    };
  };
}

// 变音记号识别（黑键，升号拼写）
function genAccidental(clef: ClefName): QuestionGen {
  const [lo, hi] = CLEF_RANGES[clef];
  const blackPool: string[] = [];
  for (let m = lo; m <= hi; m++) {
    const pc = ((m % 12) + 12) % 12;
    if ([1, 3, 6, 8, 10].includes(pc)) blackPool.push(midiToNote(m));
  }
  return () => {
    const note = sample(blackPool);
    const name = note.replace(/-?\d+$/, "");
    return {
      prompt: "这个带变音记号的音是？",
      staff: { notes: [note], clef },
      options: makeOptions(name, SHARP_SPELLINGS, 4),
      answer: name,
    };
  };
}

// 附加线识别
function genLedger(clef: ClefName): QuestionGen {
  const pool = LEDGER_NOTES[clef];
  return () => {
    const note = sample(pool);
    const letter = letterOf(note);
    return {
      prompt: "这个使用了附加线的音是？",
      staff: { notes: [note], clef },
      options: makeOptions(letter, NATURAL_LETTERS, 4),
      answer: letter,
    };
  };
}

// 听辨两音高低
function genHigherLower(): QuestionGen {
  return () => {
    const a = noteToMidi(sample(TREBLE_NATURALS));
    let b = noteToMidi(sample(TREBLE_NATURALS));
    while (b === a) b = noteToMidi(sample(TREBLE_NATURALS));
    return {
      prompt: "先后播放两个音，第二个音相对第一个是？",
      audio: { notes: [midiToNote(a), midiToNote(b)], mode: "sequence" },
      options: ["更高", "更低"],
      answer: b > a ? "更高" : "更低",
      ear: true,
    };
  };
}

// 看谱识音程
function genIntervalOnStaff(): QuestionGen {
  const usable = INTERVALS.filter((i) => i.semitones > 0 && i.semitones <= 12);
  return () => {
    const rootMidi = noteToMidi(sample(["C4", "D4", "E4", "F4", "G4"]));
    const iv = sample(usable);
    const top = rootMidi + iv.semitones;
    return {
      prompt: "五线谱上这两个音构成的音程是？",
      staff: { notes: [[midiToNote(rootMidi), midiToNote(top)]] },
      options: makeOptions(
        iv.zh,
        usable.map((x) => x.zh),
        4
      ),
      answer: iv.zh,
    };
  };
}

// 听辨音程
function genIntervalEar(): QuestionGen {
  const usable = INTERVALS.filter((i) => [2, 3, 4, 5, 7, 9, 12].includes(i.semitones));
  return () => {
    const rootMidi = noteToMidi(sample(["C4", "D4", "E4", "G4"]));
    const iv = sample(usable);
    const top = rootMidi + iv.semitones;
    return {
      prompt: "听这两个先后出现的音，它们的音程是？",
      audio: { notes: [midiToNote(rootMidi), midiToNote(top)], mode: "sequence" },
      options: makeOptions(
        iv.zh,
        usable.map((x) => x.zh),
        4
      ),
      answer: iv.zh,
      ear: true,
    };
  };
}

// 看谱识三和弦类型
function genTriadOnStaff(): QuestionGen {
  const triads = CHORD_TYPES.filter((c) => ["major", "minor", "diminished", "augmented"].includes(c.id));
  return () => {
    const rootMidi = noteToMidi(sample(["C4", "D4", "E4", "F4", "G4"]));
    const ct = sample(triads);
    const midis = buildChord(rootMidi, ct.id);
    return {
      prompt: "五线谱上的这个和弦是什么类型？",
      staff: { notes: [midis.map((m) => midiToNote(m))] },
      options: makeOptions(
        ct.zh,
        triads.map((x) => x.zh),
        4
      ),
      answer: ct.zh,
    };
  };
}

// 听辨大小三和弦
function genTriadEar(): QuestionGen {
  const triads = CHORD_TYPES.filter((c) => ["major", "minor"].includes(c.id));
  return () => {
    const rootMidi = noteToMidi(sample(["C4", "D4", "E4", "F4", "G4", "A4"]));
    const ct = sample(triads);
    const midis = buildChord(rootMidi, ct.id);
    return {
      prompt: "听这个和弦，它是大三和弦还是小三和弦？",
      audio: { notes: midis.map((m) => midiToNote(m)), mode: "chord" },
      options: ["大三和弦", "小三和弦"],
      answer: ct.zh,
      ear: true,
    };
  };
}

// 听辨七和弦
function genSeventhEar(): QuestionGen {
  const sevenths = CHORD_TYPES.filter((c) => ["major7", "minor7", "dominant7"].includes(c.id));
  return () => {
    const rootMidi = noteToMidi(sample(["C4", "D4", "F4", "G4"]));
    const ct = sample(sevenths);
    const midis = buildChord(rootMidi, ct.id);
    return {
      prompt: "听这个七和弦，它属于哪一种？",
      audio: { notes: midis.map((m) => midiToNote(m)), mode: "chord" },
      options: makeOptions(
        ct.zh,
        sevenths.map((x) => x.zh),
        3
      ),
      answer: ct.zh,
      ear: true,
    };
  };
}

// 听辨大调/小调音阶
function genScaleEar(): QuestionGen {
  const scales = SCALES.filter((s) => ["major", "natural-minor"].includes(s.id));
  return () => {
    const rootMidi = noteToMidi(sample(["C4", "D4", "E4", "G4", "A4"]));
    const sc = sample(scales);
    const midis = buildScale(rootMidi, sc.id, true);
    return {
      prompt: "听这条音阶，它是大调还是小调？",
      audio: { notes: midis.map((m) => midiToNote(m)), mode: "sequence" },
      options: ["大调", "自然小调"],
      answer: sc.zh,
      ear: true,
    };
  };
}

// 识别音阶类型（听 + 多选）
function genScaleType(): QuestionGen {
  const scales = SCALES.filter((s) =>
    ["major", "natural-minor", "major-pentatonic", "blues"].includes(s.id)
  );
  return () => {
    const rootMidi = noteToMidi(sample(["C4", "D4", "G4"]));
    const sc = sample(scales);
    const midis = buildScale(rootMidi, sc.id, true);
    return {
      prompt: "听这条音阶，判断它的类型。",
      audio: { notes: midis.map((m) => midiToNote(m)), mode: "sequence" },
      options: makeOptions(
        sc.zh,
        scales.map((x) => x.zh),
        4
      ),
      answer: sc.zh,
      ear: true,
    };
  };
}

// 看调号识别大调
function genKeyFromSignature(): QuestionGen {
  const keys = CIRCLE_OF_FIFTHS.filter((k) => Math.abs(k.accidentals) <= 4);
  return () => {
    const k = sample(keys);
    const rootMidi = noteToMidi(`${k.major.replace("#", "#")}4`);
    return {
      prompt: "根据谱号后的调号，判断这是什么大调？",
      staff: {
        notes: [midiToNote(rootMidi)],
        keySignature: k.major,
      },
      options: makeOptions(
        `${k.major} 大调`,
        keys.map((x) => `${x.major} 大调`),
        4
      ),
      answer: `${k.major} 大调`,
    };
  };
}

// 升号顺序
function genSharpOrder(): QuestionGen {
  return () => {
    const idx = Math.floor(Math.random() * SHARP_ORDER.length);
    const correct = `${SHARP_ORDER[idx]}#`;
    const pool = SHARP_ORDER.map((n) => `${n}#`);
    return {
      prompt: `按升号出现顺序（FCGDAEB），第 ${idx + 1} 个升号是？`,
      options: makeOptions(correct, pool, 4),
      answer: correct,
    };
  };
}

// 钢琴构建：在键盘上点出根音上方某音程的两个音
function genIntervalBuild(): QuestionGen {
  const usable = INTERVALS.filter((i) => [2, 3, 4, 5, 7, 9, 12].includes(i.semitones));
  return () => {
    const rootMidi = noteToMidi(sample(["C4", "D4", "E4", "F4", "G4"]));
    const iv = sample(usable);
    const top = rootMidi + iv.semitones;
    return {
      prompt: `在键盘上点出 ${midiToNote(rootMidi)} 与其上方${iv.zh}的两个音`,
      answerMode: "piano-build",
      pianoRange: range2oct(rootMidi),
      expectedMidis: [rootMidi, top],
    };
  };
}

// 钢琴构建：构建三和弦
function genChordBuild(): QuestionGen {
  const triads = CHORD_TYPES.filter((c) => ["major", "minor", "diminished", "augmented"].includes(c.id));
  return () => {
    const rootMidi = noteToMidi(sample(["C4", "D4", "E4", "F4", "G4"]));
    const ct = sample(triads);
    const midis = buildChord(rootMidi, ct.id);
    return {
      prompt: `在键盘上构建 ${midiToNote(rootMidi).replace(/\d/, "")} ${ct.zh}`,
      answerMode: "piano-build",
      pianoRange: range2oct(rootMidi),
      expectedMidis: midis,
    };
  };
}

// 钢琴构建：构建音阶
function genScaleBuild(): QuestionGen {
  const scales = SCALES.filter((s) => ["major", "natural-minor", "major-pentatonic"].includes(s.id));
  return () => {
    const rootMidi = noteToMidi(sample(["C4", "D4", "G4"]));
    const sc = sample(scales);
    const midis = buildScale(rootMidi, sc.id, true);
    return {
      prompt: `在键盘上构建 ${midiToNote(rootMidi).replace(/\d/, "")} ${sc.zh}（上行）`,
      answerMode: "piano-build",
      pianoRange: range2oct(rootMidi),
      expectedMidis: midis,
    };
  };
}

// 节奏打拍
function genRhythmTap(): QuestionGen {
  return () => {
    const p = sample(RHYTHM_PATTERNS.filter((x) => x.id !== "sixteenths"));
    return {
      prompt: "听四拍预备，然后按谱面节奏用空格键敲击",
      answerMode: "rhythm-tap",
      rhythm: p.cells,
      bpm: 80,
    };
  };
}

// 节奏识别（看谱选名称）
function genRhythmIdentify(): QuestionGen {
  return () => {
    const p = sample(RHYTHM_PATTERNS);
    return {
      prompt: "下面谱面展示的是哪种节奏型？",
      rhythm: p.cells,
      answerMode: "choice",
      options: makeOptions(
        p.zh,
        RHYTHM_PATTERNS.map((x) => x.zh),
        4
      ),
      answer: p.zh,
    };
  };
}

// 降号顺序
function genFlatOrder(): QuestionGen {
  return () => {
    const idx = Math.floor(Math.random() * FLAT_ORDER.length);
    const correct = `${FLAT_ORDER[idx]}b`;
    const pool = FLAT_ORDER.map((n) => `${n}b`);
    return {
      prompt: `按降号出现顺序（BEADGCF），第 ${idx + 1} 个降号是？`,
      options: makeOptions(correct, pool, 4),
      answer: correct,
    };
  };
}

// 音阶记谱识别（看谱选类型）
function genScaleNotation(): QuestionGen {
  const scales = SCALES.filter((s) => ["major", "natural-minor", "major-pentatonic", "dorian"].includes(s.id));
  return () => {
    const rootMidi = noteToMidi(sample(["C4", "D4", "G4"]));
    const sc = sample(scales);
    const midis = buildScale(rootMidi, sc.id, true);
    return {
      prompt: "五线谱上的这条音阶是什么类型？",
      staff: { notes: midis.map((m) => midiToNote(m)) },
      options: makeOptions(
        sc.zh,
        scales.map((x) => x.zh),
        4
      ),
      answer: sc.zh,
    };
  };
}

// 记谱书写：在五线谱上写出指定音
function genNoteWrite(clef: "treble" | "bass"): QuestionGen {
  const naturals = naturalNotesInClef(clef);
  const [lo, hi] = CLEF_RANGES[clef];
  const sharps: string[] = [];
  for (let m = lo; m <= hi; m++) {
    const pc = ((m % 12) + 12) % 12;
    if ([1, 3, 6, 8, 10].includes(pc)) sharps.push(midiToNote(m));
  }
  const pool = [...naturals, ...sharps];
  return () => {
    const target = sample(pool);
    return {
      prompt: `在五线谱上写出 ${target}`,
      answerMode: "staff-write",
      writeClef: clef,
      targetNote: target,
    };
  };
}

// 书写调号：按调号在五线谱上写出对应升/降号
function genKeyWrite(): QuestionGen {
  const keys = CIRCLE_OF_FIFTHS.filter((k) => k.accidentals !== 0 && Math.abs(k.accidentals) <= 4);
  return () => {
    const k = sample(keys);
    return {
      prompt: `写出 ${k.major} 大调的调号`,
      answerMode: "key-write",
      writeClef: "treble",
      keyAccidentalType: k.accidentals > 0 ? "sharp" : "flat",
      keyAccidentalCount: Math.abs(k.accidentals),
    };
  };
}

// 重点回顾：在多个生成器中随机抽取
function genMix(gens: QuestionGen[]): QuestionGen {
  return () => sample(gens)();
}

/* ----------------------------- 概念题库（乐器 / 乐派） ----------------------------- */

interface ConceptQ {
  prompt: string;
  options: string[];
  answer: string;
}

const INSTRUMENT_QS: ConceptQ[] = [
  { prompt: "下列哪种乐器属于弓弦乐器？", options: ["小提琴", "长笛", "小号", "马林巴"], answer: "小提琴" },
  { prompt: "钢琴在乐器分类上属于？", options: ["击弦键盘乐器", "弓弦乐器", "木管乐器", "铜管乐器"], answer: "击弦键盘乐器" },
  { prompt: "下列哪种乐器属于铜管乐器？", options: ["小号", "单簧管", "大提琴", "竖琴"], answer: "小号" },
  { prompt: "长笛属于哪一类乐器？", options: ["木管乐器", "铜管乐器", "弓弦乐器", "打击乐器"], answer: "木管乐器" },
  { prompt: "下列哪种乐器属于拨弦乐器？", options: ["吉他", "圆号", "双簧管", "定音鼓"], answer: "吉他" },
  { prompt: "定音鼓属于？", options: ["打击乐器", "木管乐器", "键盘乐器", "弓弦乐器"], answer: "打击乐器" },
  { prompt: "下列哪种是中国传统弹拨乐器？", options: ["古筝", "二胡", "笛子", "唢呐"], answer: "古筝" },
  { prompt: "萨克斯管在管弦乐分类中通常归为？", options: ["木管乐器", "铜管乐器", "打击乐器", "键盘乐器"], answer: "木管乐器" },
];

const GENRE_QS: ConceptQ[] = [
  { prompt: "Swing（摇摆）律动是哪种风格的典型特征？", options: ["爵士", "电子舞曲", "国风", "古典"], answer: "爵士" },
  { prompt: "强调四四拍稳定底鼓、Build 与 Drop 结构的是？", options: ["电子舞曲", "爵士", "RnB", "国风"], answer: "电子舞曲" },
  { prompt: "五声调式与留白意境常见于哪种风格？", options: ["国风", "爵士", "电子舞曲", "RnB"], answer: "国风" },
  { prompt: "强调 Groove、反拍与绵密七和弦的是？", options: ["RnB", "古典", "国风", "进行曲"], answer: "RnB" },
  { prompt: "251 和弦进行最常被讨论于哪种风格？", options: ["爵士", "电子舞曲", "国风", "民谣"], answer: "爵士" },
  { prompt: "为画面情绪与叙事服务、强调主题动机的是？", options: ["影视配乐", "舞曲", "爵士", "国风"], answer: "影视配乐" },
  { prompt: "下列哪种风格常用合成器音色与侧链压缩？", options: ["电子舞曲", "古典弦乐四重奏", "无伴奏合唱", "国风丝竹"], answer: "电子舞曲" },
];

function genConcept(pool: ConceptQ[]): QuestionGen {
  return () => {
    const q = sample(pool);
    return {
      prompt: q.prompt,
      options: shuffle(q.options),
      answer: q.answer,
    };
  };
}

/* ----------------------------- 节奏概念 ----------------------------- */

const RHYTHM_QS: ConceptQ[] = [
  { prompt: "4/4 拍的每个小节有几个四分音符的时值？", options: ["4", "3", "2", "6"], answer: "4" },
  { prompt: "3/4 拍每小节相当于几拍（以四分音符为一拍）？", options: ["3", "4", "2", "6"], answer: "3" },
  { prompt: "一个二分音符等于几个四分音符？", options: ["2", "4", "1", "3"], answer: "2" },
  { prompt: "附点四分音符等于几个八分音符的时值？", options: ["3", "2", "4", "1"], answer: "3" },
  { prompt: "全音符在 4/4 拍中占几拍？", options: ["4", "2", "1", "3"], answer: "4" },
  { prompt: "把一拍均分为三等份的节奏型叫？", options: ["三连音", "切分音", "附点", "休止符"], answer: "三连音" },
  { prompt: "重音落在弱拍上制造律动张力的手法叫？", options: ["切分", "渐强", "连奏", "转调"], answer: "切分" },
  { prompt: "一个八分音符等于几个十六分音符？", options: ["2", "4", "1", "3"], answer: "2" },
];

/* ----------------------------- 分类与关卡 ----------------------------- */

export const EXERCISE_CATEGORIES: ExCategory[] = [
  {
    id: "notes",
    title: "音",
    desc: "识读五线谱上的音，并在键盘上找到它们。",
    levels: [
      { id: "notes-treble", title: "高音谱号识音", total: 8, gen: genNoteOnStaff("treble") },
      { id: "notes-bass", title: "低音谱号识音", total: 8, gen: genNoteOnStaff("bass") },
      { id: "notes-alto", title: "中音谱号识音", total: 6, gen: genNoteOnStaff("alto") },
      { id: "notes-tenor", title: "次中音谱号识音", total: 6, gen: genNoteOnStaff("tenor") },
      { id: "notes-accidental", title: "变音记号", total: 6, gen: genAccidental("treble") },
      { id: "notes-ledger", title: "附加线", total: 6, gen: genLedger("treble") },
      { id: "notes-piano-treble", title: "钢琴作答（高音谱号）", total: 6, gen: genNotePianoKey("treble") },
      { id: "notes-piano-bass", title: "钢琴作答（低音谱号）", total: 6, gen: genNotePianoKey("bass") },
      { id: "notes-write-treble", title: "记谱书写（高音谱号）", total: 6, gen: genNoteWrite("treble") },
      { id: "notes-write-bass", title: "记谱书写（低音谱号）", total: 6, gen: genNoteWrite("bass") },
      { id: "notes-ear", title: "听辨音高高低", total: 6, gen: genHigherLower() },
      {
        id: "notes-review",
        title: "重点回顾",
        total: 8,
        gen: genMix([genNoteOnStaff("treble"), genNoteOnStaff("bass"), genAccidental("treble"), genLedger("treble")]),
      },
    ],
  },
  {
    id: "rhythm",
    title: "节奏",
    desc: "读谱、打拍并理解拍号与时值。",
    levels: [
      { id: "rhythm-basic", title: "拍子与时值", total: 8, gen: genConcept(RHYTHM_QS) },
      { id: "rhythm-identify", title: "节奏读谱", total: 6, gen: genRhythmIdentify() },
      { id: "rhythm-tap", title: "节奏打拍", total: 5, gen: genRhythmTap() },
      {
        id: "rhythm-review",
        title: "重点回顾",
        total: 8,
        gen: genMix([genConcept(RHYTHM_QS), genRhythmIdentify()]),
      },
    ],
  },
  {
    id: "intervals",
    title: "音程",
    desc: "识读、构建与听辨两个音之间的距离。",
    levels: [
      { id: "intervals-staff", title: "看谱识音程", total: 8, gen: genIntervalOnStaff() },
      { id: "intervals-build", title: "钢琴构建音程", total: 6, gen: genIntervalBuild() },
      { id: "intervals-ear", title: "听辨音程", total: 6, gen: genIntervalEar() },
      {
        id: "intervals-review",
        title: "重点回顾",
        total: 8,
        gen: genMix([genIntervalOnStaff(), genIntervalEar(), genIntervalBuild()]),
      },
    ],
  },
  {
    id: "chords",
    title: "和弦",
    desc: "识别、构建并听辨三和弦与七和弦。",
    levels: [
      { id: "chords-triad-staff", title: "看谱识三和弦", total: 8, gen: genTriadOnStaff() },
      { id: "chords-triad-build", title: "钢琴构建三和弦", total: 6, gen: genChordBuild() },
      { id: "chords-triad-ear", title: "听辨大小三和弦", total: 6, gen: genTriadEar() },
      { id: "chords-seventh-ear", title: "听辨七和弦", total: 6, gen: genSeventhEar() },
      {
        id: "chords-review",
        title: "重点回顾",
        total: 8,
        gen: genMix([genTriadOnStaff(), genTriadEar(), genChordBuild(), genSeventhEar()]),
      },
    ],
  },
  {
    id: "scales",
    title: "音阶",
    desc: "识读、构建并听辨大小调与各类音阶。",
    levels: [
      { id: "scales-notation", title: "看谱识音阶", total: 6, gen: genScaleNotation() },
      { id: "scales-build", title: "钢琴构建音阶", total: 6, gen: genScaleBuild() },
      { id: "scales-major-minor", title: "听辨大调与小调", total: 6, gen: genScaleEar() },
      { id: "scales-type", title: "识别音阶类型", total: 6, gen: genScaleType() },
      {
        id: "scales-review",
        title: "重点回顾",
        total: 8,
        gen: genMix([genScaleNotation(), genScaleEar(), genScaleBuild()]),
      },
    ],
  },
  {
    id: "keys",
    title: "调号",
    desc: "根据调号判断调，并掌握升降号顺序。",
    levels: [
      { id: "keys-identify", title: "看调号识调", total: 8, gen: genKeyFromSignature() },
      { id: "keys-write", title: "书写调号", total: 6, gen: genKeyWrite() },
      { id: "keys-sharp-order", title: "升号顺序", total: 6, gen: genSharpOrder() },
      { id: "keys-flat-order", title: "降号顺序", total: 6, gen: genFlatOrder() },
      {
        id: "keys-review",
        title: "重点回顾",
        total: 8,
        gen: genMix([genKeyFromSignature(), genSharpOrder(), genFlatOrder(), genKeyWrite()]),
      },
    ],
  },
  {
    id: "instruments",
    title: "乐器",
    desc: "认识乐器的分类与归属。",
    levels: [{ id: "instruments-family", title: "乐器分类", total: 8, gen: genConcept(INSTRUMENT_QS) }],
  },
  {
    id: "genres",
    title: "乐派",
    desc: "辨识各种音乐风格的典型特征。",
    levels: [{ id: "genres-feature", title: "风格特征", total: 7, gen: genConcept(GENRE_QS) }],
  },
];

export function categoryById(id: string): ExCategory | undefined {
  return EXERCISE_CATEGORIES.find((c) => c.id === id);
}

export function levelById(levelId: string): { category: ExCategory; level: Level } | undefined {
  for (const c of EXERCISE_CATEGORIES) {
    const l = c.levels.find((x) => x.id === levelId);
    if (l) return { category: c, level: l };
  }
  return undefined;
}

/** 取某分类下全部关卡 id（用于进度统计） */
export function levelIdsOf(category: ExCategory): string[] {
  return category.levels.map((l) => l.id);
}
