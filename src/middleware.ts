import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token');

    // Si no hay token y quiere ir al Home, mandar al login
    if (!token && request.nextUrl.pathname === '/') {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Si hay token y quiere ir al login, mandar al Home
    if (token && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register')) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/login', '/register'],
};
