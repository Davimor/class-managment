import { NextRequest, NextResponse } from 'next/server';
import { mockUsers } from '@/lib/mock-data';

/**
 * GET /api/users - Obtiene todos los usuarios
 */
export async function GET(request: NextRequest) {
  try {
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
