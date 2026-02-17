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
 * Base64URL encode
 */
function base64UrlEncode(str: string): string {
  // Encode to base64
  const base64 = btoa(str);
  // Replace characters for URL-safe version
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
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
 * Crea un JWT token usando Web Crypto API (Edge-compatible)
 */
export async function createTokenEdge(userId: number, email: string, role: string): Promise<string> {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const now = Math.floor(Date.now() / 1000);
  const expiresIn = 7 * 24 * 60 * 60; // 7 días en segundos

  const payload: JWTPayload = {
    userId,
    email,
    role,
    iat: now,
    exp: now + expiresIn
  };

  // Encode header and payload
  const headerB64 = base64UrlEncode(JSON.stringify(header));
  const payloadB64 = base64UrlEncode(JSON.stringify(payload));

  // Create signature
  const encoder = new TextEncoder();
  const data = encoder.encode(`${headerB64}.${payloadB64}`);
  const secretKey = encoder.encode(JWT_SECRET);

  // Import the secret key
  const key = await crypto.subtle.importKey(
    'raw',
    secretKey,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  // Sign the data
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, data);

  // Convert signature to base64url
  const signatureArray = Array.from(new Uint8Array(signatureBuffer));
  const signatureString = String.fromCharCode(...signatureArray);
  const signatureB64 = base64UrlEncode(signatureString);

  return `${headerB64}.${payloadB64}.${signatureB64}`;
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
