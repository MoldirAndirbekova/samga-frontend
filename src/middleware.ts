import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export const config = {
  matcher: [
    '/((?!api|trpc|_next/static|_next/image|_vercel|favicon.ico|.*\\..*).*)',
    '/',
    '/(en|ru|kz)/:path*'
  ]
};

// Публичные маршруты (без учета локали)
const publicRoutes = ['/', '/login', '/register', '/reset-password'];

// Функция для проверки, является ли маршрут публичным
function isPublicRoute(pathname: string): boolean {
  // Извлекаем путь без локали
  const segments = pathname.split('/');
  if (segments.length >= 2 && ['en', 'ru', 'kz'].includes(segments[1])) {
    const pathWithoutLocale = '/' + segments.slice(2).join('/');
    return publicRoutes.includes(pathWithoutLocale) || pathWithoutLocale === '/';
  }
  return publicRoutes.includes(pathname);
}

export function middleware(req: NextRequest) {
  // Mobile device check
  const userAgent = req.headers.get('user-agent') || '';
  const isMobile = /mobile|android|iphone|ipad/i.test(userAgent);

  const { pathname } = req.nextUrl;
  const token = req.cookies.get('access_token')?.value;

  // Проверяем, является ли маршрут публичным
  const isPublic = isPublicRoute(pathname);

  // Сначала выполняем проверку i18n middleware
  const intlResponse = intlMiddleware(req);
  
  // Если i18n middleware возвращает редирект, пропускаем дальнейшие проверки
  if (intlResponse instanceof NextResponse && intlResponse.headers.get('location')) {
    return intlResponse;
  }

  // Редирект неавторизованных пользователей с защищенных маршрутов
  if (!isPublic && !token) {
    // Создаем URL с сохранением локали
    const locale = pathname.split('/')[1];
    const baseUrl = ['en', 'ru', 'kz'].includes(locale) 
      ? `/${locale}/login`
      : '/login';
    
    const url = new URL(baseUrl, req.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  // Ограничение доступа с мобильных устройств для защищенных маршрутов
  if (isMobile && !isPublic) {
    return new NextResponse(
      'Access Denied. Mobile devices are not allowed on this page.',
      { status: 403 }
    );
  }

  // Если все проверки пройдены, возвращаем результат i18n middleware
  return intlResponse;
}