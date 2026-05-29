/**
 * 沙盒预设内容：学习页与风格页「在沙盒中练习」使用的 ProjectContent
 */

import type { ProjectContent } from "./sandbox-types";

const presets: Record<string, ProjectContent> = {
  /** 和弦 1645 四小节循环（C-Am-F-G） */
  "chords-1645": {
    bpm: 120,
    timeSignature: [4, 4],
    bars: 4,
    rhythm: { pattern: [] },
    chords: [
      { barIndex: 0, chord: "C" },
      { barIndex: 1, chord: "Am" },
      { barIndex: 2, chord: "F" },
      { barIndex: 3, chord: "G" },
    ],
    melody: [],
  },

  /** 基础 4/4 鼓点：强拍 kick，弱拍 snare */
  "rhythm-basic": {
    bpm: 120,
    timeSignature: [4, 4],
    bars: 4,
    rhythm: {
      pattern: [
        { beat: 0, type: "kick" },
        { beat: 1, type: "snare" },
        { beat: 2, type: "kick" },
        { beat: 3, type: "snare" },
        { beat: 4, type: "kick" },
        { beat: 5, type: "snare" },
        { beat: 6, type: "kick" },
        { beat: 7, type: "snare" },
        { beat: 8, type: "kick" },
        { beat: 9, type: "snare" },
        { beat: 10, type: "kick" },
        { beat: 11, type: "snare" },
        { beat: 12, type: "kick" },
        { beat: 13, type: "snare" },
        { beat: 14, type: "kick" },
        { beat: 15, type: "snare" },
      ],
    },
    chords: [],
    melody: [],
  },

  /** 旋律练习：简单 C 大调乐句 */
  "melody-simple": {
    bpm: 120,
    timeSignature: [4, 4],
    bars: 4,
    rhythm: { pattern: [] },
    chords: [
      { barIndex: 0, chord: "C" },
      { barIndex: 1, chord: "Am" },
      { barIndex: 2, chord: "F" },
      { barIndex: 3, chord: "G" },
    ],
    melody: [
      { barIndex: 0, beat: 0, note: "C4", duration: 0.5 },
      { barIndex: 0, beat: 1, note: "E4", duration: 0.5 },
      { barIndex: 0, beat: 2, note: "G4", duration: 1 },
      { barIndex: 1, beat: 0, note: "A4", duration: 0.5 },
      { barIndex: 1, beat: 1, note: "G4", duration: 0.5 },
      { barIndex: 1, beat: 2, note: "E4", duration: 1 },
    ],
  },

  /** 国风风格预设：五声感节奏 + 简单和弦 */
  "style-guofeng": {
    bpm: 90,
    timeSignature: [4, 4],
    bars: 8,
    rhythm: {
      pattern: [
        { beat: 0, type: "kick" },
        { beat: 2, type: "snare" },
        { beat: 4, type: "kick" },
        { beat: 6, type: "snare" },
        { beat: 8, type: "kick" },
        { beat: 10, type: "snare" },
        { beat: 12, type: "kick" },
        { beat: 14, type: "snare" },
      ],
    },
    chords: [
      { barIndex: 0, chord: "C" },
      { barIndex: 1, chord: "Am" },
      { barIndex: 2, chord: "F" },
      { barIndex: 3, chord: "G" },
      { barIndex: 4, chord: "C" },
      { barIndex: 5, chord: "Am" },
      { barIndex: 6, chord: "F" },
      { barIndex: 7, chord: "G" },
    ],
    melody: [],
  },

  /** 爵士风格预设：摇摆感节奏 */
  "style-jazz": {
    bpm: 120,
    timeSignature: [4, 4],
    bars: 8,
    rhythm: {
      pattern: [
        { beat: 0, type: "kick" },
        { beat: 1, type: "hihat" },
        { beat: 2, type: "snare" },
        { beat: 3, type: "hihat" },
        { beat: 4, type: "kick" },
        { beat: 5, type: "hihat" },
        { beat: 6, type: "snare" },
        { beat: 7, type: "hihat" },
        { beat: 8, type: "kick" },
        { beat: 9, type: "hihat" },
        { beat: 10, type: "snare" },
        { beat: 11, type: "hihat" },
        { beat: 12, type: "kick" },
        { beat: 13, type: "hihat" },
        { beat: 14, type: "snare" },
        { beat: 15, type: "hihat" },
      ],
    },
    chords: [
      { barIndex: 0, chord: "C" },
      { barIndex: 1, chord: "Am" },
      { barIndex: 2, chord: "Dm" },
      { barIndex: 3, chord: "G" },
      { barIndex: 4, chord: "C" },
      { barIndex: 5, chord: "Em" },
      { barIndex: 6, chord: "F" },
      { barIndex: 7, chord: "G" },
    ],
    melody: [],
  },

  /** RnB 风格预设 */
  "style-rnb": {
    bpm: 85,
    timeSignature: [4, 4],
    bars: 8,
    rhythm: {
      pattern: [
        { beat: 0, type: "kick" },
        { beat: 2, type: "snare" },
        { beat: 4, type: "kick" },
        { beat: 6, type: "clap" },
        { beat: 8, type: "kick" },
        { beat: 10, type: "snare" },
        { beat: 12, type: "kick" },
        { beat: 14, type: "clap" },
      ],
    },
    chords: [
      { barIndex: 0, chord: "C" },
      { barIndex: 1, chord: "Am" },
      { barIndex: 2, chord: "F" },
      { barIndex: 3, chord: "G" },
      { barIndex: 4, chord: "C" },
      { barIndex: 5, chord: "Am" },
      { barIndex: 6, chord: "F" },
      { barIndex: 7, chord: "G" },
    ],
    melody: [],
  },

  /** 日系风格预设 */
  "style-japanese": {
    bpm: 110,
    timeSignature: [4, 4],
    bars: 8,
    rhythm: {
      pattern: [
        { beat: 0, type: "kick" },
        { beat: 1, type: "hihat" },
        { beat: 2, type: "snare" },
        { beat: 3, type: "hihat" },
        { beat: 4, type: "kick" },
        { beat: 5, type: "hihat" },
        { beat: 6, type: "snare" },
        { beat: 7, type: "hihat" },
        { beat: 8, type: "kick" },
        { beat: 9, type: "hihat" },
        { beat: 10, type: "snare" },
        { beat: 11, type: "hihat" },
        { beat: 12, type: "kick" },
        { beat: 13, type: "hihat" },
        { beat: 14, type: "snare" },
        { beat: 15, type: "hihat" },
      ],
    },
    chords: [
      { barIndex: 0, chord: "C" },
      { barIndex: 1, chord: "G" },
      { barIndex: 2, chord: "Am" },
      { barIndex: 3, chord: "Em" },
      { barIndex: 4, chord: "F" },
      { barIndex: 5, chord: "C" },
      { barIndex: 6, chord: "Dm" },
      { barIndex: 7, chord: "G" },
    ],
    melody: [],
  },

  /** 电子风格预设 */
  "style-electronic": {
    bpm: 128,
    timeSignature: [4, 4],
    bars: 8,
    rhythm: {
      pattern: [
        { beat: 0, type: "kick" },
        { beat: 1, type: "hihat" },
        { beat: 2, type: "kick" },
        { beat: 3, type: "hihat" },
        { beat: 4, type: "kick" },
        { beat: 5, type: "hihat" },
        { beat: 6, type: "kick" },
        { beat: 7, type: "hihat" },
        { beat: 8, type: "kick" },
        { beat: 9, type: "hihat" },
        { beat: 10, type: "snare" },
        { beat: 11, type: "hihat" },
        { beat: 12, type: "kick" },
        { beat: 13, type: "hihat" },
        { beat: 14, type: "kick" },
        { beat: 15, type: "hihat" },
      ],
    },
    chords: [
      { barIndex: 0, chord: "Am" },
      { barIndex: 1, chord: "Am" },
      { barIndex: 2, chord: "F" },
      { barIndex: 3, chord: "G" },
      { barIndex: 4, chord: "Am" },
      { barIndex: 5, chord: "Am" },
      { barIndex: 6, chord: "F" },
      { barIndex: 7, chord: "G" },
    ],
    melody: [],
  },

  /** 配乐风格预设 */
  "style-scoring": {
    bpm: 72,
    timeSignature: [4, 4],
    bars: 8,
    rhythm: {
      pattern: [
        { beat: 0, type: "kick" },
        { beat: 4, type: "kick" },
        { beat: 8, type: "kick" },
        { beat: 12, type: "kick" },
      ],
    },
    chords: [
      { barIndex: 0, chord: "C" },
      { barIndex: 2, chord: "Am" },
      { barIndex: 4, chord: "F" },
      { barIndex: 6, chord: "G" },
    ],
    melody: [],
  },
};

/**
 * 根据预设 ID 返回深拷贝的 ProjectContent，未知 ID 返回 null
 */
export function getPresetContent(presetId: string): ProjectContent | null {
  const preset = presets[presetId];
  if (!preset) return null;
  return JSON.parse(JSON.stringify(preset)) as ProjectContent;
}

/** 所有预设 ID 列表（用于入口选择） */
export const PRESET_IDS = Object.keys(presets) as string[];
