import { NextRequest, NextResponse } from 'next/server';
import { LoginRequest } from '@/lib/types';
import { mockUsers } from '@/lib/mock-data';
import { createTokenEdge } from '@/lib/auth-edge';

/**
 * POST /api/auth/login - Autentica un usuario
 */
export async function POST(request: NextRequest) {
  try {
    console.log('[v0] Login attempt started');
    const body: LoginRequest = await request.json();
    console.log('[v0] Request body received:', { email: body.email });

    // Validar entrada
    if (!body.email || !body.password) {
      console.log('[v0] Missing email or password');
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Buscar usuario en mock data (para desarrollo/testing)
    const user = mockUsers.find((u) => u.Email.toLowerCase() === body.email.toLowerCase());
    console.log('[v0] User search result:', user ? 'Found' : 'Not found');

    if (!user) {
      console.log('[v0] User not found for email:', body.email);
      return NextResponse.json(
        { error: 'Usuario o contraseña inválidos' },
        { status: 401 }
      );
    }

    // Para desarrollo, aceptamos cualquier contraseña que comience con "test"
    // En producción, esto debe conectar a MSSQL y validar con bcryptjs
    const isValidPassword = 
      body.password === 'test123' || 
      body.password === 'testing' ||
      (process.env.NODE_ENV === 'development');

    console.log('[v0] Password validation:', isValidPassword);

    if (!isValidPassword) {
      console.log('[v0] Invalid password');
      return NextResponse.json(
        { error: 'Usuario o contraseña inválidos' },
        { status: 401 }
      );
    }

    // Crear token usando la versión edge-compatible
    console.log('[v0] Creating token for user:', user.UserId);
    const token = await createTokenEdge(user.UserId, user.Email, user.Role);
    console.log('[v0] Token created successfully');

    return NextResponse.json({
      success: true,
      token,
      user: {
        UserId: user.UserId,
        Email: user.Email,
        Role: user.Role,
        NombreCompleto: user.NombreCompleto,
      },
    });
  } catch (error: any) {
    console.error('[v0] Error en login:', error);
    return NextResponse.json(
      { error: error.message || 'Error en autenticación' },
      { status: 500 }
    );
  }
}
