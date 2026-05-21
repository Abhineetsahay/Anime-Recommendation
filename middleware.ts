import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (token) {
    const payload = verifyToken(token);

    if (payload && request.nextUrl.pathname === "/") {
      return NextResponse.redirect(
        new URL("/discover", request.url)
      );
    }
  }

  return NextResponse.next();
}