import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// Создаём next-intl middleware
const intlMiddleware = createMiddleware(routing);

// Оборачиваем в кастомный middleware
export function middleware(req: NextRequest) {
  const userAgent = req.headers.get('user-agent') || '';
  const isMobile = /mobile|android|iphone|ipad/i.test(userAgent);

  const { pathname } = req.nextUrl;

  // Разрешенные маршруты для мобильных устройств
  const allowedMobileRoutes = ['/', '/login', '/register'];

  if (isMobile && !allowedMobileRoutes.includes(pathname)) {
    return new NextResponse(
      'Access Denied. Mobile devices are not allowed on this page.',
      { status: 403 }
    );
  }

  // Возвращаем intl middleware, если доступ разрешён
  return intlMiddleware(req);
}

// Конфигурация для покрытия всех маршрутов (без API и статики)
export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)", "/", "/(en|ru|kz)/:path*"],
};
