import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = ["/", "/login", "/signup"];
const protectedPrefixes = ["/dashboard", "/whatsapp", "/contacts", "/chat", "/campaigns"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = protectedPrefixes.some((p) => pathname === p || pathname.startsWith(p + "/"));
  const isPublic = publicRoutes.some((p) => pathname === p);
  const isApiAuth = pathname.startsWith("/api/auth");
  const isApiPublic = pathname.startsWith("/api/public");
  const isApiWebhook = pathname.startsWith("/api/webhook");

  if (isPublic || isApiAuth || isApiPublic || isApiWebhook) {
    return NextResponse.next();
  }

  if (isProtected) {
    const sessionCookie = request.cookies.get("next-auth.session-token")?.value
      ?? request.cookies.get("__Secure-next-auth.session-token")?.value;

    if (!sessionCookie) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
  ],
};
