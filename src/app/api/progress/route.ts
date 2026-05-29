import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

/**
 * GET /api/progress - 获取当前用户的全部习题进度
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const rows = await prisma.progress.findMany({
    where: { userId: session.user.id },
    select: { levelId: true, correct: true, total: true, completed: true },
  });

  return NextResponse.json(rows);
}

/**
 * POST /api/progress - upsert 单个关卡进度（取较优成绩）
 * Body: { levelId: string, correct: number, total: number }
 */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  let body: { levelId?: string; correct?: number; total?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "请求体必须是合法 JSON" }, { status: 400 });
  }

  const { levelId, correct, total } = body;
  if (!levelId || typeof levelId !== "string") {
    return NextResponse.json({ error: "levelId 不能为空" }, { status: 400 });
  }
  if (typeof correct !== "number" || typeof total !== "number" || total <= 0) {
    return NextResponse.json({ error: "correct/total 必须为有效数字" }, { status: 400 });
  }

  const userId = session.user.id;
  const existing = await prisma.progress.findUnique({
    where: { userId_levelId: { userId, levelId } },
  });

  // 取较优成绩（已答对题数更高者）
  const bestCorrect = existing ? Math.max(existing.correct, correct) : correct;
  const completed = bestCorrect >= total;

  await prisma.progress.upsert({
    where: { userId_levelId: { userId, levelId } },
    create: { userId, levelId, correct: bestCorrect, total, completed },
    update: { correct: bestCorrect, total, completed },
  });

  return NextResponse.json({ levelId, correct: bestCorrect, total, completed });
}
