"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { Play, Circle, Square, Check, Eraser, Link2, Download } from "lucide-react";
import { Keyboard } from "@/components/piano/Keyboard";
import { KEYBOARD_MAP, midiToNote, noteToMidi } from "@/lib/music-theory";
import { exportRecordingToWav, type ExportInstrument } from "@/lib/wav-export";

interface RecordEvent {
  midi: number;
  time: number;
}

export interface KeyboardInstrumentProps {
  /** 标题与说明 */
  title: string;
  desc: string;
  /** 分享链接所用的路由（如 "/synth"） */
  sharePath: string;
  /** 导出 WAV 时使用的乐器类型 */
  exportInstrument: ExportInstrument;
  /** 发声回调：由调用方决定具体音色 */
  play: (midi: number, gain: number) => void;
  /** 默认起始八度 */
  defaultOctave?: number;
  /** 可选八度档位 */
  octaves?: number[];
  /** 控制栏额外内容（如波形选择） */
  controls?: ReactNode;
}

/**
 * 键盘类虚拟乐器通用主体：复用钢琴键盘，提供八度/音量/标签、音符标记 + URL 分享、录音回放与导出。
 * 具体音色通过 play 回调注入，从而支持合成器、小提琴、钟琴、木琴等多种乐器。
 */
