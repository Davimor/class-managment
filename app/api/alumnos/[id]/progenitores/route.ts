import { NextRequest, NextResponse } from 'next/server';
import { mockAlumnos, mockProgenitores } from '@/lib/mock-data';

/**
 * GET /api/alumnos/[id]/progenitores - Obtiene los progenitores de un alumno
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const alumnoId = parseInt(id);

    // Verificar que el alumno existe
    const alumno = mockAlumnos.find(a => a.AlumnoId === alumnoId);
    if (!alumno) {
      return NextResponse.json(
        { error: 'Alumno no encontrado' },
        { status: 404 }
      );
    }

    // Retornar todos los progenitores (en desarrollo, retornamos los disponibles)
    return NextResponse.json(mockProgenitores);
  } catch (error: any) {
    console.error('[API] Error en GET alumnos progenitores:', error);
    return NextResponse.json(
      { error: error.message || 'Error al obtener progenitores' },
      { status: 500 }
    );
  }
}
