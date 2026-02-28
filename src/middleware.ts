import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * 保护需登录的路由：未登录访问 /sandbox、/projects 时重定向到 /login
 */
export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isProtected =
    req.nextUrl.pathname.startsWith("/sandbox") ||
    req.nextUrl.pathname.startsWith("/projects");

  if (isProtected && !token) {
    const loginUrl = new URL("/login", req.url);
    const fullPath = req.nextUrl.pathname + (req.nextUrl.search || "");
    loginUrl.searchParams.set("callbackUrl", fullPath);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/sandbox/:path*", "/projects/:path*"],
};
