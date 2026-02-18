import { NextRequest, NextResponse } from 'next/server';
import { mockAlumnos } from '@/lib/mock-data';

/**
 * GET /api/clases/[id]/alumnos - Obtiene los alumnos de una clase
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const claseId = parseInt(id);

    const alumnos = mockAlumnos.filter((a) => a.ClaseId === claseId);
    return NextResponse.json(alumnos);
  } catch (error: any) {
    console.error('[API] Error en GET clases alumnos:', error);
    return NextResponse.json(
      { error: error.message || 'Error al obtener alumnos' },
      { status: 500 }
    );
  }
}
