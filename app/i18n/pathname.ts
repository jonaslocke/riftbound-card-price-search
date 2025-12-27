import { isLocaleSegment, type LocaleSegment } from "./settings";

export function getLocaleFromPathname(
  pathname: string
): LocaleSegment | null {
  const [segment] = pathname.split("/").filter(Boolean);
  return isLocaleSegment(segment) ? segment : null;
}

export function stripLocaleFromPathname(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return "/";
  if (isLocaleSegment(segments[0])) segments.shift();
  const rest = `/${segments.join("/")}`;
  return rest === "" ? "/" : rest;
}

export function buildLocalePath(locale: LocaleSegment, pathname: string) {
  const rest = stripLocaleFromPathname(pathname);
  if (rest === "/") return `/${locale}`;
  return `/${locale}${rest}`;
}

export function isLocaleRoot(pathname: string) {
  return stripLocaleFromPathname(pathname) === "/";
}
