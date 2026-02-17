import { query, queryOne } from '@/lib/db';
import {
  Aula,
  Maestro,
  MaestroAula,
  CreateAulaRequest,
  UpdateAulaRequest,
  CreateMaestroRequest,
  UpdateMaestroRequest,
  User,
} from '@/lib/types';

// ========== SERVICIOS PARA AULAS ==========

/**
 * Obtiene todas las aulas
 */
export async function getAllAulas(onlyActive: boolean = true): Promise<Aula[]> {
  const whereClause = onlyActive ? 'WHERE IsActive = 1' : '';
  return query<Aula>(
    `SELECT * FROM Aulas ${whereClause} ORDER BY Name`
  );
}

/**
 * Obtiene una aula por ID
 */
export async function getAulaById(aulaId: number): Promise<Aula | null> {
  return queryOne<Aula>(
    'SELECT * FROM Aulas WHERE AulaId = @aulaId',
    { aulaId }
  );
}

/**
 * Obtiene la capacidad disponible de un aula
 */
export async function getAulaAvailableCapacity(aulaId: number): Promise<number> {
  const aula = await getAulaById(aulaId);
  if (!aula) {
    throw new Error('Aula no encontrada');
  }

  const result = await queryOne<{ AlumnosCount: number }>(
    `SELECT COUNT(*) as AlumnosCount FROM AlumnoAula
     WHERE AulaId = @aulaId AND Status = 'activo'`,
    { aulaId }
  );

  const alumnosCount = result?.AlumnosCount || 0;
  return Math.max(0, aula.Capacity - alumnosCount);
}

/**
 * Busca aulas por nombre o nivel
 */
export async function searchAulas(searchTerm: string): Promise<Aula[]> {
  const term = `%${searchTerm}%`;
  return query<Aula>(
    `SELECT * FROM Aulas 
     WHERE IsActive = 1 AND (
       Name LIKE @term OR 
       Level LIKE @term OR
       Description LIKE @term
     )
     ORDER BY Name`,
    { term }
  );
}

/**
 * Crea una nueva aula
 */
export async function createAula(request: CreateAulaRequest): Promise<Aula> {
  const result = await query<any>(
    `INSERT INTO Aulas (Name, Description, Level, Capacity, IsActive, CreatedAt, UpdatedAt)
     VALUES (@name, @description, @level, @capacity, 1, GETDATE(), GETDATE());
     SELECT SCOPE_IDENTITY() as AulaId;`,
    {
      name: request.Name,
      description: request.Description || null,
      level: request.Level || null,
      capacity: request.Capacity || 30,
    }
  );

  const aulaId = result[0].AulaId;
  const aula = await getAulaById(aulaId);
  if (!aula) {
    throw new Error('Error al crear el aula');
  }

  return aula;
}

/**
 * Actualiza una aula
 */
export async function updateAula(
  aulaId: number,
  request: UpdateAulaRequest
): Promise<Aula> {
  const validFields = [];
  const params: Record<string, any> = { aulaId };

  if (request.Name !== undefined) {
    validFields.push('Name = @name');
    params.name = request.Name;
  }

  if (request.Description !== undefined) {
    validFields.push('Description = @description');
    params.description = request.Description;
  }

  if (request.Level !== undefined) {
    validFields.push('Level = @level');
    params.level = request.Level;
  }

  if (request.Capacity !== undefined) {
    validFields.push('Capacity = @capacity');
    params.capacity = request.Capacity;
  }

  if (validFields.length === 0) {
    throw new Error('No hay campos para actualizar');
  }

  validFields.push('UpdatedAt = GETDATE()');

  await query(
    `UPDATE Aulas SET ${validFields.join(', ')} WHERE AulaId = @aulaId`,
    params
  );

  const aula = await getAulaById(aulaId);
  if (!aula) {
    throw new Error('Error al actualizar el aula');
  }

  return aula;
}

/**
 * Elimina un aula (soft delete)
 */
export async function deleteAula(aulaId: number): Promise<void> {
  await query(
    'UPDATE Aulas SET IsActive = 0, UpdatedAt = GETDATE() WHERE AulaId = @aulaId',
    { aulaId }
  );
}

// ========== SERVICIOS PARA MAESTROS ==========

/**
 * Obtiene todos los maestros
 */
export async function getAllMaestros(onlyActive: boolean = true): Promise<(Maestro & { User?: User })[]> {
  const whereClause = onlyActive ? 'WHERE m.IsActive = 1' : '';
  return query<Maestro & { User?: User }>(
    `SELECT m.*, u.Email, u.FullName as UserFullName FROM Maestros m
     INNER JOIN Users u ON m.UserId = u.UserId
     ${whereClause}
     ORDER BY u.FullName`
  );
}

/**
 * Obtiene un maestro por ID
 */
export async function getMaestroById(maestroId: number): Promise<(Maestro & { User?: User }) | null> {
  return queryOne<Maestro & { User?: User }>(
    `SELECT m.*, u.Email, u.FullName as UserFullName FROM Maestros m
     INNER JOIN Users u ON m.UserId = u.UserId
     WHERE m.MaestroId = @maestroId`,
    { maestroId }
  );
}

/**
 * Obtiene el maestro asociado a un usuario
 */
export async function getMaestroByUserId(userId: number): Promise<(Maestro & { User?: User }) | null> {
  return queryOne<Maestro & { User?: User }>(
    `SELECT m.*, u.Email, u.FullName as UserFullName FROM Maestros m
     INNER JOIN Users u ON m.UserId = u.UserId
     WHERE m.UserId = @userId`,
    { userId }
  );
}

/**
 * Obtiene las aulas de un maestro
 */
