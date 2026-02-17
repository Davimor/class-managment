import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthAndRole } from '@/lib/api-auth';
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
    const { decoded, error } = await verifyAuthAndRole(request, ['admin', 'secretaria', 'maestro']);
    if (error) return error;

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
    const { decoded, error } = await verifyAuthAndRole(request, ['admin', 'secretaria']);
    if (error) return error;

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
