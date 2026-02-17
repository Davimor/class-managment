'use server';

import { verifyTokenEdge } from './auth-edge';
import { NextRequest, NextResponse } from 'next/server';

export interface AuthDecoded {
  userId: number;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

/**
 * Middleware helper para verificar autenticación en rutas API
 */
export async function verifyAuth(request: NextRequest): Promise<{ decoded?: AuthDecoded; error?: NextResponse }> {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return {
        error: NextResponse.json({ error: 'No authorization header' }, { status: 401 }),
      };
    }

    const token = authHeader.substring(7);
    const decoded = await verifyTokenEdge(token);
    return { decoded };
  } catch (error: any) {
    return {
      error: NextResponse.json({ error: error.message || 'Invalid token' }, { status: 401 }),
    };
  }
}

/**
 * Middleware helper para verificar rol específico
 */
export async function verifyAuthAndRole(
  request: NextRequest,
  allowedRoles: string[]
): Promise<{ decoded?: AuthDecoded; error?: NextResponse }> {
  const { decoded, error } = await verifyAuth(request);

  if (error) {
    return { error };
  }

  if (!decoded || !allowedRoles.includes(decoded.role)) {
    return {
      error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
    };
  }

  return { decoded };
}