export async function getAulasByMaestro(maestroId: number): Promise<Aula[]> {
  return query<Aula>(
    `SELECT a.* FROM Aulas a
     INNER JOIN MaestroAula ma ON a.AulaId = ma.AulaId
     WHERE ma.MaestroId = @maestroId AND ma.IsActive = 1
     ORDER BY a.Name`,
    { maestroId }
  );
}

/**
 * Busca maestros por nombre o especialidad
 */
export async function searchMaestros(searchTerm: string): Promise<(Maestro & { User?: User })[]> {
  const term = `%${searchTerm}%`;
  return query<Maestro & { User?: User }>(
    `SELECT m.*, u.Email, u.FullName as UserFullName FROM Maestros m
     INNER JOIN Users u ON m.UserId = u.UserId
     WHERE m.IsActive = 1 AND (
       u.FullName LIKE @term OR 
       u.Email LIKE @term OR 
       m.Specialty LIKE @term
     )
     ORDER BY u.FullName`,
    { term }
  );
}

/**
 * Crea un nuevo maestro
 */
export async function createMaestro(request: CreateMaestroRequest): Promise<Maestro & { User?: User }> {
  // Verificar que el usuario exista
  const userQuery = await queryOne<any>(
    'SELECT UserId FROM Users WHERE UserId = @userId',
    { userId: request.UserId }
  );

  if (!userQuery) {
    throw new Error('Usuario no encontrado');
  }

  // Verificar que no exista ya un maestro para este usuario
  const existingMaestro = await queryOne<any>(
    'SELECT MaestroId FROM Maestros WHERE UserId = @userId',
    { userId: request.UserId }
  );

  if (existingMaestro) {
    throw new Error('Ya existe un maestro para este usuario');
  }

  const result = await query<any>(
    `INSERT INTO Maestros (UserId, Phone, Specialty, IsActive, CreatedAt, UpdatedAt)
     VALUES (@userId, @phone, @specialty, 1, GETDATE(), GETDATE());
     SELECT SCOPE_IDENTITY() as MaestroId;`,
    {
      userId: request.UserId,
      phone: request.Phone || null,
      specialty: request.Specialty || null,
    }
  );

  const maestroId = result[0].MaestroId;
  const maestro = await getMaestroById(maestroId);
  if (!maestro) {
    throw new Error('Error al crear el maestro');
  }

  return maestro;
}

/**
 * Actualiza un maestro
 */
export async function updateMaestro(
  maestroId: number,
  request: UpdateMaestroRequest
): Promise<Maestro & { User?: User }> {
  const validFields = [];
  const params: Record<string, any> = { maestroId };

  if (request.Phone !== undefined) {
    validFields.push('Phone = @phone');
    params.phone = request.Phone;
  }

  if (request.Specialty !== undefined) {
    validFields.push('Specialty = @specialty');
    params.specialty = request.Specialty;
  }

  if (validFields.length === 0) {
    throw new Error('No hay campos para actualizar');
  }

  validFields.push('UpdatedAt = GETDATE()');

  await query(
    `UPDATE Maestros SET ${validFields.join(', ')} WHERE MaestroId = @maestroId`,
    params
  );

  const maestro = await getMaestroById(maestroId);
  if (!maestro) {
    throw new Error('Error al actualizar el maestro');
  }

  return maestro;
}

/**
 * Elimina un maestro (soft delete)
 */
export async function deleteMaestro(maestroId: number): Promise<void> {
  await query(
    'UPDATE Maestros SET IsActive = 0, UpdatedAt = GETDATE() WHERE MaestroId = @maestroId',
    { maestroId }
  );
}

// ========== SERVICIOS PARA RELACIONES MAESTRO-AULA ==========

/**
 * Asigna un maestro a una aula
 */
export async function assignMaestroToAula(
  maestroId: number,
  aulaId: number,
  startDate: Date,
  endDate?: Date
): Promise<MaestroAula> {
  // Verificar que el maestro y aula existan
  const maestro = await getMaestroById(maestroId);
  const aula = await getAulaById(aulaId);

  if (!maestro || !aula) {
    throw new Error('Maestro o aula no encontrado');
  }

  try {
    const result = await query<any>(
      `INSERT INTO MaestroAula (MaestroId, AulaId, StartDate, EndDate, IsActive, CreatedAt)
       VALUES (@maestroId, @aulaId, @startDate, @endDate, 1, GETDATE());
       SELECT SCOPE_IDENTITY() as MaestroAulaId;`,
      {
        maestroId,
        aulaId,
        startDate,
        endDate: endDate || null,
      }
    );

    return result[0] as MaestroAula;
  } catch (error: any) {
    if (error.message.includes('UNIQUE')) {
      throw new Error('Este maestro ya está asignado a esta aula');
    }
    throw error;
  }
}

/**
 * Desasigna un maestro de una aula
 */
export async function removeMaestroFromAula(maestroId: number, aulaId: number): Promise<void> {
  await query(
    `UPDATE MaestroAula SET IsActive = 0 WHERE MaestroId = @maestroId AND AulaId = @aulaId`,
    { maestroId, aulaId }
  );
}

/**
 * Obtiene el maestro actual de una aula
 */
export async function getCurrentMaestroOfAula(aulaId: number): Promise<(Maestro & { User?: User }) | null> {
  return queryOne<Maestro & { User?: User }>(
    `SELECT m.*, u.Email, u.FullName as UserFullName FROM Maestros m
     INNER JOIN Users u ON m.UserId = u.UserId
     INNER JOIN MaestroAula ma ON m.MaestroId = ma.MaestroId
     WHERE ma.AulaId = @aulaId AND ma.IsActive = 1 
     AND (ma.EndDate IS NULL OR ma.EndDate >= CAST(GETDATE() AS DATE))
     ORDER BY ma.StartDate DESC`,
    { aulaId }
  );
}
