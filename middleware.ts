import { NextRequest, NextResponse } from "next/server";

const ACCESS_TOKEN_COOKIE = "lp_access_token";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;

  const isPublicRoute = pathname === "/" || pathname === "/login";

  if (!token && !isPublicRoute)
    return NextResponse.redirect(new URL("/", request.url));

  if (token && isPublicRoute)
    return NextResponse.redirect(new URL("/onboarding", request.url));

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icons|images|svgs).*)"],
};
