import { NextRequest, NextResponse } from 'next/server';
import { mockCursos } from '@/lib/mock-data';

/**
 * GET /api/cursos - Lista todos los cursos o filtra por tipo
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tipo = searchParams.get('tipo') as 'fundamentacion' | 'pedagogia' | 'dogmatico' | null;
    const search = searchParams.get('search');

    if (tipo) {
      const cursos = mockCursos.filter((c: any) => c.Tipo === tipo);
      return NextResponse.json(cursos);
    }

    if (search) {
      const results = mockCursos.filter(
        (c: any) =>
          c.Nombre.toLowerCase().includes(search.toLowerCase()) ||
          c.Descripcion?.toLowerCase().includes(search.toLowerCase())
      );
      return NextResponse.json(results);
    }

    return NextResponse.json(mockCursos);
  } catch (error: any) {
    console.error('[API] Error en GET cursos:', error);
    return NextResponse.json(
      { error: error.message || 'Error al obtener cursos' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cursos - Crea un nuevo curso
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.Nombre || !body.Tipo) {
      return NextResponse.json(
        { error: 'Nombre y tipo de curso son requeridos' },
        { status: 400 }
      );
    }

    const newCurso = {
      CursoId: Math.max(...mockCursos.map((c: any) => c.CursoId || 0)) + 1,
      ...body,
    };

    mockCursos.push(newCurso);
    return NextResponse.json(newCurso, { status: 201 });
  } catch (error: any) {
    console.error('[API] Error en POST cursos:', error);
    return NextResponse.json(
      { error: error.message || 'Error al crear curso' },
      { status: 500 }
    );
  }
}
