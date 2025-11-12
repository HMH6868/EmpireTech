import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { LOCALE_COOKIE, defaultLocale, i18nConfig, type Locale } from './i18nConfig';

const PUBLIC_FILE = /\.(.*)$/;

const isValidLocale = (locale?: string | null): locale is Locale =>
  Boolean(locale && i18nConfig.locales.includes(locale as Locale));

const getLocaleFromCookie = (request: NextRequest): Locale | null => {
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  return isValidLocale(cookieLocale) ? cookieLocale : null;
};

const getLocaleFromHeader = (request: NextRequest): Locale | null => {
  const acceptLanguage = request.headers.get('accept-language');
  if (!acceptLanguage) {
    return null;
  }

  const preferredLocales = acceptLanguage
    .split(',')
    .map((entry) => entry.split(';')[0]?.trim())
    .filter(Boolean);

  for (const locale of preferredLocales) {
    if (isValidLocale(locale)) {
      return locale;
    }
    const normalized = locale?.split('-')[0];
    if (isValidLocale(normalized)) {
      return normalized;
    }
  }

  return null;
};

const detectLocale = (request: NextRequest): Locale =>
  getLocaleFromCookie(request) ?? getLocaleFromHeader(request) ?? defaultLocale;

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || PUBLIC_FILE.test(pathname)) {
    return NextResponse.next();
  }

  const hasLocalePrefix = i18nConfig.locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (hasLocalePrefix) {
    return NextResponse.next();
  }

  const locale = detectLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname.startsWith('/') ? pathname : `/${pathname}`}`;

  const response = NextResponse.redirect(url);
  response.cookies.set({
    name: LOCALE_COOKIE,
    value: locale,
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  });

  return response;
}

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
};