export function KeyboardInstrument({
  title,
  desc,
  sharePath,
  exportInstrument,
  play,
  defaultOctave = 4,
  octaves = [2, 3, 4, 5],
  controls,
}: KeyboardInstrumentProps) {
  const searchParams = useSearchParams();
  const [baseOctave, setBaseOctave] = useState(defaultOctave);
  const [volume, setVolume] = useState(0.18);
  const [labelMode, setLabelMode] = useState<"note" | "shortcut">("note");
  const [marking, setMarking] = useState(false);
  const [marked, setMarked] = useState<Set<number>>(new Set());
  const [active, setActive] = useState<Set<number>>(new Set());

  const [recording, setRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const recordRef = useRef<RecordEvent[]>([]);
  const recordStartRef = useRef(0);
  const [shareHint, setShareHint] = useState(false);

  const startMidi = noteToMidi(`C${baseOctave}`);
  const endMidi = noteToMidi(`C${baseOctave + 2}`);

  useEffect(() => {
    const marks = searchParams.get("marks");
    if (marks) {
      const set = new Set<number>();
      marks.split(",").forEach((s) => {
        const n = parseInt(s, 10);
        if (!Number.isNaN(n)) set.add(n);
      });
      if (set.size > 0) {
        setMarked(set);
        setMarking(true);
      }
    }
  }, [searchParams]);

  const shortcutLabels = useMemo(() => {
    if (labelMode !== "shortcut") return undefined;
    const map: Record<number, string> = {};
    Object.entries(KEYBOARD_MAP).forEach(([key, offset]) => {
      map[startMidi + offset] = key.toUpperCase();
    });
    return map;
  }, [labelMode, startMidi]);

  const flash = useCallback((midi: number) => {
    setActive((prev) => {
      const next = new Set(prev);
      next.add(midi);
      return next;
    });
    window.setTimeout(() => {
      setActive((prev) => {
        const next = new Set(prev);
        next.delete(midi);
        return next;
      });
    }, 180);
  }, []);

  const press = useCallback(
    (midi: number) => {
      if (marking) {
        setMarked((prev) => {
          const next = new Set(prev);
          if (next.has(midi)) next.delete(midi);
          else next.add(midi);
          return next;
        });
        play(midi, volume);
        return;
      }
      play(midi, volume);
      flash(midi);
      if (recording) {
        recordRef.current.push({ midi, time: performance.now() - recordStartRef.current });
      }
    },
    [marking, volume, flash, recording, play]
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.repeat || e.metaKey || e.ctrlKey) return;
      const offset = KEYBOARD_MAP[e.key.toLowerCase()];
      if (offset === undefined) return;
      e.preventDefault();
      press(startMidi + offset);
    };
    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, [press, startMidi]);

  const toggleRecord = () => {
    if (recording) {
      setRecording(false);
      setHasRecording(recordRef.current.length > 0);
    } else {
      recordRef.current = [];
      recordStartRef.current = performance.now();
      setRecording(true);
      setHasRecording(false);
    }
  };

  const playRecording = () => {
    recordRef.current.forEach((ev) => {
      window.setTimeout(() => {
        play(ev.midi, volume);
        flash(ev.midi);
      }, ev.time);
    });
  };

  const exportRecording = () => {
    void exportRecordingToWav(
      recordRef.current.map((ev) => ({ midi: ev.midi, time: ev.time, instrument: exportInstrument })),
      `${exportInstrument}-recording.wav`
    );
  };

  const playMarks = () => {
    const arr = Array.from(marked).sort((a, b) => a - b);
    arr.forEach((m, i) => {
      window.setTimeout(() => {
        play(m, volume);
        flash(m);
      }, i * 350);
    });
  };

  const shareMarks = async () => {
    const arr = Array.from(marked).sort((a, b) => a - b);
    const url = `${window.location.origin}${sharePath}?marks=${arr.join(",")}`;
    try {
      await navigator.clipboard.writeText(url);
      setShareHint(true);
      window.setTimeout(() => setShareHint(false), 2000);
    } catch {
      window.prompt("复制以下链接分享：", url);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-brand-heading">{title}</h1>
        <p className="mt-1 text-sm text-brand-muted">{desc}</p>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs text-brand-muted">八度</span>
          {octaves.map((o) => (
            <button
              key={o}
              onClick={() => setBaseOctave(o)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                baseOctave === o
                  ? "bg-brand-cta text-white"
                  : "bg-brand-card border border-brand-border text-brand-muted hover:text-brand-text"
              }`}
            >
              C{o}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-brand-muted">音量</span>
          <input
            type="range"
            min={0}
            max={0.4}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="accent-brand-cta cursor-pointer w-24"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-brand-muted">标签</span>
          <button
            onClick={() => setLabelMode((m) => (m === "note" ? "shortcut" : "note"))}
            className="px-3 py-1 rounded-lg text-xs font-medium bg-brand-card border border-brand-border text-brand-text hover:border-brand-accent/40 transition-colors cursor-pointer"
          >
            {labelMode === "note" ? "音名" : "快捷键"}
          </button>
        </div>

        {controls}
      </div>

      <div className="glass-card p-4">
        <Keyboard
          startMidi={startMidi}
          endMidi={endMidi}
          activeMidis={active}
          markedMidis={marked}
          showLabels={labelMode === "note"}
          shortcutLabels={shortcutLabels}
          onPress={press}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 mt-6">
        <button
          onClick={() => setMarking((m) => !m)}
          className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
            marking
              ? "bg-brand-accent text-white"
              : "bg-brand-card border border-brand-border text-brand-text hover:border-brand-accent/40"
          }`}
        >
          <Check className="w-4 h-4 mr-1" /> {marking ? "标记中" : "标记音符"}
        </button>

        {marked.size > 0 && (
          <>
            <button onClick={playMarks} className="btn-secondary py-2">
              <Play className="w-4 h-4 mr-1" /> 播放标记（{marked.size}）
            </button>
            <button
              onClick={shareMarks}
              className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-brand-card border border-brand-border text-brand-text hover:border-brand-accent/40 transition-colors cursor-pointer"
            >
              <Link2 className="w-4 h-4 mr-1" /> {shareHint ? "已复制链接" : "分享"}
            </button>
            <button
              onClick={() => setMarked(new Set())}
              className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-brand-muted hover:text-red-400 transition-colors cursor-pointer"
            >
              <Eraser className="w-4 h-4 mr-1" /> 清除
            </button>
          </>
        )}

        <span className="mx-1 text-brand-border">|</span>

        <button
          onClick={toggleRecord}
          className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
            recording
              ? "bg-red-500/20 text-red-400 border border-red-500/40"
              : "bg-brand-card border border-brand-border text-brand-text hover:border-brand-accent/40"
          }`}
        >
          {recording ? <Square className="w-4 h-4 mr-1" /> : <Circle className="w-4 h-4 mr-1" />}
          {recording ? "停止录音" : "录音"}
        </button>
        {hasRecording && !recording && (
          <>
            <button onClick={playRecording} className="btn-secondary py-2">
              <Play className="w-4 h-4 mr-1" /> 回放
            </button>
            <button
              onClick={exportRecording}
              className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-brand-card border border-brand-border text-brand-text hover:border-brand-accent/40 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 mr-1" /> 导出 WAV
            </button>
          </>
        )}
      </div>

      {marked.size > 0 && (
        <p className="text-xs text-brand-muted mt-4">
          已标记：{Array.from(marked).sort((a, b) => a - b).map((m) => midiToNote(m)).join("  ")}
        </p>
      )}
    </div>
  );
}
