import { query, queryOne } from '@/lib/db';
import {
  Alumno,
  Progenitor,
  AlumnoProgenitor,
  CreateAlumnoRequest,
  UpdateAlumnoRequest,
  CreateProgenitorRequest,
  UpdateProgenitorRequest,
} from '@/lib/types';

// ========== SERVICIOS PARA ALUMNOS ==========

/**
 * Obtiene todos los alumnos
 */
export async function getAllAlumnos(onlyActive: boolean = true): Promise<Alumno[]> {
  const whereClause = onlyActive ? 'WHERE IsActive = 1' : '';
  return query<Alumno>(
    `SELECT * FROM Alumnos ${whereClause} ORDER BY LastName, FirstName`
  );
}

/**
 * Obtiene un alumno por ID
 */
export async function getAlumnoById(alumnoId: number): Promise<Alumno | null> {
  return queryOne<Alumno>(
    'SELECT * FROM Alumnos WHERE AlumnoId = @alumnoId',
    { alumnoId }
  );
}

/**
 * Obtiene alumnos de una aula específica
 */
export async function getAlumnosByAula(aulaId: number): Promise<Alumno[]> {
  return query<Alumno>(
    `SELECT DISTINCT a.* FROM Alumnos a
     INNER JOIN AlumnoAula aa ON a.AlumnoId = aa.AlumnoId
     WHERE aa.AulaId = @aulaId AND a.IsActive = 1
     ORDER BY a.LastName, a.FirstName`,
    { aulaId }
  );
}

/**
 * Busca alumnos por nombre o documento
 */
export async function searchAlumnos(searchTerm: string): Promise<Alumno[]> {
  const term = `%${searchTerm}%`;
  return query<Alumno>(
    `SELECT * FROM Alumnos 
     WHERE IsActive = 1 AND (
       FirstName LIKE @term OR 
       LastName LIKE @term OR 
       DocumentNumber LIKE @term OR
       Email LIKE @term
     )
     ORDER BY LastName, FirstName`,
    { term }
  );
}

/**
 * Crea un nuevo alumno
 */
export async function createAlumno(request: CreateAlumnoRequest): Promise<Alumno> {
  const result = await query<any>(
    `INSERT INTO Alumnos (
      FirstName, LastName, DateOfBirth, Gender, DocumentType, DocumentNumber,
      Address, City, PostalCode, Phone, Email, SpecialNeeds, MedicalInfo,
      IsActive, CreatedAt, UpdatedAt
    ) VALUES (
      @firstName, @lastName, @dateOfBirth, @gender, @documentType, @documentNumber,
      @address, @city, @postalCode, @phone, @email, @specialNeeds, @medicalInfo,
      1, GETDATE(), GETDATE()
    );
    SELECT SCOPE_IDENTITY() as AlumnoId;`,
    {
      firstName: request.FirstName,
      lastName: request.LastName,
      dateOfBirth: request.DateOfBirth || null,
      gender: request.Gender || null,
      documentType: request.DocumentType || null,
      documentNumber: request.DocumentNumber || null,
      address: request.Address || null,
      city: request.City || null,
      postalCode: request.PostalCode || null,
      phone: request.Phone || null,
      email: request.Email || null,
      specialNeeds: request.SpecialNeeds || null,
      medicalInfo: request.MedicalInfo || null,
    }
  );

  const alumnoId = result[0].AlumnoId;
  const alumno = await getAlumnoById(alumnoId);
  if (!alumno) {
    throw new Error('Error al crear el alumno');
  }

  return alumno;
}

/**
 * Actualiza un alumno
 */
export async function updateAlumno(
  alumnoId: number,
  request: UpdateAlumnoRequest
): Promise<Alumno> {
  const validFields = [];
  const params: Record<string, any> = { alumnoId };

  if (request.FirstName !== undefined) {
    validFields.push('FirstName = @firstName');
    params.firstName = request.FirstName;
  }

  if (request.LastName !== undefined) {
    validFields.push('LastName = @lastName');
    params.lastName = request.LastName;
  }

  if (request.DateOfBirth !== undefined) {
    validFields.push('DateOfBirth = @dateOfBirth');
    params.dateOfBirth = request.DateOfBirth;
  }

  if (request.Gender !== undefined) {
    validFields.push('Gender = @gender');
    params.gender = request.Gender;
  }

  if (request.DocumentType !== undefined) {
    validFields.push('DocumentType = @documentType');
    params.documentType = request.DocumentType;
  }

  if (request.DocumentNumber !== undefined) {
    validFields.push('DocumentNumber = @documentNumber');
    params.documentNumber = request.DocumentNumber;
  }

  if (request.Address !== undefined) {
    validFields.push('Address = @address');
    params.address = request.Address;
  }

  if (request.City !== undefined) {
    validFields.push('City = @city');
    params.city = request.City;
  }

  if (request.PostalCode !== undefined) {
    validFields.push('PostalCode = @postalCode');
    params.postalCode = request.PostalCode;
  }

  if (request.Phone !== undefined) {
    validFields.push('Phone = @phone');
    params.phone = request.Phone;
  }

  if (request.Email !== undefined) {
    validFields.push('Email = @email');
    params.email = request.Email;
  }

  if (request.SpecialNeeds !== undefined) {
    validFields.push('SpecialNeeds = @specialNeeds');
    params.specialNeeds = request.SpecialNeeds;
  }

  if (request.MedicalInfo !== undefined) {
    validFields.push('MedicalInfo = @medicalInfo');
    params.medicalInfo = request.MedicalInfo;
  }

  if (validFields.length === 0) {
    throw new Error('No hay campos para actualizar');
  }

  validFields.push('UpdatedAt = GETDATE()');

  await query(
    `UPDATE Alumnos SET ${validFields.join(', ')} WHERE AlumnoId = @alumnoId`,
    params
  );

  const alumno = await getAlumnoById(alumnoId);
  if (!alumno) {
    throw new Error('Error al actualizar el alumno');
  }

  return alumno;
}

