import { NextRequest, NextResponse } from 'next/server';
import { comparePassword, createToken } from '@/lib/services/auth.service';
import { LoginRequest } from '@/lib/types';
import { mockUsers } from '@/lib/mock-data';

/**
 * POST /api/auth/login - Autentica un usuario
 */
export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();

    // Validar entrada
    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Buscar usuario en mock data (para desarrollo/testing)
    const user = mockUsers.find((u) => u.Email.toLowerCase() === body.email.toLowerCase());

    if (!user) {
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

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Usuario o contraseña inválidos' },
        { status: 401 }
      );
    }

    // Crear token
    const token = createToken(user.UserId, user.Email, user.Role);

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
    console.error('[API] Error en login:', error);
    return NextResponse.json(
      { error: error.message || 'Error en autenticación' },
      { status: 500 }
    );
  }
}
