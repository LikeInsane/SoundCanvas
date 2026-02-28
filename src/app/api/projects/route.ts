import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { validateProjectContent } from "@/lib/validate-content";

/**
 * GET /api/projects - 获取当前用户的作品列表（不含 content）
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json(projects);
}

/**
 * POST /api/projects - 新建作品
 * Body: { title: string, content: string }，content 为 JSON 字符串
 */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  let body: { title?: string; content?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "请求体必须是合法 JSON" }, { status: 400 });
  }

  const { title, content } = body;
  if (!title || typeof title !== "string" || title.trim() === "") {
    return NextResponse.json({ error: "标题不能为空" }, { status: 400 });
  }
  if (!content || typeof content !== "string") {
    return NextResponse.json({ error: "content 不能为空" }, { status: 400 });
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    return NextResponse.json({ error: "content 必须是合法 JSON 字符串" }, { status: 400 });
  }

  if (!parsed || typeof parsed !== "object") {
    return NextResponse.json({ error: "content 解析后必须是对象" }, { status: 400 });
  }

  const validationError = validateProjectContent(parsed);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const project = await prisma.project.create({
    data: {
      userId: session.user.id,
      title: title.trim(),
      content,
    },
  });

  return NextResponse.json({ id: project.id }, { status: 201 });
}
