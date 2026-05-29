"use client";

import { useEffect, useRef, useState } from "react";
import { Printer } from "lucide-react";
import { ToolHeader } from "@/components/tools/ToolHeader";

/**
 * 空白五线谱：用 VexFlow 渲染若干空白谱行，可选谱号并打印。
 */
export default function BlankStaffPage() {
  const [clef, setClef] = useState<"treble" | "bass">("treble");
  const [rows, setRows] = useState(8);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let cancelled = false;

    import("vexflow").then((VF) => {
      if (cancelled || !el) return;
      el.innerHTML = "";
      const { Renderer, Stave } = VF;
      const width = 720;
      const rowHeight = 80;
      const renderer = new Renderer(el, Renderer.Backends.SVG);
      renderer.resize(width, rows * rowHeight + 20);
      const context = renderer.getContext();

      for (let i = 0; i < rows; i++) {
        const stave = new Stave(10, 10 + i * rowHeight, width - 30);
        if (i === 0) stave.addClef(clef);
        stave.setContext(context);
        stave.setStyle({ strokeStyle: "#1a1a1a", fillStyle: "#1a1a1a" });
        stave.draw();
      }
      // 打印时谱线为深色，背景白
      el.querySelectorAll("svg").forEach((svg) => {
        (svg as SVGElement).style.background = "#ffffff";
      });
    });

    return () => {
      cancelled = true;
      if (el) el.innerHTML = "";
    };
  }, [clef, rows]);

  return (
    <div>
      <ToolHeader title="空白五线谱" desc="生成可打印的空白五线谱纸，用于手写练习。" />

      <div className="flex flex-wrap items-center gap-3 mb-6 print:hidden">
        <div className="flex gap-2">
          {(["treble", "bass"] as const).map((c) => (
            <button
              key={c}
              onClick={() => setClef(c)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                clef === c
                  ? "bg-brand-cta text-white"
                  : "bg-brand-card border border-brand-border text-brand-muted hover:text-brand-text"
              }`}
            >
              {c === "treble" ? "高音谱号" : "低音谱号"}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-brand-muted">行数</span>
          <input
            type="number"
            min={2}
            max={16}
            value={rows}
            onChange={(e) => setRows(Math.min(16, Math.max(2, Number(e.target.value))))}
            className="w-20 px-2 py-1 rounded-lg bg-brand-card border border-brand-border text-sm text-brand-text"
          />
        </div>
        <button onClick={() => window.print()} className="btn-secondary ml-auto">
          <Printer className="w-4 h-4 mr-1" /> 打印
        </button>
      </div>

      <div className="rounded-xl bg-white p-4 overflow-x-auto" ref={containerRef} />
    </div>
  );
}
