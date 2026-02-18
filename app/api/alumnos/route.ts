import { NextRequest, NextResponse } from 'next/server';
import { mockAlumnos } from '@/lib/mock-data';

/**
 * GET /api/alumnos - Obtiene todos los alumnos o busca
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');

    if (search) {
      const results = mockAlumnos.filter(
        (a) =>
          a.NombreCompleto.toLowerCase().includes(search.toLowerCase()) ||
          a.Email?.toLowerCase().includes(search.toLowerCase())
      );
      return NextResponse.json(results);
    }

    return NextResponse.json(mockAlumnos);
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
    const body = await request.json();

    // Convertir FirstName + LastName a NombreCompleto
    const nombreCompleto = body.FirstName && body.LastName 
      ? `${body.FirstName} ${body.LastName}` 
      : body.NombreCompleto;

    if (!nombreCompleto) {
      return NextResponse.json(
        { error: 'Nombre es requerido' },
        { status: 400 }
      );
    }

    const newAlumno = {
      AlumnoId: Math.max(...mockAlumnos.map((a) => a.AlumnoId || 0)) + 1,
      NombreCompleto: nombreCompleto,
      Email: body.Email,
      Telefono: body.Telefono || body.Phone,
      Documento: body.DocumentNumber,
      FechaNacimiento: body.DateOfBirth,
      Genero: body.Gender,
      FechaIngreso: new Date(),
      // También retornar los campos esperados por el componente
      FirstName: body.FirstName,
      LastName: body.LastName,
      DocumentNumber: body.DocumentNumber,
      Phone: body.Telefono || body.Phone,
      DateOfBirth: body.DateOfBirth,
      Gender: body.Gender,
    };

    mockAlumnos.push(newAlumno);

    return NextResponse.json(newAlumno, { status: 201 });
  } catch (error: any) {
    console.error('[API] Error en POST alumnos:', error);
    return NextResponse.json(
      { error: error.message || 'Error al crear alumno' },
      { status: 500 }
    );
  }
}
