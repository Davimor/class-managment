import { NextRequest, NextResponse } from 'next/server';
import { createUser, getAllUsers, updateUser, deleteUser } from '@/lib/services/auth.service';
import { verifyToken } from '@/lib/services/auth.service';
import { CreateUserRequest, UpdateUserRequest } from '@/lib/types';

/**
 * GET /api/users - Obtiene todos los usuarios (solo admin)
 */
export async function GET(request: NextRequest) {
  try {
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

    const searchParams = request.nextUrl.searchParams;
    const role = searchParams.get('role');

    const users = await getAllUsers(role || undefined);
    // No retornar hashes de contraseña
    const usersWithoutPasswords = users.map((user) => ({
      ...user,
      PasswordHash: '',
    }));

    return NextResponse.json(usersWithoutPasswords);
  } catch (error: any) {
    console.error('[API] Error en GET users:', error);
    return NextResponse.json(
      { error: error.message || 'Error al obtener usuarios' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/users - Crea un nuevo usuario (solo admin)
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

    if (decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body: CreateUserRequest = await request.json();

    // Validar entrada
    if (!body.Email || !body.Password || !body.FullName || !body.Role) {
      return NextResponse.json(
        { error: 'Email, contraseña, nombre completo y rol son requeridos' },
        { status: 400 }
      );
    }

    const user = await createUser(body.Email, body.Password, body.FullName, body.Role);

    const userWithoutPassword = {
      ...user,
      PasswordHash: '',
    };

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error: any) {
    console.error('[API] Error en POST users:', error);
    return NextResponse.json(
      { error: error.message || 'Error al crear usuario' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/users/[id] - Actualiza un usuario (solo admin)
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

    if (decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (!id) {
      return NextResponse.json({ error: 'ID de usuario requerido' }, { status: 400 });
    }

    const body: UpdateUserRequest = await request.json();

    const user = await updateUser(parseInt(id), {
      email: body.Email,
      fullName: body.FullName,
      role: body.Role,
      isActive: body.IsActive,
    });

    const userWithoutPassword = {
      ...user,
      PasswordHash: '',
    };

    return NextResponse.json(userWithoutPassword);
  } catch (error: any) {
    console.error('[API] Error en PUT users:', error);
    return NextResponse.json(
      { error: error.message || 'Error al actualizar usuario' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/users/[id] - Elimina un usuario (solo admin)
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
      return NextResponse.json({ error: 'ID de usuario requerido' }, { status: 400 });
    }

    await deleteUser(parseInt(id));
    return NextResponse.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error: any) {
    console.error('[API] Error en DELETE users:', error);
    return NextResponse.json(
      { error: error.message || 'Error al eliminar usuario' },
      { status: 500 }
    );
  }
}
