import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { LOCALE_COOKIE, defaultLocale, i18nConfig, type Locale } from './i18nConfig';
import { apiLimiter, authLimiter } from './lib/rate-limit';

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

const getClientIp = (request: NextRequest): string => {
  // Lấy IP từ headers (cho Vercel và các proxy khác)
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown';
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  return 'unknown';
};

const addSecurityHeaders = (response: NextResponse): NextResponse => {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Access-Control-Allow-Origin', 'https://empire-tech-pi.vercel.app');
  return response;
};

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Kiểm tra rate limit cho API routes
  if (pathname.startsWith('/api')) {
    const ip = getClientIp(request);

    // Rate limit cho auth endpoints: 5 requests/15 phút
    if (pathname.startsWith('/api/auth/')) {
      const result = authLimiter.check(
        `auth:${ip}`,
        5,
        15 * 60 * 1000 // 15 phút
      );

      if (!result.success) {
        const retryAfter = Math.ceil((result.reset - Date.now()) / 1000);
        return addSecurityHeaders(
          new NextResponse(
            JSON.stringify({
              error: 'Too many requests',
              message: 'Vui lòng thử lại sau',
            }),
            {
              status: 429,
              headers: {
                'Content-Type': 'application/json',
                'X-RateLimit-Limit': '5',
                'X-RateLimit-Remaining': '0',
                'Retry-After': retryAfter.toString(),
              },
            }
          )
        );
      }

      const response = NextResponse.next();
      response.headers.set('X-RateLimit-Limit', '5');
      response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
      return addSecurityHeaders(response);
    }

    // Rate limit cho các API khác: 100 requests/phút
    const result = apiLimiter.check(
      `api:${ip}`,
      100,
      60 * 1000 // 1 phút
    );

    if (!result.success) {
      const retryAfter = Math.ceil((result.reset - Date.now()) / 1000);
      return addSecurityHeaders(
        new NextResponse(
          JSON.stringify({
            error: 'Too many requests',
            message: 'Vui lòng thử lại sau',
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'X-RateLimit-Limit': '100',
              'X-RateLimit-Remaining': '0',
              'Retry-After': retryAfter.toString(),
            },
          }
        )
      );
    }

    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', '100');
    response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
    return addSecurityHeaders(response);
  }

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/admin') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return addSecurityHeaders(NextResponse.next());
  }

  const hasLocalePrefix = i18nConfig.locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
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

  return addSecurityHeaders(response);
}

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
};
