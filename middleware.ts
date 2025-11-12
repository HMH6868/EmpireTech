import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { LOCALE_COOKIE, defaultLocale, i18nConfig, type Locale } from './i18nConfig';

const PUBLIC_FILE = /\.(.*)$/;

function getLocaleFromCookie(request: NextRequest): Locale | null {
  const locale = request.cookies.get(LOCALE_COOKIE)?.value;
  return isValidLocale(locale) ? locale : null;
}

function getLocaleFromHeader(request: NextRequest): Locale | null {
  const header = request.headers.get('accept-locale');
  if (!header) {
    return null;
  }

  const preferredLocales = header
    .split(',')
    .map((item) => item.split(';')[0]?.trim())
    .filter(Boolean);

  for (const locale of preferredLocales) {
    const normalized = locale?.split('-')[0] as Locale | undefined;
    if (isValidLocale(locale)) {
      return locale as Locale;
    }
    if (normalized && isValidLocale(normalized)) {
      return normalized;
    }
  }

  return null;
}

function isValidLocale(locale: string | undefined | null): locale is Locale {
  return Boolean(locale && i18nConfig.locales.includes(locale as Locale));
}

function detectLocale(request: NextRequest): Locale {
  return getLocaleFromCookie(request) ?? getLocaleFromHeader(request) ?? defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || PUBLIC_FILE.test(pathname)) {
    return NextResponse.next();
  }

  const hasLocale = i18nConfig.locales.some((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`));

  if (hasLocale) {
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
