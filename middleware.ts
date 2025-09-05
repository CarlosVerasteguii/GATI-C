import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('jwt')?.value;
  const { pathname } = request.nextUrl;

  // Si el usuario está logueado y trata de acceder a /login o sus subrutas, redirigir al dashboard.
  if (token && pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Si el usuario no está logueado y trata de acceder a una ruta protegida (cualquiera que no sea /login), redirigir a /login.
  if (!token && !pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // En cualquier otro caso (usuario logueado en ruta protegida, o usuario no logueado en /login), permitir el paso.
  return NextResponse.next();
}

// El matcher es clave: protege todo EXCEPTO los assets, las rutas de API, etc.
// Procesará /login para poder manejar la redirección de usuarios ya logueados.
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