/**
 * Elimina un alumno (soft delete)
 */
export async function deleteAlumno(alumnoId: number): Promise<void> {
  await query(
    'UPDATE Alumnos SET IsActive = 0, UpdatedAt = GETDATE() WHERE AlumnoId = @alumnoId',
    { alumnoId }
  );
}

// ========== SERVICIOS PARA PROGENITORES ==========

/**
 * Obtiene todos los progenitores
 */
export async function getAllProgenitores(onlyActive: boolean = true): Promise<Progenitor[]> {
  const whereClause = onlyActive ? 'WHERE IsActive = 1' : '';
  return query<Progenitor>(
    `SELECT * FROM Progenitores ${whereClause} ORDER BY LastName, FirstName`
  );
}

/**
 * Obtiene un progenitor por ID
 */
export async function getProgenitorById(progenitorId: number): Promise<Progenitor | null> {
  return queryOne<Progenitor>(
    'SELECT * FROM Progenitores WHERE ProgenitorId = @progenitorId',
    { progenitorId }
  );
}

/**
 * Obtiene los progenitores de un alumno
 */
export async function getProgenitoresToAlumno(alumnoId: number): Promise<Progenitor[]> {
  return query<Progenitor>(
    `SELECT p.* FROM Progenitores p
     INNER JOIN AlumnoProgenitor ap ON p.ProgenitorId = ap.ProgenitorId
     WHERE ap.AlumnoId = @alumnoId AND p.IsActive = 1
     ORDER BY p.LastName, p.FirstName`,
    { alumnoId }
  );
}

/**
 * Busca progenitores por nombre o documento
 */
export async function searchProgenitors(searchTerm: string): Promise<Progenitor[]> {
  const term = `%${searchTerm}%`;
  return query<Progenitor>(
    `SELECT * FROM Progenitores 
     WHERE IsActive = 1 AND (
       FirstName LIKE @term OR 
       LastName LIKE @term OR 
       DocumentNumber LIKE @term OR
       Email LIKE @term
     )
     ORDER BY LastName, FirstName`,
    { term }
  );
}

/**
 * Crea un nuevo progenitor
 */
export async function createProgenitor(request: CreateProgenitorRequest): Promise<Progenitor> {
  const result = await query<any>(
    `INSERT INTO Progenitores (
      FirstName, LastName, RelationshipType, DocumentType, DocumentNumber,
      Phone, Email, Address, City, PostalCode, Occupation, WorkPhone,
      IsEmergencyContact, IsActive, CreatedAt, UpdatedAt
    ) VALUES (
      @firstName, @lastName, @relationshipType, @documentType, @documentNumber,
      @phone, @email, @address, @city, @postalCode, @occupation, @workPhone,
      @isEmergencyContact, 1, GETDATE(), GETDATE()
    );
    SELECT SCOPE_IDENTITY() as ProgenitorId;`,
    {
      firstName: request.FirstName,
      lastName: request.LastName,
      relationshipType: request.RelationshipType,
      documentType: request.DocumentType || null,
      documentNumber: request.DocumentNumber || null,
      phone: request.Phone || null,
      email: request.Email || null,
      address: request.Address || null,
      city: request.City || null,
      postalCode: request.PostalCode || null,
      occupation: request.Occupation || null,
      workPhone: request.WorkPhone || null,
      isEmergencyContact: request.IsEmergencyContact ? 1 : 0,
    }
  );

  const progenitorId = result[0].ProgenitorId;
  const progenitor = await getProgenitorById(progenitorId);
  if (!progenitor) {
    throw new Error('Error al crear el progenitor');
  }

  return progenitor;
}

/**
 * Actualiza un progenitor
 */
