import { NextRequest, NextResponse } from 'next/server';
import {
  getAllMaestros,
  getMaestroById,
  createMaestro,
  updateMaestro,
  deleteMaestro,
  searchMaestros,
} from '@/lib/services/aulas.service';
import { verifyAuth, verifyAuthAndRole } from '@/lib/api-auth';
import { CreateMaestroRequest, UpdateMaestroRequest } from '@/lib/types';

/**
 * GET /api/maestros - Obtiene todos los maestros
 */
export async function GET(request: NextRequest) {
  try {
    const { decoded, error } = await verifyAuth(request);
    if (error) return error;

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');

    if (search) {
      const results = await searchMaestros(search);
      return NextResponse.json(results);
    }

    const maestros = await getAllMaestros();
    return NextResponse.json(maestros);
  } catch (error: any) {
    console.error('[API] Error en GET maestros:', error);
    return NextResponse.json(
      { error: error.message || 'Error al obtener maestros' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/maestros - Crea un nuevo maestro (solo admin)
 */
export async function POST(request: NextRequest) {
  try {
    const { decoded, error } = await verifyAuthAndRole(request, ['admin']);
    if (error) return error;

    const body: CreateMaestroRequest = await request.json();

    // Validar entrada
    if (!body.UserId) {
      return NextResponse.json(
        { error: 'El ID del usuario es requerido' },
        { status: 400 }
      );
    }

    const maestro = await createMaestro(body);
    return NextResponse.json(maestro, { status: 201 });
  } catch (error: any) {
    console.error('[API] Error en POST maestros:', error);
    return NextResponse.json(
      { error: error.message || 'Error al crear maestro' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/maestros/[id] - Actualiza un maestro
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id?: string }> }
) {
  try {
    const { id } = await params;
    const { decoded, error } = await verifyAuth(request);
    if (error) return error;

    // Solo admin y el mismo maestro pueden actualizar
    if (decoded && decoded.role === 'maestro') {
      const maestro = await getMaestroById(parseInt(id || '0'));
      if (maestro?.UserId !== decoded.userId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    } else if (decoded && decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (!id) {
      return NextResponse.json({ error: 'ID de maestro requerido' }, { status: 400 });
    }

    const body: UpdateMaestroRequest = await request.json();
    const maestro = await updateMaestro(parseInt(id), body);
    return NextResponse.json(maestro);
  } catch (error: any) {
    console.error('[API] Error en PUT maestros:', error);
    return NextResponse.json(
      { error: error.message || 'Error al actualizar maestro' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/maestros/[id] - Elimina un maestro (solo admin)
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
      return NextResponse.json({ error: 'ID de maestro requerido' }, { status: 400 });
    }

    await deleteMaestro(parseInt(id));
    return NextResponse.json({ message: 'Maestro eliminado exitosamente' });
  } catch (error: any) {
    console.error('[API] Error en DELETE maestros:', error);
    return NextResponse.json(
      { error: error.message || 'Error al eliminar maestro' },
      { status: 500 }
    );
  }
}
