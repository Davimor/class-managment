import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/services/auth.service';
import { mockAlumnos } from '@/lib/mock-data';

/**
 * GET /api/alumnos - Obtiene todos los alumnos o busca
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
    const search = searchParams.get('search');

    if (search) {
      const results = mockAlumnos.filter(
        (a) =>
          a.NombreCompleto.toLowerCase().includes(search.toLowerCase()) ||
          a.Email?.toLowerCase().includes(search.toLowerCase())
      );
      return NextResponse.json({ success: true, data: results });
    }

    return NextResponse.json({ success: true, data: mockAlumnos });
  } catch (error: any) {
    console.error('[API] Error en GET alumnos:', error);
    return NextResponse.json(
      { error: error.message || 'Error al obtener alumnos' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/alumnos - Crea un nuevo alumno
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

    if (!body.NombreCompleto || !body.FechaNacimiento) {
      return NextResponse.json(
        { error: 'Nombre y fecha de nacimiento son requeridos' },
        { status: 400 }
      );
    }

    const newAlumno = {
      AlumnoId: Math.max(...mockAlumnos.map((a) => a.AlumnoId || 0)) + 1,
      ...body,
      FechaIngreso: new Date(),
    };

    return NextResponse.json({ success: true, data: newAlumno }, { status: 201 });
  } catch (error: any) {
    console.error('[API] Error en POST alumnos:', error);
    return NextResponse.json(
      { error: error.message || 'Error al crear alumno' },
      { status: 500 }
    );
  }
}
