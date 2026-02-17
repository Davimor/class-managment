import { NextRequest, NextResponse } from 'next/server';
import { getProgenitoresToAlumno } from '@/lib/services/alumnos.service';
import { verifyToken } from '@/lib/services/auth.service';

/**
 * GET /api/alumnos/[id]/progenitores - Obtiene los progenitores de un alumno
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verificar autenticación
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    verifyToken(token); // Lanzará error si es inválido

    if (!id) {
      return NextResponse.json({ error: 'ID de alumno requerido' }, { status: 400 });
    }

    const progenitores = await getProgenitoresToAlumno(parseInt(id));
    return NextResponse.json(progenitores);
  } catch (error: any) {
    console.error('[API] Error en GET alumnos progenitores:', error);
    return NextResponse.json(
      { error: error.message || 'Error al obtener progenitores' },
      { status: 500 }
    );
  }
}
