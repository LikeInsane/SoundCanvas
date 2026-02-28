"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import type { ProjectContent } from "@/lib/sandbox-types";
import { DEFAULT_CONTENT } from "@/lib/sandbox-types";
import { RhythmTrack } from "@/components/sandbox/RhythmTrack";
import { ChordsTrack } from "@/components/sandbox/ChordsTrack";
import { MelodyTrack } from "@/components/sandbox/MelodyTrack";
import { useAudioEngine } from "@/lib/audio-engine";

/**
 * 沙盒主体（使用 useSearchParams，需在 Suspense 内）
 */
export function SandboxContent() {
  const searchParams = useSearchParams();
  const projectIdFromQuery = searchParams.get("id");

  const [projectId, setProjectId] = useState<string | null>(null);
  const [title, setTitle] = useState("未命名作品");
  const [content, setContent] = useState<ProjectContent>(() => ({ ...DEFAULT_CONTENT }));
  const [loading, setLoading] = useState(!!projectIdFromQuery);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const { isPlaying, currentTime, start, stop, pause } = useAudioEngine(content);

  useEffect(() => {
    if (!projectIdFromQuery) {
      setLoading(false);
      setProjectId(null);
      setTitle("未命名作品");
      setContent({ ...DEFAULT_CONTENT });
      return;
    }
    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    fetch(`/api/projects/${projectIdFromQuery}`)
      .then((res) => {
        if (!res.ok) return res.json().then((d: { error?: string }) => Promise.reject(d));
        return res.json();
      })
      .then((data: { id: string; title: string; content: string }) => {
        if (cancelled) return;
        setProjectId(data.id);
        setTitle(data.title);
        try {
          const parsed = JSON.parse(data.content) as ProjectContent;
          setContent(parsed);
        } catch {
          setContent({ ...DEFAULT_CONTENT });
        }
      })
      .catch((err: { error?: string }) => {
        if (!cancelled) setLoadError(err?.error || "加载失败");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [projectIdFromQuery]);

  const updateContent = useCallback((updater: (prev: ProjectContent) => ProjectContent) => {
    setContent(updater);
  }, []);

  const handleSave = async () => {
    setSaveStatus("saving");
    setSaveMessage(null);
    const body = { title: title.trim(), content: JSON.stringify(content) };
    try {
      if (projectId) {
        const res = await fetch(`/api/projects/${projectId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error((data as { error?: string }).error || "保存失败");
        }
        setSaveStatus("saved");
        setSaveMessage("已保存");
      } else {
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error((data as { error?: string }).error || "保存失败");
        }
        const data = (await res.json()) as { id: string };
        setProjectId(data.id);
        setSaveStatus("saved");
        setSaveMessage("已保存");
        window.history.replaceState(null, "", `/sandbox?id=${data.id}`);
      }
    } catch (e) {
      setSaveStatus("error");
      setSaveMessage(e instanceof Error ? e.message : "保存失败");
    }
    setTimeout(() => {
      setSaveStatus("idle");
      setSaveMessage(null);
    }, 2000);
  };

  const handleSaveAs = async () => {
    const newTitle = window.prompt("另存为标题", title + " 副本")?.trim();
    if (!newTitle) return;
    setSaveStatus("saving");
    setSaveMessage(null);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, content: JSON.stringify(content) }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error || "另存为失败");
      }
      const data = (await res.json()) as { id: string };
      setProjectId(data.id);
      setTitle(newTitle);
      setSaveStatus("saved");
      setSaveMessage("已另存为");
      window.history.replaceState(null, "", `/sandbox?id=${data.id}`);
    } catch (e) {
      setSaveStatus("error");
      setSaveMessage(e instanceof Error ? e.message : "另存为失败");
    }
    setTimeout(() => {
      setSaveStatus("idle");
      setSaveMessage(null);
    }, 2000);
  };

  if (loading) {
    return (
      <main className="min-h-screen pt-16 flex items-center justify-center">
        <p className="text-brand-muted">加载中...</p>
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400">{loadError}</p>
          <a href="/sandbox" className="mt-4 inline-block text-brand-cta text-sm">返回新建</a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-16 pb-12">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field max-w-[200px]"
            placeholder="作品标题"
          />
          <label className="flex items-center gap-2 text-sm text-brand-muted">
            BPM
            <input
              type="number"
              min={40}
              max={240}
              value={content.bpm}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10);
                if (!Number.isNaN(v)) setContent((c) => ({ ...c, bpm: Math.max(40, Math.min(240, v)) }));
              }}
              className="input-field w-16 text-center"
            />
          </label>
          <div className="flex items-center gap-2">
            {!isPlaying ? (
              <button type="button" onClick={() => start()} className="btn-primary text-sm">
                播放
              </button>
            ) : (
              <button type="button" onClick={() => pause()} className="btn-secondary text-sm">
                暂停
              </button>
            )}
            <button type="button" onClick={() => stop()} className="btn-secondary text-sm">
              停止
            </button>
          </div>
          <button type="button" onClick={handleSave} className="btn-primary text-sm" disabled={saveStatus === "saving"}>
            {saveStatus === "saving" ? "保存中..." : "保存"}
          </button>
          <button type="button" onClick={handleSaveAs} className="btn-secondary text-sm" disabled={saveStatus === "saving"}>
            另存为
          </button>
          {saveMessage && (
            <span className={saveStatus === "error" ? "text-red-400 text-sm" : "text-brand-muted text-sm"}>
              {saveMessage}
            </span>
          )}
        </div>

        <div className="space-y-6">
          <section>
            <h2 className="text-sm font-medium text-brand-muted mb-2">节奏轨</h2>
            <RhythmTrack content={content} onContentChange={updateContent} currentTime={currentTime} />
          </section>
          <section>
            <h2 className="text-sm font-medium text-brand-muted mb-2">和弦轨</h2>
            <ChordsTrack content={content} onContentChange={updateContent} currentTime={currentTime} />
          </section>
          <section>
            <h2 className="text-sm font-medium text-brand-muted mb-2">旋律轨</h2>
            <MelodyTrack content={content} onContentChange={updateContent} currentTime={currentTime} />
          </section>
        </div>
      </div>
    </main>
  );
}
