"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Lightbulb, Link2, Eraser, Play, Circle, Square, Download } from "lucide-react";
import { Fretboard } from "@/components/guitar/Fretboard";
import {
  FRET_COUNT,
  KEY_MAP_LOWER,
  KEY_MAP_UPPER,
  OPEN_STRING_MIDI,
  fretToMidi,
} from "@/lib/guitar";
import { SHARP_NAMES } from "@/lib/music-theory";
import { playPluckMidi } from "@/lib/instrument-audio";
import { exportRecordingToWav } from "@/lib/wav-export";
import { GUITAR_CHORDS, chordPositionKeys, type GuitarChord } from "@/lib/guitar-chords";
import { ChordDiagram } from "@/components/guitar/ChordDiagram";

/**
 * 虚拟吉他主体：点击/电脑键盘弹奏，提示某音位置，标记 + URL 分享，原声/电声切换。
 */
export default function GuitarContent() {
  const searchParams = useSearchParams();
  const [bright, setBright] = useState(false); // false=原声, true=电声
  const [marking, setMarking] = useState(false);
  const [marked, setMarked] = useState<Set<string>>(new Set());
  const [active, setActive] = useState<Set<string>>(new Set());
  const [hintPc, setHintPc] = useState<number | null>(null);
  const [shareHint, setShareHint] = useState(false);

  // 录音
  const [recording, setRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const recordRef = useRef<Array<{ midi: number; time: number }>>([]);
  const recordStartRef = useRef(0);

  // 和弦库
  const [selectedChord, setSelectedChord] = useState<GuitarChord | null>(null);

  // 从 URL 读取标记
  useEffect(() => {
    const marks = searchParams.get("marks");
    if (marks) {
      const set = new Set<string>();
      marks.split(",").forEach((s) => {
        if (/^\d+-\d+$/.test(s)) set.add(s);
      });
      if (set.size > 0) {
        setMarked(set);
        setMarking(true);
      }
    }
  }, [searchParams]);

  const flash = useCallback((key: string) => {
    setActive((prev) => new Set(prev).add(key));
    window.setTimeout(() => {
      setActive((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }, 200);
  }, []);

  const press = useCallback(
    (stringIndex: number, fret: number) => {
      const key = `${stringIndex}-${fret}`;
      if (marking) {
        setMarked((prev) => {
          const next = new Set(prev);
          if (next.has(key)) next.delete(key);
          else next.add(key);
          return next;
        });
      }
      const midi = fretToMidi(stringIndex, fret);
      playPluckMidi(midi, bright);
      flash(key);
      if (recording) {
        recordRef.current.push({ midi, time: performance.now() - recordStartRef.current });
      }
    },
    [marking, bright, flash, recording]
  );

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
      window.setTimeout(() => playPluckMidi(ev.midi, bright), ev.time);
    });
  };

  const exportRecording = () => {
    void exportRecordingToWav(
      recordRef.current.map((ev) => ({ midi: ev.midi, time: ev.time, instrument: "guitar" as const })),
      "guitar-recording.wav"
    );
  };

  // 电脑键盘监听
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.repeat || e.metaKey || e.ctrlKey) return;
      const k = e.key.toLowerCase();
      const entry = e.shiftKey ? KEY_MAP_UPPER[k] : KEY_MAP_LOWER[k];
      if (!entry) return;
      e.preventDefault();
      press(entry.stringIndex, entry.fret);
    };
    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, [press]);

  // 指板高亮：选中和弦时显示和弦按法，否则显示某 pitch class 的位置提示
  const hintKeys = (() => {
    if (selectedChord) return new Set(chordPositionKeys(selectedChord.frets));
    if (hintPc === null) return undefined;
    const set = new Set<string>();
    for (let s = 0; s < OPEN_STRING_MIDI.length; s++) {
      for (let f = 0; f <= FRET_COUNT; f++) {
        if (((fretToMidi(s, f) % 12) + 12) % 12 === hintPc) set.add(`${s}-${f}`);
      }
    }
    return set;
  })();

  // 扫弦：从低音弦到高音弦依次拨响（跳过闷音弦）
  const strumChord = (chord: GuitarChord) => {
    let i = 0;
    for (let s = OPEN_STRING_MIDI.length - 1; s >= 0; s--) {
      const fret = chord.frets[s];
      if (fret < 0) continue;
      const midi = fretToMidi(s, fret);
      window.setTimeout(() => playPluckMidi(midi, bright), i * 45);
      i += 1;
    }
  };

  const selectChord = (chord: GuitarChord) => {
    const isSame = selectedChord?.name === chord.name;
    setSelectedChord(isSame ? null : chord);
    if (!isSame) strumChord(chord);
  };

  const shareMarks = async () => {
    const arr = Array.from(marked);
    const url = `${window.location.origin}/guitar?marks=${arr.join(",")}`;
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
        <h1 className="text-2xl font-semibold text-brand-heading">虚拟吉他</h1>
        <p className="mt-1 text-sm text-brand-muted">
          点击指板或用电脑键盘弹奏：四排按键对应低音四弦，按住 Shift 弹高音两弦。
        </p>
      </div>

      {/* 控制栏 */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs text-brand-muted">音色</span>
          {[
            { id: false, label: "原声" },
            { id: true, label: "电声" },
          ].map((t) => (
            <button
              key={t.label}
              onClick={() => setBright(t.id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                bright === t.id
                  ? "bg-brand-cta text-white"
                  : "bg-brand-card border border-brand-border text-brand-muted hover:text-brand-text"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Lightbulb className="w-3.5 h-3.5 text-brand-green" />
          <span className="text-xs text-brand-muted">提示音</span>
          <select
            value={hintPc ?? ""}
            onChange={(e) => setHintPc(e.target.value === "" ? null : Number(e.target.value))}
            className="px-2 py-1 rounded-lg bg-brand-card border border-brand-border text-xs text-brand-text cursor-pointer"
          >
            <option value="">关闭</option>
            {SHARP_NAMES.map((n, pc) => (
              <option key={pc} value={pc}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setMarking((m) => !m)}
          className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            marking
              ? "bg-brand-accent text-white"
              : "bg-brand-card border border-brand-border text-brand-text hover:border-brand-accent/40"
          }`}
        >
          {marking ? "标记中" : "标记音符"}
        </button>

        {marked.size > 0 && (
          <>
            <button
              onClick={shareMarks}
              className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-brand-card border border-brand-border text-brand-text hover:border-brand-accent/40 transition-colors cursor-pointer"
            >
              <Link2 className="w-3.5 h-3.5 mr-1" /> {shareHint ? "已复制" : "分享"}
            </button>
            <button
              onClick={() => setMarked(new Set())}
              className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium text-brand-muted hover:text-red-400 transition-colors cursor-pointer"
            >
              <Eraser className="w-3.5 h-3.5 mr-1" /> 清除
            </button>
          </>
        )}

        <span className="text-brand-border">|</span>

        <button
          onClick={toggleRecord}
          className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            recording
              ? "bg-red-500/20 text-red-400 border border-red-500/40"
              : "bg-brand-card border border-brand-border text-brand-text hover:border-brand-accent/40"
          }`}
        >
          {recording ? <Square className="w-3.5 h-3.5 mr-1" /> : <Circle className="w-3.5 h-3.5 mr-1" />}
          {recording ? "停止录音" : "录音"}
        </button>
        {hasRecording && !recording && (
          <>
            <button
              onClick={playRecording}
              className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-brand-card border border-brand-border text-brand-text hover:border-brand-accent/40 transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 mr-1" /> 回放
            </button>
            <button
              onClick={exportRecording}
              className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-brand-card border border-brand-border text-brand-text hover:border-brand-accent/40 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 mr-1" /> 导出 WAV
            </button>
          </>
        )}
      </div>

      {/* 指板 */}
      <div className="glass-card p-4">
        <Fretboard
          activeKeys={active}
          markedKeys={marked}
          hintKeys={hintKeys}
          onPress={press}
        />
      </div>

      <p className="text-xs text-brand-muted mt-4">
        提示功能会用绿色标出所选音在指板上的全部位置；选中下方和弦会在指板上显示按法。
      </p>

      {/* 和弦库 */}
      <div className="mt-8">
        <h2 className="text-sm font-semibold text-brand-heading mb-3">常用和弦库</h2>
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-7 gap-3">
          {GUITAR_CHORDS.map((chord) => {
            const isSel = selectedChord?.name === chord.name;
            return (
              <button
                key={chord.name}
                onClick={() => selectChord(chord)}
                className={`glass-card p-2 flex flex-col items-center cursor-pointer transition-all duration-200 ${
                  isSel ? "border-brand-cta" : "hover:border-brand-accent/30"
                }`}
              >
                <span className="text-xs font-semibold text-brand-heading mb-1">{chord.name}</span>
                <ChordDiagram frets={chord.frets} />
              </button>
            );
          })}
        </div>
        {selectedChord && (
          <button
            onClick={() => strumChord(selectedChord)}
            className="btn-secondary py-2 mt-4"
          >
            <Play className="w-4 h-4 mr-1" /> 扫弦播放 {selectedChord.name}
          </button>
        )}
      </div>
    </div>
  );
}
