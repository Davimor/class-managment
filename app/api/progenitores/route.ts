import { NextRequest, NextResponse } from 'next/server';
import { mockProgenitores } from '@/lib/mock-data';

/**
 * GET /api/progenitores - Obtiene todos los progenitores
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');

    if (search) {
      const results = mockProgenitores.filter(
        (p) =>
          `${p.FirstName} ${p.LastName}`.toLowerCase().includes(search.toLowerCase()) ||
          p.Email?.toLowerCase().includes(search.toLowerCase())
      );
      return NextResponse.json(results);
    }

    return NextResponse.json(mockProgenitores);
  } catch (error: any) {
    console.error('[API] Error en GET progenitores:', error);
    return NextResponse.json(
      { error: error.message || 'Error al obtener progenitores' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/progenitores - Crea un nuevo progenitor
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.FirstName || !body.LastName) {
      return NextResponse.json(
        { error: 'Nombre y apellido son requeridos' },
        { status: 400 }
      );
    }

    const newProgenitor = {
      ProgenitorId: Math.max(...mockProgenitores.map((p) => p.ProgenitorId || 0)) + 1,
      ...body,
    };

    mockProgenitores.push(newProgenitor);

    return NextResponse.json(newProgenitor, { status: 201 });
  } catch (error: any) {
    console.error('[API] Error en POST progenitores:', error);
    return NextResponse.json(
      { error: error.message || 'Error al crear progenitor' },
      { status: 500 }
    );
  }
}
