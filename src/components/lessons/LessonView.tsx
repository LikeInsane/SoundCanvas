"use client";

import Link from "next/link";
import { Play, Lightbulb, ArrowRight } from "lucide-react";
import { Staff } from "@/components/notation/Staff";
import type { Lesson, LessonBlock } from "@/lib/lessons-data";
import { noteToMidi } from "@/lib/music-theory";
import { playChordMidi, playSequenceMidi } from "@/lib/instrument-audio";

/**
 * 课程渲染：按区块类型渲染文字、五线谱、试听按钮、提示与跳转链接。
 */
function BlockView({ block }: { block: LessonBlock }) {
  if (block.type === "text") {
    return (
      <div className="text-brand-text text-sm leading-relaxed">
        {block.title && (
          <strong className="text-brand-heading block mb-1">{block.title}</strong>
        )}
        <p>{block.body}</p>
      </div>
    );
  }

  if (block.type === "staff") {
    // 将音名转为 MIDI（支持一维单音或二维和弦）
    const midiNotes = (Array.isArray(block.notes[0])
      ? (block.notes as string[][]).map((g) => g.map((n) => noteToMidi(n)))
      : (block.notes as string[]).map((n) => noteToMidi(n))) as number[] | number[][];
    const count = block.notes.length;
    return (
      <div className="rounded-xl bg-brand-deeper/60 border border-brand-border p-3">
        <div className="overflow-x-auto">
          <Staff
            midiNotes={midiNotes}
            clef={block.clef}
            keySignature={block.keySignature}
            width={Math.max(280, count * 44 + 80)}
            height={140}
          />
        </div>
        {block.caption && (
          <p className="text-xs text-brand-muted mt-2 px-1">{block.caption}</p>
        )}
      </div>
    );
  }

  if (block.type === "play") {
    const midis = block.notes.map((n) => noteToMidi(n));
    return (
      <button
        onClick={() =>
          block.mode === "chord" ? playChordMidi(midis) : playSequenceMidi(midis, 0.4)
        }
        className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-brand-card border border-brand-border text-brand-text hover:border-brand-cta/40 transition-colors cursor-pointer"
      >
        <Play className="w-4 h-4 mr-1.5 text-brand-cta" /> {block.label}
      </button>
    );
  }

  if (block.type === "tip") {
    return (
      <div className="flex gap-2 rounded-xl bg-brand-accent/10 border border-brand-accent/20 p-3">
        <Lightbulb className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" />
        <p className="text-xs text-brand-text leading-relaxed">{block.body}</p>
      </div>
    );
  }

  if (block.type === "link") {
    return (
      <Link
        href={block.href}
        className="inline-flex items-center text-sm font-medium text-brand-cta hover:text-brand-cta-hover transition-colors cursor-pointer"
      >
        {block.label} <ArrowRight className="w-3.5 h-3.5 ml-1" />
      </Link>
    );
  }

  return null;
}

export function LessonView({ lesson }: { lesson: Lesson }) {
  return (
    <article className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-brand-heading">{lesson.title}</h2>
        <p className="mt-1 text-sm text-brand-muted">{lesson.summary}</p>
      </div>
      {lesson.blocks.map((block, i) => (
        <BlockView key={i} block={block} />
      ))}
    </article>
  );
}
