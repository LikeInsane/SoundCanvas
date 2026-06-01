"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Lightbulb, Link2, Eraser, Play, Circle, Square, Download } from "lucide-react";
import { Fretboard } from "@/components/guitar/Fretboard";
import { ChordDiagram } from "@/components/guitar/ChordDiagram";
import { SHARP_NAMES, midiToNote } from "@/lib/music-theory";
import { playExtMidi, playUkuleleMidi } from "@/lib/instrument-audio";
import { exportRecordingToWav, type ExportInstrument } from "@/lib/wav-export";
import {
  BASS_OPEN_MIDI,
  BASS_FRET_COUNT,
  BASS_KEY_MAP,
  UKULELE_OPEN_MIDI,
  UKULELE_FRET_COUNT,
  UKULELE_KEY_MAP,
  UKULELE_CHORDS,
  ukuleleChordKeys,
  type FretKeyEntry,
  type UkuleleChord,
} from "@/lib/fretted-instruments";

export type FretKind = "bass" | "ukulele";

interface KindConfig {
  title: string;
  desc: string;
  sharePath: string;
  exportInstrument: ExportInstrument;
  openStringMidi: number[];
  fretCount: number;
  keyMap: Record<string, FretKeyEntry>;
  hasChords: boolean;
}

const CONFIG: Record<FretKind, KindConfig> = {
  bass: {
    title: "虚拟贝斯",
    desc: "四弦贝斯指板，点击或电脑键盘弹奏（四排按键对应四条弦）；可提示音位、标记分享与录音回放。",
    sharePath: "/bass",
    exportInstrument: "bass",
    openStringMidi: BASS_OPEN_MIDI,
    fretCount: BASS_FRET_COUNT,
    keyMap: BASS_KEY_MAP,
    hasChords: false,
  },
  ukulele: {
    title: "虚拟尤克里里",
    desc: "四弦尤克里里指板，点击或电脑键盘弹奏；含常用和弦库、音位提示、标记分享与录音回放。",
    sharePath: "/ukulele",
    exportInstrument: "ukulele",
    openStringMidi: UKULELE_OPEN_MIDI,
    fretCount: UKULELE_FRET_COUNT,
    keyMap: UKULELE_KEY_MAP,
    hasChords: true,
  },
};

/**
 * 指板类乐器内容：贝斯与尤克里里复用，注入对应调弦、键位与音色。
 */
export function FretInstrumentContent({ kind }: { kind: FretKind }) {
  const cfg = CONFIG[kind];
  const searchParams = useSearchParams();
  const [marking, setMarking] = useState(false);
  const [marked, setMarked] = useState<Set<string>>(new Set());
  const [active, setActive] = useState<Set<string>>(new Set());
  const [hintPc, setHintPc] = useState<number | null>(null);
  const [shareHint, setShareHint] = useState(false);
  const [selectedChord, setSelectedChord] = useState<UkuleleChord | null>(null);

  const [recording, setRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const recordRef = useRef<Array<{ midi: number; time: number }>>([]);
  const recordStartRef = useRef(0);

  const fretToMidi = useCallback(
    (stringIndex: number, fret: number) => cfg.openStringMidi[stringIndex] + fret,
    [cfg.openStringMidi]
  );

  const playMidi = useCallback(
    (midi: number) => {
      if (kind === "ukulele") playUkuleleMidi(midi);
      else playExtMidi("bass", midi, 0.9, 0.2);
    },
    [kind]
  );

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
      playMidi(midi);
      flash(key);
      if (recording) {
        recordRef.current.push({ midi, time: performance.now() - recordStartRef.current });
      }
    },
    [marking, flash, recording, fretToMidi, playMidi]
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.repeat || e.metaKey || e.ctrlKey) return;
      const entry = cfg.keyMap[e.key.toLowerCase()];
      if (!entry) return;
      e.preventDefault();
      press(entry.stringIndex, entry.fret);
    };
    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, [press, cfg.keyMap]);

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
      window.setTimeout(() => playMidi(ev.midi), ev.time);
    });
  };

  const exportRecording = () => {
    void exportRecordingToWav(
      recordRef.current.map((ev) => ({ midi: ev.midi, time: ev.time, instrument: cfg.exportInstrument })),
      `${cfg.exportInstrument}-recording.wav`
    );
  };

  const hintKeys = (() => {
    if (selectedChord) return new Set(ukuleleChordKeys(selectedChord.frets));
    if (hintPc === null) return undefined;
    const set = new Set<string>();
    for (let s = 0; s < cfg.openStringMidi.length; s++) {
      for (let f = 0; f <= cfg.fretCount; f++) {
        if (((fretToMidi(s, f) % 12) + 12) % 12 === hintPc) set.add(`${s}-${f}`);
      }
    }
    return set;
  })();

  const strumChord = (chord: UkuleleChord) => {
    let i = 0;
    for (let s = cfg.openStringMidi.length - 1; s >= 0; s--) {
      const fret = chord.frets[s];
      if (fret < 0) continue;
      const midi = fretToMidi(s, fret);
      window.setTimeout(() => playUkuleleMidi(midi), i * 45);
      i += 1;
    }
  };

  const selectChord = (chord: UkuleleChord) => {
    const isSame = selectedChord?.name === chord.name;
    setSelectedChord(isSame ? null : chord);
    if (!isSame) strumChord(chord);
  };

  const shareMarks = async () => {
    const arr = Array.from(marked);
    const url = `${window.location.origin}${cfg.sharePath}?marks=${arr.join(",")}`;
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
        <h1 className="text-2xl font-semibold text-brand-heading">{cfg.title}</h1>
        <p className="mt-1 text-sm text-brand-muted">{cfg.desc}</p>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-6">
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

      <div className="glass-card p-4">
        <Fretboard
          activeKeys={active}
          markedKeys={marked}
          hintKeys={hintKeys}
          openStringMidi={cfg.openStringMidi}
          fretCount={cfg.fretCount}
          onPress={press}
        />
      </div>

      <p className="text-xs text-brand-muted mt-4">
        提示功能会用绿色标出所选音在指板上的全部位置。
        {cfg.hasChords ? "选中下方和弦会在指板上显示按法。" : ""}
      </p>

      {cfg.hasChords && (
        <div className="mt-8">
          <h2 className="text-sm font-semibold text-brand-heading mb-3">常用和弦库</h2>
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-7 gap-3">
            {UKULELE_CHORDS.map((chord) => {
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
                  <ChordDiagram frets={chord.frets} stringCount={4} />
                </button>
              );
            })}
          </div>
          {selectedChord && (
            <button onClick={() => strumChord(selectedChord)} className="btn-secondary py-2 mt-4">
              <Play className="w-4 h-4 mr-1" /> 扫弦播放 {selectedChord.name}
            </button>
          )}
        </div>
      )}

      {marked.size > 0 && (
        <p className="text-xs text-brand-muted mt-4">
          已标记：
          {Array.from(marked)
            .map((k) => {
              const [s, f] = k.split("-").map(Number);
              return midiToNote(fretToMidi(s, f)).replace(/\d/, "");
            })
            .join("  ")}
        </p>
      )}
    </div>
  );
}
