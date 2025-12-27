import { NextRequest, NextResponse } from "next/server";
import {
  defaultLocale,
  isLocaleSegment,
  localeCookie,
} from "./app/i18n/settings";
import { getLocaleFromPathname } from "./app/i18n/pathname";

const PUBLIC_FILE = /\.(.*)$/;

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/assets") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const localeInPath = getLocaleFromPathname(pathname);
  const cookieLocale = request.cookies.get(localeCookie)?.value;
  const resolvedLocale = isLocaleSegment(cookieLocale)
    ? cookieLocale
    : defaultLocale;
  const activeLocale = localeInPath ?? resolvedLocale;

  if (!localeInPath) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = `/${resolvedLocale}${pathname === "/" ? "" : pathname}`;
    const response = NextResponse.redirect(redirectUrl);
    response.cookies.set(localeCookie, resolvedLocale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    return response;
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", activeLocale);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  if (cookieLocale !== localeInPath) {
    response.cookies.set(localeCookie, localeInPath, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
