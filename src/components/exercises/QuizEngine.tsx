"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Play, Check, X, RotateCcw, Volume2 } from "lucide-react";
import { Staff } from "@/components/notation/Staff";
import { Keyboard } from "@/components/piano/Keyboard";
import { InteractiveStaff, keySignaturePositions } from "@/components/notation/InteractiveStaff";
import type { Level, Question } from "@/lib/exercises-data";
import { noteToMidi, patternOnsets, midiToNote } from "@/lib/music-theory";
import { playChordMidi, playMidi, playSequenceMidi, playClick, getAudioContext } from "@/lib/instrument-audio";
import { saveLevelProgress } from "@/lib/progress";

/**
 * 通用答题引擎：根据关卡生成器逐题出题，支持选择题、钢琴点键、钢琴构建、节奏打拍四种作答模式。
 */
function playAudio(q: Question) {
  if (!q.audio) return;
  const midis = q.audio.notes.map((n) => noteToMidi(n));
  if (q.audio.mode === "chord") playChordMidi(midis);
  else if (q.audio.mode === "sequence") playSequenceMidi(midis, 0.5);
  else playMidi(midis[0]);
}

export function QuizEngine({ level, categoryId }: { level: Level; categoryId: string }) {
  const [index, setIndex] = useState(0);
  const [question, setQuestion] = useState<Question | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  // 通用作答状态
  const [answered, setAnswered] = useState(false);
  const [lastCorrect, setLastCorrect] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);
  // 钢琴构建：当前选中的键
  const [selected, setSelected] = useState<Set<number>>(new Set());
  // 节奏打拍
  const [tapping, setTapping] = useState(false);
  const tapsRef = useRef<number[]>([]);
  const tapStartRef = useRef(0);
  // 记谱书写
  const [writtenNatural, setWrittenNatural] = useState<string | null>(null);
  const [writeAccidental, setWriteAccidental] = useState<"" | "#" | "b">("");
  // 书写调号
  const [placedAccidentals, setPlacedAccidentals] = useState<Array<{ note: string; type: "sharp" | "flat" }>>([]);

  const loadNext = useCallback(() => {
    setAnswered(false);
    setLastCorrect(false);
    setPicked(null);
    setSelected(new Set());
    setTapping(false);
    tapsRef.current = [];
    setWrittenNatural(null);
    setWriteAccidental("");
    setPlacedAccidentals([]);
    setQuestion(level.gen());
  }, [level]);

  // 初始化与切换关卡
  useEffect(() => {
    setIndex(0);
    setCorrectCount(0);
    setFinished(false);
    loadNext();
  }, [level, loadNext]);

  // 听力题自动播放
  useEffect(() => {
    if (question?.ear) {
      const t = window.setTimeout(() => playAudio(question), 250);
      return () => window.clearTimeout(t);
    }
  }, [question]);

  // 打拍期间监听空格
  useEffect(() => {
    if (!tapping) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.key === " ") {
        e.preventDefault();
        tapsRef.current.push(performance.now() - tapStartRef.current);
        playClick(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tapping]);

  const staffMidi = useMemo(() => {
    if (!question?.staff) return null;
    const notes = question.staff.notes;
    return (Array.isArray(notes[0])
      ? (notes as string[][]).map((g) => g.map((n) => noteToMidi(n)))
      : (notes as string[]).map((n) => noteToMidi(n))) as number[] | number[][];
  }, [question]);

  // 统一推进：在反馈后进入下一题或结束
  const resolve = useCallback(
    (isCorrect: boolean) => {
      setAnswered(true);
      setLastCorrect(isCorrect);
      const isLast = index + 1 >= level.total;
      window.setTimeout(
        () => {
          if (isLast) {
            const finalCorrect = correctCount + (isCorrect ? 1 : 0);
            saveLevelProgress(level.id, finalCorrect, level.total);
            setCorrectCount(finalCorrect);
            setFinished(true);
          } else {
            setCorrectCount((c) => c + (isCorrect ? 1 : 0));
            setIndex((i) => i + 1);
            loadNext();
          }
        },
        isCorrect ? 700 : 1150
      );
    },
    [index, level, correctCount, loadNext]
  );

  if (!question) return null;

  /* ----------------------------- 选择题 ----------------------------- */
  const pickChoice = (opt: string) => {
    if (answered) return;
    setPicked(opt);
    resolve(opt === question.answer);
  };

  /* ----------------------------- 钢琴点键 ----------------------------- */
  const pressPianoKey = (midi: number) => {
    if (answered) return;
    playMidi(midi);
    const ok = (question.expectedMidis ?? []).includes(midi);
    setSelected(new Set([midi]));
    resolve(ok);
  };

  /* ----------------------------- 钢琴构建 ----------------------------- */
  const togglePianoBuild = (midi: number) => {
    if (answered) return;
    playMidi(midi);
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(midi)) next.delete(midi);
      else next.add(midi);
      return next;
    });
  };

  const submitBuild = () => {
    if (answered) return;
    const expected = [...(question.expectedMidis ?? [])].sort((a, b) => a - b);
    const got = Array.from(selected).sort((a, b) => a - b);
    const ok = expected.length === got.length && expected.every((m, i) => m === got[i]);
    resolve(ok);
  };

  /* ----------------------------- 节奏打拍 ----------------------------- */
  const startRhythmTap = () => {
    if (answered || tapping || !question.rhythm) return;
    const bpm = question.bpm ?? 90;
    const secPerBeat = 60 / bpm;
    const ctx = getAudioContext();
    // 四拍预备
    for (let i = 0; i < 4; i++) {
      playClick(i === 0, ctx.currentTime + i * secPerBeat);
    }
    const startDelay = 4 * secPerBeat;
    window.setTimeout(() => {
      setTapping(true);
      tapsRef.current = [];
      tapStartRef.current = performance.now();
    }, startDelay * 1000);

    // 一小节(4拍)后结束并判定
    const totalMs = (startDelay + 4 * secPerBeat + 0.3) * 1000;
    window.setTimeout(() => {
      setTapping(false);
      const onsets = patternOnsets(question.rhythm!).map((b) => b * secPerBeat);
      const taps = tapsRef.current.map((t) => t / 1000);
      const tolerance = 0.2;
      let matched = 0;
      const used = new Set<number>();
      for (const onset of onsets) {
        let best = -1;
        let bestDiff = tolerance;
        taps.forEach((tap, i) => {
          if (used.has(i)) return;
          const diff = Math.abs(tap - onset);
          if (diff < bestDiff) {
            bestDiff = diff;
            best = i;
          }
        });
        if (best >= 0) {
          used.add(best);
          matched += 1;
        }
      }
      const ok = matched === onsets.length && Math.abs(taps.length - onsets.length) <= 1;
      resolve(ok);
    }, totalMs);
  };

  /* ----------------------------- 记谱书写 ----------------------------- */
  const writtenNote = writtenNatural
    ? writtenNatural.replace(/(\d)/, `${writeAccidental}$1`)
    : null;

  const submitStaffWrite = () => {
    if (answered || !writtenNote || !question.targetNote) return;
    playMidi(noteToMidi(writtenNote));
    resolve(noteToMidi(writtenNote) === noteToMidi(question.targetNote));
  };

  /* ----------------------------- 书写调号 ----------------------------- */
  const addAccidental = () => {
    if (answered || !question.writeClef || !question.keyAccidentalType) return;
    const positions = keySignaturePositions(question.writeClef, question.keyAccidentalType);
    setPlacedAccidentals((prev) => {
      if (prev.length >= positions.length) return prev;
      return [...prev, { note: positions[prev.length], type: question.keyAccidentalType! }];
    });
  };

  const submitKeyWrite = () => {
    if (answered) return;
    const ok =
      placedAccidentals.length === (question.keyAccidentalCount ?? 0) &&
      placedAccidentals.every((a) => a.type === question.keyAccidentalType);
    resolve(ok);
  };

  /* ----------------------------- 结束页 ----------------------------- */
  if (finished) {
    const passed = correctCount >= Math.ceil(level.total * 0.6);
    return (
      <div className="glass-card p-8 text-center max-w-md mx-auto">
        <div className="text-5xl font-bold text-brand-heading">
          {correctCount}/{level.total}
        </div>
        <p className={`mt-3 text-sm ${passed ? "text-brand-green" : "text-brand-muted"}`}>
          {passed ? "完成！进度已保存。" : "再练习一次会更好。"}
        </p>
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={() => {
              setIndex(0);
              setCorrectCount(0);
              setFinished(false);
              loadNext();
            }}
            className="btn-primary"
          >
            <RotateCcw className="w-4 h-4 mr-1" /> 再来一组
          </button>
          <Link href={`/exercises/${categoryId}`} className="btn-secondary">
            返回关卡
          </Link>
        </div>
      </div>
    );
  }

  const mode = question.answerMode ?? "choice";
  const expectedSet = new Set(question.expectedMidis ?? []);

  return (
    <div className="max-w-xl mx-auto">
      {/* 进度条 */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-1.5 rounded-full bg-brand-border overflow-hidden">
          <div
            className="h-full bg-brand-cta transition-all duration-300"
            style={{ width: `${(index / level.total) * 100}%` }}
          />
        </div>
        <span className="text-xs text-brand-muted tabular-nums">
          {index + 1}/{level.total}
        </span>
      </div>

      <div className="glass-card p-8">
        <h2 className="text-lg font-medium text-brand-heading text-center">{question.prompt}</h2>

        {/* 五线谱 / 节奏谱 */}
        {question.rhythm ? (
          <div className="mt-6 flex justify-center">
            <div className="rounded-xl bg-brand-deeper/60 border border-brand-border p-3">
              <Staff rhythm={question.rhythm} timeSignature="4/4" width={420} height={120} />
            </div>
          </div>
        ) : staffMidi ? (
          <div className="mt-6 flex justify-center">
            <div className="rounded-xl bg-brand-deeper/60 border border-brand-border p-3">
              <Staff
                midiNotes={staffMidi}
                clef={question.staff?.clef}
                keySignature={question.staff?.keySignature}
                width={Math.max(220, (Array.isArray(question.staff!.notes[0]) ? question.staff!.notes.length : question.staff!.notes.length) * 44 + 80)}
                height={140}
              />
            </div>
          </div>
        ) : null}

        {/* 听力播放按钮 */}
        {question.audio && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => playAudio(question)}
              className="inline-flex items-center px-5 py-2.5 rounded-full bg-brand-cta text-white text-sm font-medium hover:bg-brand-cta-hover transition-colors cursor-pointer"
            >
              <Volume2 className="w-4 h-4 mr-1.5" /> 再听一次
            </button>
          </div>
        )}

        {/* 作答区 */}
        {mode === "choice" && (
          <div className="mt-8 grid grid-cols-2 gap-3">
            {(question.options ?? []).map((opt) => {
              const isAnswer = opt === question.answer;
              const isPicked = picked === opt;
              let cls = "bg-brand-card border-brand-border text-brand-text hover:border-brand-accent/40";
              if (answered) {
                if (isAnswer) cls = "bg-brand-green/20 border-brand-green text-brand-green";
                else if (isPicked) cls = "bg-red-500/15 border-red-500/50 text-red-400";
                else cls = "bg-brand-card border-brand-border text-brand-muted opacity-60";
              }
              return (
                <button
                  key={opt}
                  onClick={() => pickChoice(opt)}
                  disabled={answered}
                  className={`relative py-3 px-4 rounded-xl border text-sm font-medium transition-colors ${cls} ${
                    answered ? "cursor-default" : "cursor-pointer"
                  }`}
                >
                  {opt}
                  {answered && isAnswer && <Check className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2" />}
                  {answered && isPicked && !isAnswer && (
                    <X className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {(mode === "piano-key" || mode === "piano-build") && question.pianoRange && (
          <div className="mt-8">
            <Keyboard
              startMidi={question.pianoRange[0]}
              endMidi={question.pianoRange[1]}
              showLabels={false}
              activeMidis={answered ? expectedSet : undefined}
              markedMidis={selected}
              onPress={mode === "piano-key" ? pressPianoKey : togglePianoBuild}
            />
            {mode === "piano-build" && (
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-brand-muted">
                  已选 {selected.size} 个音：{Array.from(selected).sort((a, b) => a - b).map((m) => midiToNote(m)).join(" ")}
                </span>
                <button
                  onClick={submitBuild}
                  disabled={answered || selected.size === 0}
                  className="btn-primary py-2 disabled:opacity-40"
                >
                  提交
                </button>
              </div>
            )}
          </div>
        )}

        {mode === "rhythm-tap" && (
          <div className="mt-8 text-center">
            {!answered && (
              <button onClick={startRhythmTap} disabled={tapping} className="btn-primary">
                <Play className="w-4 h-4 mr-1" /> {tapping ? "用空格键按拍敲击..." : "开始（先听四拍预备）"}
              </button>
            )}
            <p className="text-xs text-brand-muted mt-3">
              点击开始后会有四拍预备，然后用空格键按谱面节奏敲击一小节。
            </p>
          </div>
        )}

        {mode === "staff-write" && question.writeClef && (
          <div className="mt-8 flex flex-col items-center">
            <div className="rounded-xl bg-brand-deeper/60 border border-brand-border p-2">
              <InteractiveStaff
                clef={question.writeClef}
                mode="note"
                selectedNote={writtenNote}
                onPick={(n) => !answered && setWrittenNatural(n)}
              />
            </div>
            <div className="flex items-center gap-2 mt-4">
              <span className="text-xs text-brand-muted">变音记号</span>
              {([
                { v: "" as const, label: "还原" },
                { v: "#" as const, label: "升 #" },
                { v: "b" as const, label: "降 b" },
              ]).map((a) => (
                <button
                  key={a.label}
                  onClick={() => !answered && setWriteAccidental(a.v)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    writeAccidental === a.v
                      ? "bg-brand-accent text-white"
                      : "bg-brand-card border border-brand-border text-brand-muted hover:text-brand-text"
                  }`}
                >
                  {a.label}
                </button>
              ))}
              <button
                onClick={submitStaffWrite}
                disabled={answered || !writtenNote}
                className="btn-primary py-2 ml-2 disabled:opacity-40"
              >
                提交
              </button>
            </div>
            {writtenNote && <p className="text-xs text-brand-muted mt-2">当前：{writtenNote}</p>}
          </div>
        )}

        {mode === "key-write" && question.writeClef && (
          <div className="mt-8 flex flex-col items-center">
            <div className="rounded-xl bg-brand-deeper/60 border border-brand-border p-2">
              <InteractiveStaff clef={question.writeClef} mode="key" accidentals={placedAccidentals} />
            </div>
            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={addAccidental}
                disabled={answered}
                className="px-3 py-1 rounded-lg text-xs font-medium bg-brand-card border border-brand-border text-brand-text hover:border-brand-accent/40 transition-colors cursor-pointer"
              >
                添加{question.keyAccidentalType === "flat" ? "降号 b" : "升号 #"}
              </button>
              <button
                onClick={() => setPlacedAccidentals([])}
                disabled={answered}
                className="px-3 py-1 rounded-lg text-xs font-medium text-brand-muted hover:text-red-400 transition-colors cursor-pointer"
              >
                清空
              </button>
              <button
                onClick={submitKeyWrite}
                disabled={answered}
                className="btn-primary py-2 ml-2 disabled:opacity-40"
              >
                提交
              </button>
            </div>
            <p className="text-xs text-brand-muted mt-2">已放置 {placedAccidentals.length} 个记号</p>
          </div>
        )}

        {/* 反馈 */}
        {answered && (
          <p className={`text-center text-sm mt-6 ${lastCorrect ? "text-brand-green" : "text-red-400"}`}>
            {lastCorrect ? "正确" : "再想想"}
          </p>
        )}
      </div>

      <p className="text-center text-xs text-brand-muted mt-4">当前正确：{correctCount}</p>
    </div>
  );
}
