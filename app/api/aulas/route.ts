import { NextRequest, NextResponse } from 'next/server';
import { mockClases } from '@/lib/mock-data';

/**
 * GET /api/aulas - Obtiene todas las aulas del sistema
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');

    if (search) {
      const results = mockClases.filter(
        (a) =>
          a.Nombre.toLowerCase().includes(search.toLowerCase())
      );
      return NextResponse.json(results);
    }

    return NextResponse.json(mockClases);
  } catch (error: any) {
    console.error('[API] Error en GET aulas:', error);
    return NextResponse.json(
      { error: error.message || 'Error al obtener aulas' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/aulas - Crea una nueva aula
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.Nombre) {
      return NextResponse.json(
        { error: 'El nombre del aula es requerido' },
        { status: 400 }
      );
    }

    const newAula = {
      ClaseId: Math.max(...mockClases.map((a) => a.ClaseId || 0)) + 1,
      ...body,
    };

    mockClases.push(newAula);

    return NextResponse.json(newAula, { status: 201 });
  } catch (error: any) {
    console.error('[API] Error en POST aulas:', error);
    return NextResponse.json(
      { error: error.message || 'Error al crear aula' },
      { status: 500 }
    );
  }
}
