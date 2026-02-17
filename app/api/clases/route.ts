import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/services/auth.service';
import { mockClases, mockCursos, mockAlumnos } from '@/lib/mock-data';
import { 
  getAllClases, 
  createClase, 
  getAlumnosByClase,
  getClaseById 
} from '@/lib/services/clases.service';

/**
 * GET /api/clases - Obtiene todas las clases o las de un curso específico
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
    const cursoId = searchParams.get('cursoId');

    let clases = [...mockClases];
    
    if (cursoId) {
      clases = clases.filter(c => c.CursoId === parseInt(cursoId));
    }

    // Agregar información de alumnos
    const clasesConAlumnos = clases.map(clase => ({
      ...clase,
      Alumnos: mockAlumnos.filter(a => a.ClaseId === clase.ClaseId),
      AlumnosCount: mockAlumnos.filter(a => a.ClaseId === clase.ClaseId).length,
      Curso: mockCursos.find(c => c.CursoId === clase.CursoId),
    }));

    return NextResponse.json({ 
      success: true, 
      data: clasesConAlumnos 
    });
  } catch (error: any) {
    console.error('[API] Error en GET clases:', error);
    return NextResponse.json(
      { error: error.message || 'Error al obtener clases' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/clases - Crea una nueva clase
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

    if (!body.CursoId || !body.Nombre) {
      return NextResponse.json(
        { error: 'CursoId y Nombre son requeridos' },
        { status: 400 }
      );
    }

    const newClase = {
      ClaseId: Math.max(...mockClases.map(c => c.ClaseId || 0)) + 1,
      CursoId: body.CursoId,
      Nombre: body.Nombre,
      MaestroId: body.MaestroId || null,
      CapacidadMaxima: body.MaxCapacidad || 30,
      IsActive: true,
      CreatedAt: new Date(),
      UpdatedAt: new Date(),
    };

    mockClases.push(newClase);

    return NextResponse.json({ 
      success: true, 
      data: newClase 
    }, { status: 201 });
  } catch (error: any) {
    console.error('[API] Error en POST clases:', error);
    return NextResponse.json(
      { error: error.message || 'Error al crear clase' },
      { status: 500 }
    );
  }
}