export async function updateProgenitor(
  progenitorId: number,
  request: UpdateProgenitorRequest
): Promise<Progenitor> {
  const validFields = [];
  const params: Record<string, any> = { progenitorId };

  if (request.FirstName !== undefined) {
    validFields.push('FirstName = @firstName');
    params.firstName = request.FirstName;
  }

  if (request.LastName !== undefined) {
    validFields.push('LastName = @lastName');
    params.lastName = request.LastName;
  }

  if (request.RelationshipType !== undefined) {
    validFields.push('RelationshipType = @relationshipType');
    params.relationshipType = request.RelationshipType;
  }

  if (request.DocumentType !== undefined) {
    validFields.push('DocumentType = @documentType');
    params.documentType = request.DocumentType;
  }

  if (request.DocumentNumber !== undefined) {
    validFields.push('DocumentNumber = @documentNumber');
    params.documentNumber = request.DocumentNumber;
  }

  if (request.Phone !== undefined) {
    validFields.push('Phone = @phone');
    params.phone = request.Phone;
  }

  if (request.Email !== undefined) {
    validFields.push('Email = @email');
    params.email = request.Email;
  }

  if (request.Address !== undefined) {
    validFields.push('Address = @address');
    params.address = request.Address;
  }

  if (request.City !== undefined) {
    validFields.push('City = @city');
    params.city = request.City;
  }

  if (request.PostalCode !== undefined) {
    validFields.push('PostalCode = @postalCode');
    params.postalCode = request.PostalCode;
  }

  if (request.Occupation !== undefined) {
    validFields.push('Occupation = @occupation');
    params.occupation = request.Occupation;
  }

  if (request.WorkPhone !== undefined) {
    validFields.push('WorkPhone = @workPhone');
    params.workPhone = request.WorkPhone;
  }

  if (request.IsEmergencyContact !== undefined) {
    validFields.push('IsEmergencyContact = @isEmergencyContact');
    params.isEmergencyContact = request.IsEmergencyContact ? 1 : 0;
  }

  if (validFields.length === 0) {
    throw new Error('No hay campos para actualizar');
  }

  validFields.push('UpdatedAt = GETDATE()');

  await query(
    `UPDATE Progenitores SET ${validFields.join(', ')} WHERE ProgenitorId = @progenitorId`,
    params
  );

  const progenitor = await getProgenitorById(progenitorId);
  if (!progenitor) {
    throw new Error('Error al actualizar el progenitor');
  }

  return progenitor;
}

/**
 * Elimina un progenitor (soft delete)
 */
export async function deleteProgenitor(progenitorId: number): Promise<void> {
  await query(
    'UPDATE Progenitores SET IsActive = 0, UpdatedAt = GETDATE() WHERE ProgenitorId = @progenitorId',
    { progenitorId }
  );
}

// ========== SERVICIOS PARA RELACIONES ALUMNO-PROGENITOR ==========

/**
 * Asocia un progenitor a un alumno
 */
export async function assignProgenitorToAlumno(
  alumnoId: number,
  progenitorId: number,
  isPrimaryContact: boolean = false
): Promise<void> {
  // Verificar que el alumno y progenitor existan
  const alumno = await getAlumnoById(alumnoId);
  const progenitor = await getProgenitorById(progenitorId);

  if (!alumno || !progenitor) {
    throw new Error('Alumno o progenitor no encontrado');
  }

  try {
    await query(
      `INSERT INTO AlumnoProgenitor (AlumnoId, ProgenitorId, IsPrimaryContact, CreatedAt)
       VALUES (@alumnoId, @progenitorId, @isPrimaryContact, GETDATE())`,
      {
        alumnoId,
        progenitorId,
        isPrimaryContact: isPrimaryContact ? 1 : 0,
      }
    );
  } catch (error: any) {
    if (error.message.includes('UNIQUE')) {
      throw new Error('Este progenitor ya está asociado al alumno');
    }
    throw error;
  }
}

/**
 * Desasocia un progenitor de un alumno
 */
export async function removeProgenitorFromAlumno(
  alumnoId: number,
  progenitorId: number
): Promise<void> {
  await query(
    `DELETE FROM AlumnoProgenitor
     WHERE AlumnoId = @alumnoId AND ProgenitorId = @progenitorId`,
    { alumnoId, progenitorId }
  );
}

/**
 * Obtiene el contacto primario de un alumno
 */
export async function getPrimaryContactForAlumno(alumnoId: number): Promise<Progenitor | null> {
  return queryOne<Progenitor>(
    `SELECT p.* FROM Progenitores p
     INNER JOIN AlumnoProgenitor ap ON p.ProgenitorId = ap.ProgenitorId
     WHERE ap.AlumnoId = @alumnoId AND ap.IsPrimaryContact = 1`,
    { alumnoId }
  );
}
