import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

/**
 * 鉴权：仅本人可操作
 */
async function getProjectForUser(projectId: string, userId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });
  if (!project) return null;
  if (project.userId !== userId) return "forbidden";
  return project;
}

/**
 * GET /api/projects/[id] - 获取单条作品（含 content）
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const { id } = await params;
  const project = await getProjectForUser(id, session.user.id);

  if (!project) {
    return NextResponse.json({ error: "作品不存在" }, { status: 404 });
  }
  if (project === "forbidden") {
    return NextResponse.json({ error: "无权限访问该作品" }, { status: 403 });
  }

  return NextResponse.json({
    id: project.id,
    title: project.title,
    content: project.content,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  });
}

/**
 * PUT /api/projects/[id] - 更新作品
 * Body: { title?: string, content?: string }
 */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const { id } = await params;
  const project = await getProjectForUser(id, session.user.id);

  if (!project) {
    return NextResponse.json({ error: "作品不存在" }, { status: 404 });
  }
  if (project === "forbidden") {
    return NextResponse.json({ error: "无权限修改该作品" }, { status: 403 });
  }

  let body: { title?: string; content?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "请求体必须是合法 JSON" }, { status: 400 });
  }

  const updates: { title?: string; content?: string } = {};

  if (body.title !== undefined) {
    if (typeof body.title !== "string" || body.title.trim() === "") {
      return NextResponse.json({ error: "标题不能为空" }, { status: 400 });
    }
    updates.title = body.title.trim();
  }

  if (body.content !== undefined) {
    if (typeof body.content !== "string") {
      return NextResponse.json({ error: "content 必须为字符串" }, { status: 400 });
    }
    try {
      JSON.parse(body.content);
    } catch {
      return NextResponse.json({ error: "content 必须是合法 JSON 字符串" }, { status: 400 });
    }
    updates.content = body.content;
  }

  await prisma.project.update({
    where: { id },
    data: updates,
  });

  return new NextResponse(null, { status: 200 });
}

/**
 * DELETE /api/projects/[id] - 删除作品
 */
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const { id } = await params;
  const project = await getProjectForUser(id, session.user.id);

  if (!project) {
    return NextResponse.json({ error: "作品不存在" }, { status: 404 });
  }
  if (project === "forbidden") {
    return NextResponse.json({ error: "无权限删除该作品" }, { status: 403 });
  }

  await prisma.project.delete({
    where: { id },
  });

  return new NextResponse(null, { status: 204 });
}
