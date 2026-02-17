import { NextRequest, NextResponse } from 'next/server';
import {
  getAllProgenitores,
  getProgenitorById,
  createProgenitor,
  updateProgenitor,
  deleteProgenitor,
  searchProgenitors,
} from '@/lib/services/alumnos.service';
import { verifyAuth, verifyAuthAndRole } from '@/lib/api-auth';
import { CreateProgenitorRequest, UpdateProgenitorRequest } from '@/lib/types';

/**
 * GET /api/progenitores - Obtiene todos los progenitores
 */
export async function GET(request: NextRequest) {
  try {
    const { decoded, error } = await verifyAuth(request);
    if (error) return error;

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');

    if (search) {
      const results = await searchProgenitors(search);
      return NextResponse.json(results);
    }

    const progenitores = await getAllProgenitores();
    return NextResponse.json(progenitores);
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
    const { decoded, error } = await verifyAuth(request);
    if (error) return error;

    const body: CreateProgenitorRequest = await request.json();

    // Validar entrada
    if (!body.FirstName || !body.LastName || !body.RelationshipType) {
      return NextResponse.json(
        { error: 'Nombre, apellido y tipo de relación son requeridos' },
        { status: 400 }
      );
    }

    const progenitor = await createProgenitor(body);
    return NextResponse.json(progenitor, { status: 201 });
  } catch (error: any) {
    console.error('[API] Error en POST progenitores:', error);
    return NextResponse.json(
      { error: error.message || 'Error al crear progenitor' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/progenitores/[id] - Actualiza un progenitor
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id?: string }> }
) {
  try {
    const { id } = await params;
    const { decoded, error } = await verifyAuth(request);
    if (error) return error;

    if (!id) {
      return NextResponse.json({ error: 'ID de progenitor requerido' }, { status: 400 });
    }

    const body: UpdateProgenitorRequest = await request.json();
    const progenitor = await updateProgenitor(parseInt(id), body);
    return NextResponse.json(progenitor);
  } catch (error: any) {
    console.error('[API] Error en PUT progenitores:', error);
    return NextResponse.json(
      { error: error.message || 'Error al actualizar progenitor' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/progenitores/[id] - Elimina un progenitor
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id?: string }> }
) {
  try {
    const { id } = await params;
    const { decoded, error } = await verifyAuthAndRole(request, ['admin']);
    if (error) return error;

    if (!id) {
      return NextResponse.json({ error: 'ID de progenitor requerido' }, { status: 400 });
    }

    await deleteProgenitor(parseInt(id));
    return NextResponse.json({ message: 'Progenitor eliminado exitosamente' });
  } catch (error: any) {
    console.error('[API] Error en DELETE progenitores:', error);
    return NextResponse.json(
      { error: error.message || 'Error al eliminar progenitor' },
      { status: 500 }
    );
  }
}
