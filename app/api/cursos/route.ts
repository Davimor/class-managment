import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/services/auth.service';
import { mockCursos } from '@/lib/mock-data';
import { getAllCursos, getCursosByTipo, createCurso } from '@/lib/services/cursos.service';

/**
 * GET /api/cursos - Lista todos los cursos o filtra por tipo
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Token no proporcionado' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const tipo = searchParams.get('tipo') as 'fundamentacion' | 'pedagogia' | 'dogmatico' | null;
    const search = searchParams.get('search');

    if (tipo) {
      const cursos = await getCursosByTipo(tipo);
      return NextResponse.json({ success: true, data: cursos });
    }

    if (search) {
      const results = mockCursos.filter(
        (c: any) =>
          c.Nombre.toLowerCase().includes(search.toLowerCase()) ||
          c.Descripcion?.toLowerCase().includes(search.toLowerCase())
      );
      return NextResponse.json({ success: true, data: results });
    }

    const cursos = await getAllCursos();
    return NextResponse.json({ success: true, data: cursos });
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
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Token no proporcionado' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || !['admin', 'secretaria'].includes(decoded.role)) {
      return NextResponse.json({ error: 'Permiso denegado' }, { status: 403 });
    }

    const body = await request.json();

    if (!body.Nombre || !body.Tipo) {
      return NextResponse.json(
        { error: 'Nombre y tipo de curso son requeridos' },
        { status: 400 }
      );
    }

    const newCurso = await createCurso(body);
    return NextResponse.json({ success: true, data: newCurso }, { status: 201 });
  } catch (error: any) {
    console.error('[API] Error en POST cursos:', error);
    return NextResponse.json(
      { error: error.message || 'Error al crear curso' },
      { status: 500 }
    );
  }
}
