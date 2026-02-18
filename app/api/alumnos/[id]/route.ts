import { NextRequest, NextResponse } from 'next/server';
import { mockAlumnos } from '@/lib/mock-data';

/**
 * PUT /api/alumnos/[id] - Actualiza un alumno existente
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const alumnoId = parseInt(id);
    const body = await request.json();

    // Encontrar el alumno
    const alumnoIndex = mockAlumnos.findIndex(a => a.AlumnoId === alumnoId);
    if (alumnoIndex === -1) {
      return NextResponse.json(
        { error: 'Alumno no encontrado' },
        { status: 404 }
      );
    }

    // Actualizar datos del alumno
    const nombreCompleto = body.FirstName && body.LastName 
      ? `${body.FirstName} ${body.LastName}` 
      : body.NombreCompleto;

    const updatedAlumno = {
      ...mockAlumnos[alumnoIndex],
      NombreCompleto: nombreCompleto,
      FirstName: body.FirstName || mockAlumnos[alumnoIndex].FirstName,
      LastName: body.LastName || mockAlumnos[alumnoIndex].LastName,
      Email: body.Email ?? mockAlumnos[alumnoIndex].Email,
      Phone: body.Phone ?? mockAlumnos[alumnoIndex].Phone,
      Telefono: body.Phone ?? mockAlumnos[alumnoIndex].Telefono,
      DocumentType: body.DocumentType ?? mockAlumnos[alumnoIndex].DocumentType,
      DocumentNumber: body.DocumentNumber ?? mockAlumnos[alumnoIndex].DocumentNumber,
      DateOfBirth: body.DateOfBirth ?? mockAlumnos[alumnoIndex].DateOfBirth,
      Gender: body.Gender ?? mockAlumnos[alumnoIndex].Gender,
      Address: body.Address ?? mockAlumnos[alumnoIndex].Address,
      City: body.City ?? mockAlumnos[alumnoIndex].City,
      PostalCode: body.PostalCode ?? mockAlumnos[alumnoIndex].PostalCode,
      SpecialNeeds: body.SpecialNeeds ?? mockAlumnos[alumnoIndex].SpecialNeeds,
      MedicalInfo: body.MedicalInfo ?? mockAlumnos[alumnoIndex].MedicalInfo,
    };

    // Actualizar en mock data
    mockAlumnos[alumnoIndex] = updatedAlumno;

    return NextResponse.json(updatedAlumno);
  } catch (error: any) {
    console.error('[API] Error en PUT alumnos:', error);
    return NextResponse.json(
      { error: error.message || 'Error al actualizar alumno' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/alumnos/[id] - Elimina un alumno
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const alumnoId = parseInt(id);

    const alumnoIndex = mockAlumnos.findIndex(a => a.AlumnoId === alumnoId);
    if (alumnoIndex === -1) {
      return NextResponse.json(
        { error: 'Alumno no encontrado' },
        { status: 404 }
      );
    }

    mockAlumnos.splice(alumnoIndex, 1);

    return NextResponse.json({ message: 'Alumno eliminado correctamente' });
  } catch (error: any) {
    console.error('[API] Error en DELETE alumnos:', error);
    return NextResponse.json(
      { error: error.message || 'Error al eliminar alumno' },
      { status: 500 }
    );
  }
}
