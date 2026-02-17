import { NextRequest, NextResponse } from 'next/server';
import {
  getAllAulas,
  getAulaById,
  createAula,
  updateAula,
  deleteAula,
  searchAulas,
} from '@/lib/services/aulas.service';
import { verifyToken } from '@/lib/services/auth.service';
import { CreateAulaRequest, UpdateAulaRequest } from '@/lib/types';

/**
 * GET /api/aulas - Obtiene todas las aulas
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    verifyToken(token); // Lanzará error si es inválido

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');

    if (search) {
      const results = await searchAulas(search);
      return NextResponse.json(results);
    }

    const aulas = await getAllAulas();
    return NextResponse.json(aulas);
  } catch (error: any) {
    console.error('[API] Error en GET aulas:', error);
    return NextResponse.json(
      { error: error.message || 'Error al obtener aulas' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/aulas - Crea una nueva aula (solo admin y secretaría)
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar token y rol
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!['admin', 'secretaria'].includes(decoded.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body: CreateAulaRequest = await request.json();

    // Validar entrada
    if (!body.Name) {
      return NextResponse.json(
        { error: 'El nombre del aula es requerido' },
        { status: 400 }
      );
    }

    const aula = await createAula(body);
    return NextResponse.json(aula, { status: 201 });
  } catch (error: any) {
    console.error('[API] Error en POST aulas:', error);
    return NextResponse.json(
      { error: error.message || 'Error al crear aula' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/aulas/[id] - Actualiza un aula
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id?: string }> }
) {
  try {
    const { id } = await params;

    // Verificar token y rol
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!['admin', 'secretaria'].includes(decoded.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (!id) {
      return NextResponse.json({ error: 'ID de aula requerido' }, { status: 400 });
    }

    const body: UpdateAulaRequest = await request.json();
    const aula = await updateAula(parseInt(id), body);
    return NextResponse.json(aula);
  } catch (error: any) {
    console.error('[API] Error en PUT aulas:', error);
    return NextResponse.json(
      { error: error.message || 'Error al actualizar aula' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/aulas/[id] - Elimina un aula
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id?: string }> }
) {
  try {
    const { id } = await params;

    // Verificar token y rol
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (!id) {
      return NextResponse.json({ error: 'ID de aula requerido' }, { status: 400 });
    }

    await deleteAula(parseInt(id));
    return NextResponse.json({ message: 'Aula eliminada exitosamente' });
  } catch (error: any) {
    console.error('[API] Error en DELETE aulas:', error);
    return NextResponse.json(
      { error: error.message || 'Error al eliminar aula' },
      { status: 500 }
    );
  }
}
