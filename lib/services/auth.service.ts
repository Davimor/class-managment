import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query, queryOne } from '@/lib/db';
import { User, LoginRequest, AuthResponse } from '@/lib/types';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key-must-be-changed';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '7d';

/**
 * Hashea una contraseña
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcryptjs.genSalt(10);
  return bcryptjs.hash(password, salt);
}

/**
 * Compara una contraseña con su hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcryptjs.compare(password, hash);
}

/**
 * Crea un JWT token
 */
export function createToken(userId: number, email: string, role: string): string {
  return jwt.sign(
    { userId, email, role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRATION }
  );
}

/**
 * Verifica y decodifica un JWT token
 */
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Token inválido o expirado');
  }
}

/**
 * Autentica un usuario
 */
export async function authenticateUser(loginRequest: LoginRequest): Promise<AuthResponse> {
  const { email, password } = loginRequest;

  // Buscar el usuario por email
  const user = await queryOne<User>(
    'SELECT * FROM Users WHERE Email = @email AND IsActive = 1',
    { email }
  );

  if (!user) {
    throw new Error('Credenciales inválidas');
  }

  // Verificar contraseña
  const isPasswordValid = await comparePassword(password, user.PasswordHash);
  if (!isPasswordValid) {
    throw new Error('Credenciales inválidas');
  }

  // Crear token JWT
  const token = createToken(user.UserId, user.Email, user.Role);

  return {
    token,
    user: {
      ...user,
      PasswordHash: '', // No retornar el hash
    },
    expiresIn: 7 * 24 * 60 * 60, // 7 días en segundos
  };
}

/**
 * Obtiene un usuario por ID
 */
export async function getUserById(userId: number): Promise<User | null> {
  return queryOne<User>(
    'SELECT * FROM Users WHERE UserId = @userId AND IsActive = 1',
    { userId }
  );
}

/**
 * Obtiene un usuario por email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  return queryOne<User>(
    'SELECT * FROM Users WHERE Email = @email AND IsActive = 1',
    { email }
  );
}

/**
 * Crea un nuevo usuario
 */
export async function createUser(
  email: string,
  password: string,
  fullName: string,
  role: 'admin' | 'maestro' | 'secretaria' = 'maestro'
): Promise<User> {
  // Verificar si el email ya existe
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    throw new Error('El email ya está registrado');
  }

  // Hashear contraseña
  const passwordHash = await hashPassword(password);

  // Validar contraseña segura (mínimo 8 caracteres)
  if (password.length < 8) {
    throw new Error('La contraseña debe tener al menos 8 caracteres');
  }

  // Insertar el usuario
  const result = await query<any>(
    `INSERT INTO Users (Email, PasswordHash, FullName, Role, IsActive, CreatedAt, UpdatedAt)
     VALUES (@email, @passwordHash, @fullName, @role, 1, GETDATE(), GETDATE());
     SELECT SCOPE_IDENTITY() as UserId;`,
    { email, passwordHash, fullName, role }
  );

  if (!result || result.length === 0) {
    throw new Error('Error al crear el usuario');
  }

  const userId = result[0].UserId;
  const newUser = await getUserById(userId);

  if (!newUser) {
    throw new Error('Error al recuperar el usuario creado');
  }

  return newUser;
}

/**
 * Actualiza un usuario
 */
export async function updateUser(
  userId: number,
  updates: {
    email?: string;
    fullName?: string;
    role?: 'admin' | 'maestro' | 'secretaria';
    isActive?: boolean;
  }
): Promise<User> {
  const validFields = [];
  const params: Record<string, any> = { userId };

  if (updates.email !== undefined) {
    validFields.push('Email = @email');
    params.email = updates.email;
  }

  if (updates.fullName !== undefined) {
    validFields.push('FullName = @fullName');
    params.fullName = updates.fullName;
  }

  if (updates.role !== undefined) {
    validFields.push('Role = @role');
    params.role = updates.role;
  }

  if (updates.isActive !== undefined) {
    validFields.push('IsActive = @isActive');
    params.isActive = updates.isActive;
  }

  if (validFields.length === 0) {
    throw new Error('No hay campos para actualizar');
  }

  validFields.push('UpdatedAt = GETDATE()');

  const updateQuery = `
    UPDATE Users
    SET ${validFields.join(', ')}
    WHERE UserId = @userId
  `;

  await query(updateQuery, params);

  const updatedUser = await getUserById(userId);
  if (!updatedUser) {
    throw new Error('Error al actualizar el usuario');
  }

  return updatedUser;
}

/**
 * Obtiene todos los usuarios
 */
export async function getAllUsers(role?: string): Promise<User[]> {
  let queryStr = 'SELECT * FROM Users WHERE IsActive = 1';
  const params: Record<string, any> = {};

  if (role) {
    queryStr += ' AND Role = @role';
    params.role = role;
  }

  queryStr += ' ORDER BY CreatedAt DESC';

  return query<User>(queryStr, params);
}

/**
 * Elimina un usuario (soft delete)
 */
export async function deleteUser(userId: number): Promise<void> {
  await query(
    'UPDATE Users SET IsActive = 0, UpdatedAt = GETDATE() WHERE UserId = @userId',
    { userId }
  );
}
