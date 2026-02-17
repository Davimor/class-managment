import { NextRequest, NextResponse } from 'next/server';
import { verifyTokenEdge } from '@/lib/auth-edge';
import { mockUsers } from '@/lib/mock-data';

/**
 * GET /api/users - Obtiene todos los usuarios (solo admin)
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar token y rol
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = await verifyTokenEdge(token);

    if (decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Usar mock data para desarrollo
    const usersWithoutPasswords = mockUsers.map((user) => ({
      ...user,
      PasswordHash: '',
    }));

    return NextResponse.json(usersWithoutPasswords);
  } catch (error: any) {
    console.error('[API] Error en GET users:', error);
    return NextResponse.json(
      { error: error.message || 'Error al obtener usuarios' },
      { status: 500 }
    );
  }
}
