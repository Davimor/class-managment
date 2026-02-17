import { NextRequest, NextResponse } from 'next/server';

// Middleware desactivado - permitir acceso libre a todo
export async function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
