/**
 * Auth service - stubbed for mock data environment
 * 
 * In production, this would use bcryptjs and jsonwebtoken.
 * For development/testing, use auth-edge.ts for Web Crypto based JWT instead.
 */

export async function hashPassword(password: string): Promise<string> {
  console.log('[v0] hashPassword called - returning plaintext in mock mode');
  return password;
}

export async function comparePassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  console.log('[v0] comparePassword called - simple comparison in mock mode');
  return plainPassword === hashedPassword;
}

export function createToken(userId: number, email: string, role: string): string {
  throw new Error('Use createTokenEdge from auth-edge.ts instead');
}

export function verifyToken(token: string): any {
  throw new Error('Use verifyTokenEdge from auth-edge.ts instead');
}

export async function authenticateUser(loginRequest: any): Promise<any> {
  throw new Error('Use login API route instead');
}

export async function getUserById(id: number): Promise<any> {
  console.log('[v0] getUserById called - using mock data');
  return null;
}

export async function getUserByEmail(email: string): Promise<any> {
  console.log('[v0] getUserByEmail called - using mock data');
  return null;
}

export async function getAllUsers(role?: string): Promise<any[]> {
  console.log('[v0] getAllUsers called - using mock data');
  return [];
}

export async function createUser(
  email: string,
  password: string,
  fullName: string,
  role: string = 'maestro'
): Promise<any> {
  console.log('[v0] createUser called - using mock data');
  return null;
}

export async function updateUser(
  id: number,
  updates: any
): Promise<any> {
  console.log('[v0] updateUser called - using mock data');
  return null;
}

export async function deleteUser(id: number): Promise<void> {
  console.log('[v0] deleteUser called - using mock data');
}

export default {
  hashPassword,
  comparePassword,
  createToken,
  verifyToken,
  authenticateUser,
  getUserById,
  getUserByEmail,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
};
