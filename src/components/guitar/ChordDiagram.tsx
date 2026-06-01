"use client";

/**
 * 和弦指法图：竖向显示 6 弦 × 若干品，圆点表示按弦，上方 x/o 表示闷音/空弦。
 * frets 按弦索引 [第1弦..第6弦]，显示时左侧为第6弦(低E)、右侧为第1弦(高E)。
 */

export interface ChordDiagramProps {
  frets: number[];
  /** 显示的品数 */
  fretRows?: number;
  width?: number;
  /** 弦数，缺省为 6（吉他）；尤克里里传 4 */
  stringCount?: number;
}

export function ChordDiagram({ frets, fretRows = 4, width = 84, stringCount = 6 }: ChordDiagramProps) {
  const padX = 12;
  const padTop = 18;
  const padBottom = 6;
  const w = width;
  const stringGap = (w - padX * 2) / (stringCount - 1);
  const fretGap = 16;
  const h = padTop + fretRows * fretGap + padBottom;

  // 显示顺序：列 0 = 第6弦(低E)，列 5 = 第1弦(高E)
  const colToStringIndex = (col: number) => stringCount - 1 - col;

  const xOf = (col: number) => padX + col * stringGap;
  const yOfFret = (fret: number) => padTop + (fret - 0.5) * fretGap;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      {/* 弦（竖线） */}
      {Array.from({ length: stringCount }).map((_, col) => (
        <line
          key={`s${col}`}
          x1={xOf(col)}
          y1={padTop}
          x2={xOf(col)}
          y2={padTop + fretRows * fretGap}
          stroke="#8E8EA0"
          strokeWidth={0.8}
        />
      ))}
      {/* 品（横线），第一条为粗琴枕 */}
      {Array.from({ length: fretRows + 1 }).map((_, r) => (
        <line
          key={`f${r}`}
          x1={padX}
          y1={padTop + r * fretGap}
          x2={padX + (stringCount - 1) * stringGap}
          y2={padTop + r * fretGap}
          stroke="#8E8EA0"
          strokeWidth={r === 0 ? 2.5 : 0.8}
        />
      ))}

      {/* 每弦的 x/o 与按点 */}
      {Array.from({ length: stringCount }).map((_, col) => {
        const si = colToStringIndex(col);
        const fret = frets[si];
        const x = xOf(col);
        if (fret < 0) {
          return (
            <text key={`m${col}`} x={x} y={padTop - 6} textAnchor="middle" fontSize={9} fill="#8E8EA0">
              x
            </text>
          );
        }
        if (fret === 0) {
          return (
            <circle key={`o${col}`} cx={x} cy={padTop - 9} r={3} fill="none" stroke="#8E8EA0" strokeWidth={1} />
          );
        }
        return (
          <circle key={`d${col}`} cx={x} cy={yOfFret(fret)} r={4.5} fill="#0071E3" />
        );
      })}
    </svg>
  );
}
