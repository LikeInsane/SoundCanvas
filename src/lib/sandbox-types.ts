/**
 * 沙盒作品数据结构，与设计文档 4.3 一致
 */

/** 节奏轨事件：按 beat 索引（全局拍号，0 起），类型 kick/snare/hihat/clap */
export interface RhythmEvent {
  beat: number;
  type: "kick" | "snare" | "hihat" | "clap";
}

/** 节奏轨数据 */
export interface RhythmData {
  pattern: RhythmEvent[];
}

/** 和弦轨事件：按小节索引 */
export interface ChordEvent {
  barIndex: number;
  chord: string;
}

/** 旋律轨事件：barIndex + beat（小节内拍）+ 音高 + 时值（拍） */
export interface MelodyEvent {
  barIndex: number;
  beat: number;
  note: string;
  duration: number;
}

/** 作品完整 JSON 结构（Project.content） */
export interface ProjectContent {
  bpm: number;
  timeSignature: [number, number];
  bars: number;
  rhythm: RhythmData;
  chords: ChordEvent[];
  melody: MelodyEvent[];
}

/** 默认 4/4，8 小节，120 BPM */
export const DEFAULT_CONTENT: ProjectContent = {
  bpm: 120,
  timeSignature: [4, 4],
  bars: 8,
  rhythm: { pattern: [] },
  chords: [],
  melody: [],
};

/** 支持的小节数选项 */
export const BAR_OPTIONS = [4, 8, 16, 32] as const;

/** 第一版支持和弦名（自然大调） */
export const CHORD_OPTIONS = ["C", "Dm", "Em", "F", "G", "Am", "Bdim"] as const;

/** 节奏轨鼓类型（第二版扩展 hihat、clap） */
export const RHYTHM_TYPES = ["kick", "snare", "hihat", "clap"] as const;

/** 旋律可用音高（C4～C5） */
export const MELODY_NOTE_OPTIONS = [
  "C4", "D4", "E4", "F4", "G4", "A4", "B4",
  "C5", "D5", "E5", "F5", "G5", "A5", "B5",
] as const;
