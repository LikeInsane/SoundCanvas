"use client";

import { useState } from "react";
import { ToolHeader } from "@/components/tools/ToolHeader";
import {
  CIRCLE_OF_FIFTHS,
  SHARP_ORDER,
  FLAT_ORDER,
  buildChord,
  noteToMidi,
} from "@/lib/music-theory";
import { playChordMidi } from "@/lib/instrument-audio";

/**
 * 五度圈：环形展示十二个调，外圈大调、内圈关系小调，点击可聆听主和弦并查看调号。
 */
export default function CircleOfFifthsPage() {
  const [selected, setSelected] = useState(0);

  const size = 360;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = 150;
  const innerR = 100;
  const labelOuterR = 168;
  const labelInnerR = 78;

  const key = CIRCLE_OF_FIFTHS[selected];

  // 调号文字描述
  let sigText = "无升降号";
  if (key.accidentals > 0) {
    sigText = `${key.accidentals} 个升号：${SHARP_ORDER.slice(0, key.accidentals).map((n) => n + "#").join(" ")}`;
  } else if (key.accidentals < 0) {
    const n = Math.abs(key.accidentals);
    sigText = `${n} 个降号：${FLAT_ORDER.slice(0, n).map((x) => x + "b").join(" ")}`;
  }

  const playTonic = (majorRoot: string) => {
    // 取大调主和弦
    const rootName = majorRoot.replace("m", "");
    const midi = noteToMidi(`${rootName}4`);
    playChordMidi(buildChord(midi, majorRoot.endsWith("m") ? "minor" : "major"));
  };

  return (
    <div>
      <ToolHeader title="五度圈" desc="环形理解各调的调号与亲缘关系，点击聆听主和弦。" />

      <div className="glass-card p-8 flex flex-col lg:flex-row items-center gap-10">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
          {/* 外圈与内圈 */}
          <circle cx={cx} cy={cy} r={outerR} fill="none" stroke="#1E1E35" strokeWidth={1} />
          <circle cx={cx} cy={cy} r={innerR} fill="none" stroke="#1E1E35" strokeWidth={1} />

          {CIRCLE_OF_FIFTHS.map((k, i) => {
            // 12 点钟为 C，顺时针每格 30 度
            const angle = (i * 30 - 90) * (Math.PI / 180);
            const isSel = i === selected;

            const ox = cx + labelOuterR * Math.cos(angle);
            const oy = cy + labelOuterR * Math.sin(angle);
            const ix = cx + labelInnerR * Math.cos(angle);
            const iy = cy + labelInnerR * Math.sin(angle);

            // 扇形分隔线
            const lx1 = cx + innerR * Math.cos(angle + Math.PI / 12);
            const ly1 = cy + innerR * Math.sin(angle + Math.PI / 12);
            const lx2 = cx + outerR * Math.cos(angle + Math.PI / 12);
            const ly2 = cy + outerR * Math.sin(angle + Math.PI / 12);

            return (
              <g key={k.major}>
                <line x1={lx1} y1={ly1} x2={lx2} y2={ly2} stroke="#1E1E35" strokeWidth={1} />
                {/* 外圈大调可点击区域 */}
                <circle
                  cx={ox}
                  cy={oy}
                  r={18}
                  className="cursor-pointer"
                  fill={isSel ? "#0071E3" : "#161625"}
                  stroke={isSel ? "#0071E3" : "#1E1E35"}
                  onClick={() => {
                    setSelected(i);
                    playTonic(k.major);
                  }}
                />
                <text
                  x={ox}
                  y={oy + 4}
                  textAnchor="middle"
                  className="cursor-pointer select-none"
                  fontSize={13}
                  fontWeight={600}
                  fill={isSel ? "#fff" : "#F5F5F7"}
                  onClick={() => {
                    setSelected(i);
                    playTonic(k.major);
                  }}
                >
                  {k.major}
                </text>
                {/* 内圈小调 */}
                <text
                  x={ix}
                  y={iy + 4}
                  textAnchor="middle"
                  className="cursor-pointer select-none"
                  fontSize={11}
                  fill={isSel ? "#5B50E6" : "#8E8EA0"}
                  onClick={() => {
                    setSelected(i);
                    playTonic(k.minor);
                  }}
                >
                  {k.minor}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="flex-1">
          <div className="text-3xl font-bold text-brand-heading">{key.major} 大调</div>
          <div className="text-sm text-brand-muted mt-1">关系小调：{key.minor}</div>

          <div className="mt-6 space-y-3 text-sm">
            <div className="rounded-xl bg-brand-card border border-brand-border p-4">
              <div className="text-xs text-brand-muted">调号</div>
              <div className="text-brand-text mt-1">{sigText}</div>
            </div>
            <div className="rounded-xl bg-brand-card border border-brand-border p-4">
              <div className="text-xs text-brand-muted">相邻调（属/下属）</div>
              <div className="text-brand-text mt-1">
                {CIRCLE_OF_FIFTHS[(selected + 1) % 12].major}（属方向） ·{" "}
                {CIRCLE_OF_FIFTHS[(selected + 11) % 12].major}（下属方向）
              </div>
            </div>
          </div>

          <p className="text-xs text-brand-muted mt-4 leading-relaxed">
            顺时针每走一步增加一个升号，逆时针每走一步增加一个降号。相邻的调共享大量音级，转调时听感最自然。
          </p>
        </div>
      </div>
    </div>
  );
}
