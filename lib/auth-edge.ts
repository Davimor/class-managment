/**
 * Edge-compatible JWT verification using Web Crypto API
 * This file can be imported in middleware (Edge Runtime)
 */

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key-must-be-changed';

interface JWTPayload {
  userId: number;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

/**
 * Base64URL decode
 */
function base64UrlDecode(str: string): string {
  // Replace URL-safe characters
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  // Add padding
  while (str.length % 4) {
    str += '=';
  }
  // Decode base64
  try {
    return atob(str);
  } catch (e) {
    throw new Error('Invalid base64 string');
  }
}

/**
 * Verifica y decodifica un JWT token usando Web Crypto API (Edge-compatible)
 */
export async function verifyTokenEdge(token: string): Promise<JWTPayload> {
  try {
    if (!token) {
      throw new Error('Token is required');
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Token inválido');
    }

    const [headerB64, payloadB64, signatureB64] = parts;

    // Decode payload
    const payloadJson = base64UrlDecode(payloadB64);
    const payload: JWTPayload = JSON.parse(payloadJson);

    // Check expiration
    if (payload.exp) {
      const now = Math.floor(Date.now() / 1000);
      if (now > payload.exp) {
        throw new Error('Token expirado');
      }
    }

    // Verify signature using Web Crypto API
    const encoder = new TextEncoder();
    const data = encoder.encode(`${headerB64}.${payloadB64}`);
    const secretKey = encoder.encode(JWT_SECRET);

    // Import the secret key
    const key = await crypto.subtle.importKey(
      'raw',
      secretKey,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    // Decode the signature
    const signatureBytes = Uint8Array.from(
      base64UrlDecode(signatureB64),
      (c) => c.charCodeAt(0)
    );

    // Verify the signature
    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signatureBytes,
      data
    );

    if (!isValid) {
      throw new Error('Firma de token inválida');
    }

    return payload;
  } catch (error) {
    throw new Error('Token inválido o expirado');
  }
}

/**
 * Simple token decode without verification (for quick checks)
 * WARNING: Only use this for non-security-critical operations
 */
export function decodeTokenUnsafe(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payloadJson = base64UrlDecode(parts[1]);
    return JSON.parse(payloadJson);
  } catch (error) {
    return null;
  }
}
