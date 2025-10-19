// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;

  const { pathname } = req.nextUrl;

  // ✅ If logged in and trying to access login/signup, redirect to home
  if (token && pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // ✅ If not logged in and trying to access protected routes
  if (!token && pathname.startsWith("/chat")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // otherwise continue as normal
  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/chat/:path*"],
};
