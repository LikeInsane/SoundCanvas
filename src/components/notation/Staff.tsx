"use client";

/**
 * 五线谱渲染组件：封装 VexFlow，支持渲染单音、音程、和弦、音阶等。
 * 每个 StaffNote 可包含多个 key（同时发声即和弦/音程）。
 */

import { useEffect, useRef } from "react";
import { midiToVexKey } from "@/lib/music-theory";
import type { RhythmCell } from "@/lib/music-theory";

export interface StaffNote {
  /** VexFlow key 数组，如 ["c/4", "e/4", "g/4"] */
  keys: string[];
  /** 时值，如 "q"(四分) "h"(二分) "w"(全) */
  duration?: string;
}

export interface StaffProps {
  /** 直接给 VexFlow 音符 */
  notes?: StaffNote[];
  /** 或给一组 MIDI（每个 MIDI 渲染为一个音；若为二维数组则每组为一个和弦） */
  midiNotes?: number[] | number[][];
  /** 或给一组节奏单元（单线节奏谱，忽略音高） */
  rhythm?: RhythmCell[];
  clef?: "treble" | "bass" | "alto" | "tenor";
  keySignature?: string;
  timeSignature?: string;
  preferFlat?: boolean;
  width?: number;
  height?: number;
  className?: string;
}

export function Staff({
  notes,
  midiNotes,
  rhythm,
  clef = "treble",
  keySignature,
  timeSignature,
  preferFlat = false,
  width = 320,
  height = 140,
  className = "",
}: StaffProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let cancelled = false;

    // VexFlow 仅在浏览器端动态加载，避免 SSR 报错
    import("vexflow").then((VF) => {
      if (cancelled || !el) return;
      el.innerHTML = "";

      const { Renderer, Stave, StaveNote, Voice, Formatter, Accidental, Beam } = VF;
      const renderer = new Renderer(el, Renderer.Backends.SVG);
      renderer.resize(width, height);
      const context = renderer.getContext();
      context.setFillStyle("#F5F5F7");
      context.setStrokeStyle("#F5F5F7");

      const stave = new Stave(8, 12, width - 20);
      stave.addClef(clef);
      if (keySignature) stave.addKeySignature(keySignature);
      if (timeSignature) stave.addTimeSignature(timeSignature);
      stave.setContext(context);
      // 谱线着色为浅色以适配深色背景
      stave.setStyle({ strokeStyle: "#9999AA", fillStyle: "#9999AA" });
      stave.draw();

      // 节奏模式：单线渲染时值与休止符
      if (rhythm && rhythm.length > 0) {
        const rhythmNotes = rhythm.map((cell) => {
          const duration = cell.rest ? `${cell.dur}r` : cell.dur;
          const note = new StaveNote({ keys: ["b/4"], duration, clef: "treble" });
          note.setStyle({ fillStyle: "#F5F5F7", strokeStyle: "#F5F5F7" });
          return note;
        });
        const voice = new Voice({ num_beats: 4, beat_value: 4 });
        voice.setStrict(false);
        voice.addTickables(rhythmNotes);
        new Formatter().joinVoices([voice]).format([voice], width - 80);
        const beams = Beam.generateBeams(rhythmNotes);
        voice.draw(context, stave);
        beams.forEach((b) => {
          b.setContext(context).draw();
        });
        return;
      }

      // 计算待渲染音符
      let staffNotes: StaffNote[] = [];
      if (notes && notes.length > 0) {
        staffNotes = notes;
      } else if (midiNotes && midiNotes.length > 0) {
        if (Array.isArray(midiNotes[0])) {
          staffNotes = (midiNotes as number[][]).map((group) => ({
            keys: group.map((m) => midiToVexKey(m, preferFlat)),
            duration: "q",
          }));
        } else {
          staffNotes = (midiNotes as number[]).map((m) => ({
            keys: [midiToVexKey(m, preferFlat)],
            duration: "q",
          }));
        }
      }

      if (staffNotes.length === 0) return;

      const vexNotes = staffNotes.map((n) => {
        const note = new StaveNote({
          keys: n.keys,
          duration: n.duration || "q",
          clef,
        });
        note.setStyle({ fillStyle: "#F5F5F7", strokeStyle: "#F5F5F7" });
        // 为带升降号的 key 自动添加变音记号
        n.keys.forEach((k, idx) => {
          if (k.includes("#")) note.addModifier(new Accidental("#"), idx);
          else if (k.includes("b")) note.addModifier(new Accidental("b"), idx);
        });
        return note;
      });

      const voice = new Voice({ num_beats: vexNotes.length, beat_value: 4 });
      voice.setStrict(false);
      voice.addTickables(vexNotes);
      new Formatter().joinVoices([voice]).format([voice], width - 80);
      voice.draw(context, stave);
    });

    return () => {
      cancelled = true;
      if (el) el.innerHTML = "";
    };
  }, [notes, midiNotes, rhythm, clef, keySignature, timeSignature, preferFlat, width, height]);

  return <div ref={containerRef} className={className} aria-hidden="true" />;
}
