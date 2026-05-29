/**
 * 沙盒撤销/重做：对 content 维护历史栈（最多 20 步），深拷贝避免引用污染
 */

import { useState, useCallback } from "react";
import type { ProjectContent } from "./sandbox-types";

const MAX_HISTORY = 20;

function deepClone(c: ProjectContent): ProjectContent {
  return JSON.parse(JSON.stringify(c)) as ProjectContent;
}

interface HistoryState {
  past: ProjectContent[];
  current: ProjectContent;
  future: ProjectContent[];
}

export interface UseSandboxHistoryResult {
  content: ProjectContent;
  /** 直接设置 content（加载、预设、重置用），会清空历史 */
  setContentDirect: (content: ProjectContent) => void;
  /** 通过 updater 修改 content，会压栈并可撤销 */
  updateContent: (updater: (prev: ProjectContent) => ProjectContent) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export function useSandboxHistory(initialContent: ProjectContent): UseSandboxHistoryResult {
  const [state, setState] = useState<HistoryState>(() => ({
    past: [],
    current: deepClone(initialContent),
    future: [],
  }));

  const setContentDirect = useCallback((content: ProjectContent) => {
    setState({ past: [], current: deepClone(content), future: [] });
  }, []);

  const updateContent = useCallback((updater: (prev: ProjectContent) => ProjectContent) => {
    setState((s) => {
      const next = deepClone(updater(s.current));
      const nextPast = [...s.past, deepClone(s.current)].slice(-MAX_HISTORY);
      return { past: nextPast, current: next, future: [] };
    });
  }, []);

  const undo = useCallback(() => {
    setState((s) => {
      if (s.past.length === 0) return s;
      const prev = s.past[s.past.length - 1];
      return {
        past: s.past.slice(0, -1),
        current: deepClone(prev),
        future: [deepClone(s.current), ...s.future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setState((s) => {
      if (s.future.length === 0) return s;
      const next = s.future[0];
      return {
        past: [...s.past, deepClone(s.current)].slice(-MAX_HISTORY),
        current: deepClone(next),
        future: s.future.slice(1),
      };
    });
  }, []);

  return {
    content: state.current,
    setContentDirect,
    updateContent,
    undo,
    redo,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
  };
}
