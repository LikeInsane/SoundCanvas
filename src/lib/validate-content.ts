/**
 * 校验 ProjectContent 结构：必填字段、bars 范围等，用于 API 保存
 */

function isObject(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

function isArray(v: unknown): v is unknown[] {
  return Array.isArray(v);
}

export function validateProjectContent(parsed: unknown): string | null {
  if (!isObject(parsed)) return "content 解析后必须是对象";

  if (typeof parsed.bpm !== "number" || parsed.bpm < 40 || parsed.bpm > 240) {
    return "bpm 必须为 40～240 之间的数字";
  }

  if (!isArray(parsed.timeSignature) || parsed.timeSignature.length !== 2) {
    return "timeSignature 必须为 [数字, 数字]";
  }
  const [num, den] = parsed.timeSignature;
  if (typeof num !== "number" || typeof den !== "number" || num < 1 || den < 1) {
    return "timeSignature 必须为有效拍号";
  }

  if (typeof parsed.bars !== "number" || parsed.bars < 1 || parsed.bars > 32) {
    return "bars 必须为 1～32 之间的整数";
  }

  if (!isObject(parsed.rhythm) || !isArray(parsed.rhythm.pattern)) {
    return "rhythm.pattern 必须存在且为数组";
  }
  const pattern = parsed.rhythm.pattern;
  const totalBeats = parsed.bars * (parsed.timeSignature[0] as number);
  for (let i = 0; i < pattern.length; i++) {
    const p = pattern[i];
    if (!isObject(p) || typeof p.beat !== "number" || (p.type !== "kick" && p.type !== "snare")) {
      return "rhythm.pattern 每项须含 beat(数字) 与 type(kick/snare)";
    }
    if (p.beat < 0 || p.beat >= totalBeats) {
      return "rhythm.pattern 的 beat 超出小节范围";
    }
  }

  if (!isArray(parsed.chords)) return "chords 必须为数组";
  for (let i = 0; i < parsed.chords.length; i++) {
    const c = parsed.chords[i];
    if (!isObject(c) || typeof c.barIndex !== "number" || typeof c.chord !== "string") {
      return "chords 每项须含 barIndex(数字) 与 chord(字符串)";
    }
    if (c.barIndex < 0 || c.barIndex >= parsed.bars) {
      return "chords 的 barIndex 超出小节范围";
    }
  }

  if (!isArray(parsed.melody)) return "melody 必须为数组";
  const beatsPerBar = parsed.timeSignature[0] as number;
  for (let i = 0; i < parsed.melody.length; i++) {
    const m = parsed.melody[i];
    if (!isObject(m) || typeof m.barIndex !== "number" || typeof m.beat !== "number" || typeof m.note !== "string" || typeof m.duration !== "number") {
      return "melody 每项须含 barIndex、beat、note、duration";
    }
    if (m.barIndex < 0 || m.barIndex >= parsed.bars) {
      return "melody 的 barIndex 超出小节范围";
    }
    if (m.beat < 0 || m.beat >= beatsPerBar) {
      return "melody 的 beat 超出拍号范围";
    }
    if (m.duration <= 0) {
      return "melody 的 duration 必须大于 0";
    }
  }

  return null;
}
