import { scryptSync, randomBytes, timingSafeEqual, createHmac } from 'crypto';
import { prisma } from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'escape-admin-secret-key-at-least-32-chars-long';

/**
 * Hashes a plain text password using scrypt
 */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verifies a password against a stored scrypt hash
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, hash] = storedHash.split(':');
    if (!salt || !hash) return false;
    const verifyHash = scryptSync(password, salt, 64).toString('hex');
    return timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(verifyHash, 'hex'));
  } catch (e) {
    return false;
  }
}

/**
 * Signs a payload to generate a JWT token
 */
export function signToken(payload: any): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = createHmac('sha256', JWT_SECRET)
    .update(`${header}.${data}`)
    .digest('base64url');
  return `${header}.${data}.${signature}`;
}

/**
 * Verifies a JWT token and returns the payload if valid
 */
export function verifyToken(token: string): any | null {
  try {
    const [header, data, signature] = token.split('.');
    if (!header || !data || !signature) return null;
    const expectedSignature = createHmac('sha256', JWT_SECRET)
      .update(`${header}.${data}`)
      .digest('base64url');
    if (signature !== expectedSignature) return null;
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf8'));
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch (e) {
    return null;
  }
}

/**
 * Gets the admin user details from a session token
 */
export async function getAdminFromToken(token: string) {
  const payload = verifyToken(token);
  if (!payload || !payload.id) return null;
  return prisma.admin.findUnique({
    where: { id: payload.id },
    select: { id: true, email: true, createdAt: true }
  });
}
