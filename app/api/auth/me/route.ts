import { NextRequest, NextResponse } from 'next/server';
import { getUserById } from '@/lib/services/auth.service';
import { verifyToken } from '@/lib/services/auth.service';

/**
 * GET /api/auth/me - Obtiene la información del usuario autenticado
 */
export async function GET(request: NextRequest) {
  try {
    // Obtener el token del header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    // Obtener el usuario de la BD para verificar que sigue siendo válido
    const user = await getUserById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // No retornar el hash de la contraseña
    const userWithoutPassword = {
      ...user,
      PasswordHash: '',
    };

    return NextResponse.json(userWithoutPassword);
  } catch (error: any) {
    console.error('[API] Error en /auth/me:', error);
    return NextResponse.json(
      { error: error.message || 'Invalid token' },
      { status: 401 }
    );
  }
}
