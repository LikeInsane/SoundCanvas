/**
 * Web Audio 播放引擎：根据 content 在对应时间触发节奏、和弦、旋律
 * 使用 AudioContext、OscillatorNode、GainNode；BPM 换算为秒
 */

import { useEffect, useRef, useState, useCallback } from "react";
import type { ProjectContent } from "./sandbox-types";

const A4 = 440;

/** 音符名转频率（十二平均律，A4=440） */
function noteToFreq(note: string): number {
  const match = note.match(/^([A-G])(#|b)?(\d+)$/i);
  if (!match) return A4;
  const name = match[1].toUpperCase();
  const accidental = match[2];
  const octave = parseInt(match[3], 10);
  const noteIndex: Record<string, number> = {
    C: 0, "C#": 1, Db: 1, D: 2, "D#": 3, Eb: 3, E: 4, F: 5, "F#": 6, Gb: 6, G: 7, "G#": 8, Ab: 8, A: 9, "A#": 10, Bb: 10, B: 11,
  };
  let semitones = noteIndex[name + (accidental || "")] ?? noteIndex[name];
  if (semitones === undefined) semitones = 9;
  const fromA4 = semitones - 9 + (octave - 4) * 12;
  return A4 * Math.pow(2, fromA4 / 12);
}

/** 和弦名到根音 + 三和弦音高（自然大调，简化为根三五） */
const chordToNotes: Record<string, string[]> = {
  C: ["C4", "E4", "G4"],
  Dm: ["D4", "F4", "A4"],
  Em: ["E4", "G4", "B4"],
  F: ["F4", "A4", "C5"],
  G: ["G4", "B4", "D5"],
  Am: ["A4", "C5", "E5"],
  Bdim: ["B4", "D5", "F5"],
};

function playTone(
  ctx: AudioContext,
  freq: number,
  startTime: number,
  duration: number,
  type: OscillatorType = "sine",
  gain = 0.15
) {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.connect(g);
  g.connect(ctx.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);
  g.gain.setValueAtTime(0, startTime);
  g.gain.linearRampToValueAtTime(gain, startTime + 0.01);
  g.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  osc.start(startTime);
  osc.stop(startTime + duration);
}

function playKick(ctx: AudioContext, startTime: number) {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.connect(g);
  g.connect(ctx.destination);
  osc.type = "sine";
  osc.frequency.setValueAtTime(150, startTime);
  osc.frequency.exponentialRampToValueAtTime(40, startTime + 0.15);
  g.gain.setValueAtTime(0.4, startTime);
  g.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);
  osc.start(startTime);
  osc.stop(startTime + 0.25);
}

function playSnare(ctx: AudioContext, startTime: number) {
  const bufSize = ctx.sampleRate * 0.2;
  const buffer = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufSize, 2);
  }
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.3, startTime);
  g.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15);
  src.connect(g);
  g.connect(ctx.destination);
  src.start(startTime);
  src.stop(startTime + 0.2);
  playTone(ctx, 200, startTime, 0.05, "sine", 0.1);
}

/** 将 content 中的 beat/bar 转为秒 */
function beatToSeconds(content: ProjectContent, barIndex: number, beat: number): number {
  const [beatsPerBar] = content.timeSignature;
  const globalBeat = barIndex * beatsPerBar + beat;
  const secPerBeat = 60 / content.bpm;
  return globalBeat * secPerBeat;
}

export function useAudioEngine(content: ProjectContent) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const ctxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number>(0);
  const logicalStartRef = useRef<number>(0);
  const ctxStartRef = useRef<number>(0);
  const pausedAtRef = useRef<number>(0);
  const currentTimeRef = useRef<number>(0);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return ctxRef.current;
  }, []);

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
    setIsPlaying(false);
    setCurrentTime(0);
    currentTimeRef.current = 0;
    pausedAtRef.current = 0;
  }, []);

  const pause = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
    setIsPlaying(false);
    pausedAtRef.current = currentTimeRef.current;
  }, []);

  const start = useCallback(() => {
    const ctx = getCtx();
    if (ctx.state === "suspended") ctx.resume();

    const [beatsPerBar] = content.timeSignature;
    const totalBeats = content.bars * beatsPerBar;
    const totalDuration = totalBeats * (60 / content.bpm);
    const fromTime = pausedAtRef.current;

    const scheduleFrom = (offset: number) => {
      content.rhythm.pattern.forEach((ev) => {
        const t = (ev.beat * 60) / content.bpm;
        if (t >= offset - 0.01 && t < offset + totalDuration) {
          const when = ctx.currentTime + (t - offset);
          if (ev.type === "kick") playKick(ctx, when);
          else playSnare(ctx, when);
        }
      });

      content.chords.forEach((c) => {
        const notes = chordToNotes[c.chord];
        if (!notes) return;
        const barStart = beatToSeconds(content, c.barIndex, 0);
        if (barStart >= offset - 0.01 && barStart < offset + totalDuration) {
          const when = ctx.currentTime + (barStart - offset);
          notes.forEach((note, i) => {
            playTone(ctx, noteToFreq(note), when + i * 0.05, 0.4, "sine", 0.12);
          });
        }
      });

      content.melody.forEach((m) => {
        const t = beatToSeconds(content, m.barIndex, m.beat);
        if (t >= offset - 0.01 && t < offset + totalDuration) {
          const when = ctx.currentTime + (t - offset);
          const duration = m.duration * (60 / content.bpm);
          playTone(ctx, noteToFreq(m.note), when, duration, "sine", 0.2);
        }
      });
    };

    scheduleFrom(fromTime);
    logicalStartRef.current = fromTime;
    ctxStartRef.current = ctx.currentTime;
    setIsPlaying(true);

    const animate = () => {
      const now = ctx.currentTime;
      const nextTime = logicalStartRef.current + (now - ctxStartRef.current);
      currentTimeRef.current = nextTime;
      setCurrentTime(nextTime);
      if (nextTime >= totalDuration) {
        stop();
        return;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
  }, [content, getCtx, stop]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return { isPlaying, currentTime, start, stop, pause, seek: (t: number) => { pausedAtRef.current = t; setCurrentTime(t); } };
}
