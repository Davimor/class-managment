import { NextRequest, NextResponse } from 'next/server';
import { mockMaestros } from '@/lib/mock-data';

/**
 * GET /api/maestros - Obtiene todos los maestros
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');

    if (search) {
      const results = mockMaestros.filter(
        (m) =>
          m.NombreCompleto.toLowerCase().includes(search.toLowerCase()) ||
          m.Email?.toLowerCase().includes(search.toLowerCase())
      );
      return NextResponse.json(results);
    }

    return NextResponse.json(mockMaestros);
  } catch (error: any) {
    console.error('[API] Error en GET maestros:', error);
    return NextResponse.json(
      { error: error.message || 'Error al obtener maestros' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/maestros - Crea un nuevo maestro
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.NombreCompleto) {
      return NextResponse.json(
        { error: 'El nombre del maestro es requerido' },
        { status: 400 }
      );
    }

    const newMaestro = {
      MaestroId: Math.max(...mockMaestros.map((m) => m.MaestroId || 0)) + 1,
      ...body,
    };

    mockMaestros.push(newMaestro);

    return NextResponse.json(newMaestro, { status: 201 });
  } catch (error: any) {
    console.error('[API] Error en POST maestros:', error);
    return NextResponse.json(
      { error: error.message || 'Error al crear maestro' },
      { status: 500 }
    );
  }
}
