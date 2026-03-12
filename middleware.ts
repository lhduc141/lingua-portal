import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ROUTES } from "@/config/routes";
import { ACCESS_TOKEN_COOKIE } from "@/lib/api/client";

const PUBLIC_ROUTES = ["/", ROUTES.LOGIN];
export const AUTH_ONLY_ROUTES = [
  ROUTES.ONBOARDING.ROOT,
  ROUTES.ONBOARDING.SURVEY,
  ROUTES.ONBOARDING.PLACEMENT,
  ROUTES.ONBOARDING.PLACEMENT_RESULT,
  ROUTES.DICTIONARY.ROOT,
  ROUTES.VOCABULARY,
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  // Chưa login → redirect về landing page
  if (!token && !isPublicRoute)
    return NextResponse.redirect(new URL(ROUTES.HOME, request.url));

  // Đã login + vào public routes (/, /login) → redirect về dashboard
  if (token && isPublicRoute)
    return NextResponse.redirect(new URL(ROUTES.DASHBOARD, request.url));

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icons|images).*)"],
};
