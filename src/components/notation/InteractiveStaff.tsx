"use client";

/**
 * 交互式五线谱：SVG 自绘，支持两种用途。
 * - note 模式：点击谱面纵向槽位放置一个符头，回传所选自然音（字母+八度）。
 * - key 模式：在标准位置渲染给定的调号升/降记号（由父组件控制增减）。
 * 仅支持高音谱号与低音谱号（书写练习常用）。
 */

const LETTERS = ["C", "D", "E", "F", "G", "A", "B"];

/** 音名转全音级序号（C0=0，每个自然音 +1） */
function noteToDiatonic(note: string): number {
  const m = note.match(/^([A-G])(-?\d+)$/);
  if (!m) return 0;
  const letterIndex = LETTERS.indexOf(m[1]);
  const octave = parseInt(m[2], 10);
  return letterIndex + 7 * octave;
}

/** 全音级序号转自然音名 */
function diatonicToNote(di: number): string {
  const letterIndex = ((di % 7) + 7) % 7;
  const octave = Math.floor(di / 7);
  return `${LETTERS[letterIndex]}${octave}`;
}

// 各谱号最低谱线对应音（高音谱号 E4，低音谱号 G2）
const BOTTOM_LINE: Record<"treble" | "bass", string> = { treble: "E4", bass: "G2" };

// 调号标准位置（自上而下书写顺序）
const KEY_SIG_POSITIONS: Record<"treble" | "bass", { sharp: string[]; flat: string[] }> = {
  treble: {
    sharp: ["F5", "C5", "G5", "D5", "A4", "E5", "B4"],
    flat: ["B4", "E5", "A4", "D5", "G4", "C5", "F4"],
  },
  bass: {
    sharp: ["F3", "C3", "G3", "D3", "A2", "E3", "B2"],
    flat: ["B2", "E3", "A2", "D3", "G2", "C3", "F2"],
  },
};

export function keySignaturePositions(clef: "treble" | "bass", type: "sharp" | "flat"): string[] {
  return KEY_SIG_POSITIONS[clef][type];
}

export interface InteractiveStaffProps {
  clef: "treble" | "bass";
  mode: "note" | "key";
  /** note 模式：当前已放置的音（含变音记号，如 "F#4"） */
  selectedNote?: string | null;
  /** key 模式：已放置的调号记号 */
  accidentals?: Array<{ note: string; type: "sharp" | "flat" }>;
  onPick?: (note: string) => void;
  width?: number;
}

export function InteractiveStaff({
  clef,
  mode,
  selectedNote,
  accidentals = [],
  onPick,
  width = 280,
}: InteractiveStaffProps) {
  const lineGap = 12;
  const staffTopY = 46;
  const bottomLineY = staffTopY + 4 * lineGap; // 最低谱线
  const height = 150;
  const refDi = noteToDiatonic(BOTTOM_LINE[clef]);
  const noteX = width - 70;

  const yOf = (di: number) => bottomLineY - (di - refDi) * (lineGap / 2);

  // 可点击槽位范围：谱表上下各扩展约 3 个全音级（含附加线区域）
  const slots: number[] = [];
  for (let di = refDi - 5; di <= refDi + 13; di++) slots.push(di);

  // 选中音（去掉变音记号求其纵向位置）
  const selNatural = selectedNote ? selectedNote.replace(/[#b]/, "") : null;
  const selDi = selNatural ? noteToDiatonic(selNatural) : null;
  const selAccidental = selectedNote?.includes("#") ? "#" : selectedNote?.includes("b") ? "b" : "";

  // 附加线：当音高于最高线或低于最低线时绘制
  const ledgerLines: number[] = [];
  if (selDi !== null) {
    const topLineDi = refDi + 8;
    if (selDi > topLineDi) {
      for (let d = topLineDi + 2; d <= selDi; d += 2) ledgerLines.push(d);
    } else if (selDi < refDi) {
      for (let d = refDi - 2; d >= selDi; d -= 2) ledgerLines.push(d);
    }
  }

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* 五条谱线 */}
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={i}
          x1={10}
          y1={staffTopY + i * lineGap}
          x2={width - 10}
          y2={staffTopY + i * lineGap}
          stroke="#9999AA"
          strokeWidth={1}
        />
      ))}

      {/* 谱号 */}
      <text x={16} y={bottomLineY - 4} fontSize={clef === "treble" ? 52 : 40} fill="#F5F5F7">
        {clef === "treble" ? "\uD834\uDD1E" : "\uD834\uDD22"}
      </text>

      {/* note 模式：可点击槽位 */}
      {mode === "note" &&
        slots.map((di) => (
          <rect
            key={di}
            x={noteX - 24}
            y={yOf(di) - lineGap / 4}
            width={48}
            height={lineGap / 2}
            fill="transparent"
            className="cursor-pointer hover:fill-white/10"
            onClick={() => onPick?.(diatonicToNote(di))}
          />
        ))}

      {/* note 模式：附加线与符头 */}
      {mode === "note" && selDi !== null && (
        <>
          {ledgerLines.map((d) => (
            <line key={d} x1={noteX - 12} y1={yOf(d)} x2={noteX + 12} y2={yOf(d)} stroke="#9999AA" strokeWidth={1} />
          ))}
          {selAccidental && (
            <text x={noteX - 22} y={yOf(selDi) + 5} fontSize={18} fill="#0071E3">
              {selAccidental === "#" ? "\u266F" : "\u266D"}
            </text>
          )}
          <ellipse cx={noteX} cy={yOf(selDi)} rx={7} ry={5} fill="#0071E3" transform={`rotate(-20 ${noteX} ${yOf(selDi)})`} />
        </>
      )}

      {/* key 模式：在标准位置渲染调号记号 */}
      {mode === "key" &&
        accidentals.map((acc, i) => {
          const di = noteToDiatonic(acc.note);
          return (
            <text key={i} x={56 + i * 12} y={yOf(di) + 6} fontSize={20} fill="#0071E3">
              {acc.type === "sharp" ? "\u266F" : "\u266D"}
            </text>
          );
        })}
    </svg>
  );
}
