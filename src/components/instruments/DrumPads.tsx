"use client";

import { useCallback, useEffect, useState } from "react";
import { DRUM_KIT, playDrum, type DrumVoice } from "@/lib/drums";

/**
 * 架子鼓打击垫：点击或电脑键盘敲击各鼓件，敲击时高亮反馈。
 */
export function DrumPads() {
  const [active, setActive] = useState<Set<DrumVoice>>(new Set());

  const hit = useCallback((voice: DrumVoice) => {
    playDrum(voice);
    setActive((prev) => new Set(prev).add(voice));
    window.setTimeout(() => {
      setActive((prev) => {
        const next = new Set(prev);
        next.delete(voice);
        return next;
      });
    }, 120);
  }, []);

  useEffect(() => {
    const keyToVoice: Record<string, DrumVoice> = {};
    DRUM_KIT.forEach((d) => (keyToVoice[d.key] = d.id));
    const down = (e: KeyboardEvent) => {
      if (e.repeat || e.metaKey || e.ctrlKey) return;
      const voice = keyToVoice[e.key.toLowerCase()];
      if (!voice) return;
      e.preventDefault();
      hit(voice);
    };
    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, [hit]);

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {DRUM_KIT.map((d) => {
          const isActive = active.has(d.id);
          return (
            <button
              key={d.id}
              onMouseDown={() => hit(d.id)}
              className={`aspect-square rounded-2xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-100 select-none ${
                isActive
                  ? "bg-brand-cta border-brand-cta text-white scale-95"
                  : "bg-brand-card border-brand-border text-brand-text hover:border-brand-accent/40"
              }`}
            >
              <span className="text-sm font-semibold">{d.label}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded ${
                  isActive ? "bg-white/20" : "bg-brand-border/40 text-brand-muted"
                }`}
              >
                {d.key.toUpperCase()}
              </span>
            </button>
          );
        })}
      </div>
      <p className="text-xs text-brand-muted mt-6">
        提示：左手用 A S D F G 区域、右手用 J K L 区域，可双手配合打出连续节奏。
      </p>
    </div>
  );
}
