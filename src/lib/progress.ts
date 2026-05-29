/**
 * 习题进度存储：基于 localStorage（当前登录入口隐藏，无需后端）。
 * 以 levelId 为键记录已答对题数与完成状态，预留后续接入后端的扩展点。
 */

const STORAGE_KEY = "soundcanvas:exercise-progress";
const ACTIVITY_KEY = "soundcanvas:activity-dates";

export interface LevelProgress {
  /** 已答对题数 */
  correct: number;
  /** 该关卡总题数 */
  total: number;
  /** 是否已完成（correct >= total） */
  completed: boolean;
}

/** 掌握度等级 */
export type Mastery = "none" | "bronze" | "silver" | "gold";

type ProgressMap = Record<string, LevelProgress>;

function readAll(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ProgressMap) : {};
  } catch {
    return {};
  }
}

function writeAll(map: ProgressMap) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // 写入失败（如隐私模式）时静默忽略，不影响答题流程
  }
}

/** 读取单个关卡进度 */
export function getLevelProgress(levelId: string): LevelProgress | null {
  const all = readAll();
  return all[levelId] ?? null;
}

/** 保存单个关卡进度（取较优成绩）。登录态下同时异步推送到后端 */
export function saveLevelProgress(levelId: string, correct: number, total: number) {
  const all = readAll();
  const prev = all[levelId];
  const bestCorrect = prev ? Math.max(prev.correct, correct) : correct;
  all[levelId] = {
    correct: bestCorrect,
    total,
    completed: bestCorrect >= total,
  };
  writeAll(all);
  recordActivity();
  // 尝试推送到后端；未登录会返回 401，静默忽略
  pushLevelProgress(levelId, bestCorrect, total);
}

/** 本地日期字符串（YYYY-MM-DD） */
function todayStr(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** 记录今日活跃（用于连续打卡） */
function recordActivity() {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(ACTIVITY_KEY);
    const dates: string[] = raw ? JSON.parse(raw) : [];
    const today = todayStr();
    if (!dates.includes(today)) {
      dates.push(today);
      window.localStorage.setItem(ACTIVITY_KEY, JSON.stringify(dates));
    }
  } catch {
    // 忽略写入失败
  }
}

/** 当前连续打卡天数（从今天或昨天往前连续计数） */
export function getStreak(): number {
  if (typeof window === "undefined") return 0;
  let dates: string[] = [];
  try {
    const raw = window.localStorage.getItem(ACTIVITY_KEY);
    dates = raw ? JSON.parse(raw) : [];
  } catch {
    return 0;
  }
  const set = new Set(dates);
  if (set.size === 0) return 0;

  const oneDay = 24 * 60 * 60 * 1000;
  const now = new Date();
  // 起点：若今天有活动从今天起，否则从昨天起（允许今天还没练）
  let cursor = set.has(todayStr(now)) ? now : new Date(now.getTime() - oneDay);
  let streak = 0;
  while (set.has(todayStr(cursor))) {
    streak += 1;
    cursor = new Date(cursor.getTime() - oneDay);
  }
  return streak;
}

/** 由关卡进度推导掌握度 */
export function masteryOf(p: LevelProgress | null | undefined): Mastery {
  if (!p || p.total <= 0 || p.correct <= 0) return "none";
  const ratio = p.correct / p.total;
  if (ratio >= 1) return "gold";
  if (ratio >= 0.8) return "silver";
  if (ratio >= 0.6) return "bronze";
  return "none";
}

/** 读取全部进度映射 */
export function getAllProgress(): Record<string, LevelProgress> {
  return readAll();
}

/** 异步推送单条进度到后端（fire-and-forget） */
function pushLevelProgress(levelId: string, correct: number, total: number) {
  if (typeof window === "undefined") return;
  void fetch("/api/progress", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ levelId, correct, total }),
  }).catch(() => {
    // 网络失败或未登录时忽略，本地仍有记录
  });
}

/**
 * 登录后调用：从后端拉取进度并与本地合并（取较优成绩），把本地更优的再推回后端。
 * 返回是否成功同步（用于触发界面刷新）。
 */
export async function syncProgressWithServer(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  let serverRows: Array<{ levelId: string; correct: number; total: number; completed: boolean }>;
  try {
    const res = await fetch("/api/progress");
    if (!res.ok) return false; // 未登录等
    serverRows = await res.json();
  } catch {
    return false;
  }

  const local = readAll();
  const serverMap: ProgressMap = {};
  for (const r of serverRows) {
    serverMap[r.levelId] = { correct: r.correct, total: r.total, completed: r.completed };
  }

  // 合并：每个关卡取 correct 更高者
  const merged: ProgressMap = { ...local };
  const ids = new Set([...Object.keys(local), ...Object.keys(serverMap)]);
  ids.forEach((id) => {
    const l = local[id];
    const s = serverMap[id];
    const total = (l?.total ?? s?.total) || 0;
    const bestCorrect = Math.max(l?.correct ?? 0, s?.correct ?? 0);
    merged[id] = { correct: bestCorrect, total, completed: total > 0 && bestCorrect >= total };
    // 本地更优则推回后端
    if (total > 0 && (s?.correct ?? -1) < bestCorrect) {
      pushLevelProgress(id, bestCorrect, total);
    }
  });

  writeAll(merged);
  return true;
}

/** 读取某分类下所有关卡进度（用于在习题中心展示 x/y） */
export function getCategoryProgress(levelIds: string[]): { completed: number; total: number } {
  const all = readAll();
  let completed = 0;
  for (const id of levelIds) {
    if (all[id]?.completed) completed += 1;
  }
  return { completed, total: levelIds.length };
}

/** 清空全部进度（含打卡记录） */
export function resetAllProgress() {
  writeAll({});
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(ACTIVITY_KEY);
    } catch {
      // 忽略
    }
  }
}
