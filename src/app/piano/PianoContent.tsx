"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Play, Circle, Square, Check, Eraser, Link2, Download } from "lucide-react";
import { Keyboard } from "@/components/piano/Keyboard";
import { KEYBOARD_MAP, midiToNote, noteToMidi } from "@/lib/music-theory";
import { playMidi, playSequenceMidi } from "@/lib/instrument-audio";
import { exportRecordingToWav } from "@/lib/wav-export";

interface RecordEvent {
  midi: number;
  time: number;
}

/**
 * 虚拟钢琴主体：电脑键盘/点击弹奏，八度与音量，音符标记与分享，录音回放。
 */
export default function PianoContent() {
  const searchParams = useSearchParams();
  const [baseOctave, setBaseOctave] = useState(4);
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

  // 初始化：从 URL 读取标记
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

  // 快捷键标签映射
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
        playMidi(midi, 0.8, volume);
        return;
      }
      playMidi(midi, 0.8, volume);
      flash(midi);
      if (recording) {
        recordRef.current.push({ midi, time: performance.now() - recordStartRef.current });
      }
    },
    [marking, volume, flash, recording]
  );

  // 电脑键盘监听
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
        playMidi(ev.midi, 0.8, volume);
        flash(ev.midi);
      }, ev.time);
    });
  };

  const exportRecording = () => {
    void exportRecordingToWav(
      recordRef.current.map((ev) => ({ midi: ev.midi, time: ev.time, instrument: "piano" as const })),
      "piano-recording.wav"
    );
  };

  const playMarks = () => {
    const arr = Array.from(marked).sort((a, b) => a - b);
    if (arr.length > 0) playSequenceMidi(arr, 0.35, 0.6, volume);
  };

  const shareMarks = async () => {
    const arr = Array.from(marked).sort((a, b) => a - b);
    const url = `${window.location.origin}/piano?marks=${arr.join(",")}`;
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
        <h1 className="text-2xl font-semibold text-brand-heading">虚拟钢琴</h1>
        <p className="mt-1 text-sm text-brand-muted">
          用鼠标点击或电脑键盘弹奏（字母行对应白键，上排数字/字母对应黑键）。
        </p>
      </div>

      {/* 控制栏 */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs text-brand-muted">八度</span>
          {[2, 3, 4, 5].map((o) => (
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
      </div>

      {/* 键盘 */}
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

      {/* 工具行 */}
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
            <button onClick={shareMarks} className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-brand-card border border-brand-border text-brand-text hover:border-brand-accent/40 transition-colors cursor-pointer">
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
