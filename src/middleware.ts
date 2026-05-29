import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * 登录/注册已隐藏期间，沙盒与作品页不再强制跳转登录，直接放行
 */
export async function middleware(_req: NextRequest) {
  return NextResponse.next();
}
