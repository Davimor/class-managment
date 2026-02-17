import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/services/auth.service';

// Rutas públicas que no requieren autenticación
const publicRoutes = ['/', '/api/auth/login'];

// Rutas que requieren ciertos roles
const roleBasedRoutes: Record<string, string[]> = {
  '/dashboard/admin': ['admin'],
  '/dashboard/reportes': ['admin', 'maestro'],
};

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Verificar si es ruta pública
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Obtener token del header
  const token = request.headers.get('authorization')?.split(' ')[1];

  if (!token) {
    // Si es una ruta protegida sin token, redirigir a login
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
  }

  try {
    // Verificar el token
    const decoded = verifyToken(token || '');

    // Verificar permisos de rol
    const allowedRoles = roleBasedRoutes[pathname];
    if (allowedRoles && !allowedRoles.includes(decoded.role)) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Agregar información del usuario al header para usar en la ruta
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', decoded.userId);
    requestHeaders.set('x-user-email', decoded.email);
    requestHeaders.set('x-user-role', decoded.role);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Para rutas del cliente, redirigir a login
    return NextResponse.redirect(new URL('/', request.url));
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
