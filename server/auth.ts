/**
 * Copyright (c) 2026 Altivio Ltd. All rights reserved.
 * Proprietary and confidential.
 */

import crypto from 'crypto';
import type { Request, Response, NextFunction } from 'express';
import type { AuthUser, UserRole } from '../src/types/altivio';

export const SESSION_COOKIE_NAME = 'altivio_session';

// Use env SESSION_SECRET if provided, otherwise derive a deterministic process secret in dev
const SESSION_SECRET =
  process.env.SESSION_SECRET ||
  crypto
    .createHash('sha256')
    .update(process.env.APP_URL || 'altivio-os-dev-secret-2026')
    .digest('hex');

interface StoredCredential {
  user: AuthUser;
  salt: string;
  passwordHash: string;
}

function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

function verifyPassword(password: string, salt: string, expectedHash: string): boolean {
  const actual = Buffer.from(hashPassword(password, salt), 'hex');
  const expected = Buffer.from(expectedHash, 'hex');
  if (actual.length !== expected.length) return false;
  return crypto.timingSafeEqual(actual, expected);
}

function createCredential(user: AuthUser, plainPassword: string): StoredCredential {
  const salt = crypto.randomBytes(16).toString('hex');
  return {
    user,
    salt,
    passwordHash: hashPassword(plainPassword, salt),
  };
}

const CREDENTIAL_STORE: StoredCredential[] = [
  createCredential(
    {
      id: 'u-altivio-admin',
      email: 'admin@altivio.com',
      name: 'Liam Vance',
      role: 'altivio_admin',
    },
    'altivio-admin-2026'
  ),
  createCredential(
    {
      id: 'u-apex-dental',
      email: 'dr.sterling@apexdentalstudio.com',
      name: 'Dr. Julian Sterling',
      role: 'client_owner',
      tenantId: 't-apex-dental',
      tenantSlug: 'apex-dental',
    },
    'apex-client-2026'
  ),
  createCredential(
    {
      id: 'u-kova-atelier',
      email: 'mireille@kova-atelier.com',
      name: 'Mireille Kova',
      role: 'client_owner',
      tenantId: 't-kova-atelier',
      tenantSlug: 'kova-atelier',
    },
    'kova-client-2026'
  ),
  createCredential(
    {
      id: 'u-summit-hvac',
      email: 'ron@summithvacservices.com',
      name: 'Ron Gallagher',
      role: 'client_owner',
      tenantId: 't-summit-hvac',
      tenantSlug: 'summit-hvac',
    },
    'summit-client-2026'
  ),
];

export function authenticateCredentials(email: string, password: string): AuthUser | null {
  const normalized = email.trim().toLowerCase();
  const record = CREDENTIAL_STORE.find((c) => c.user.email.toLowerCase() === normalized);
  if (!record) return null;
  if (!verifyPassword(password, record.salt, record.passwordHash)) return null;
  return record.user;
}

export function registerClientCredential(user: AuthUser, plainPassword: string): void {
  const existing = CREDENTIAL_STORE.find(
    (c) => c.user.email.toLowerCase() === user.email.toLowerCase()
  );
  if (!existing) {
    CREDENTIAL_STORE.push(createCredential(user, plainPassword));
  }
}

interface TokenPayload {
  user: AuthUser;
  exp: number;
}

export function signSessionToken(user: AuthUser, ttlMs = 1000 * 60 * 60 * 12): string {
  const payload: TokenPayload = {
    user,
    exp: Date.now() + ttlMs,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(encoded).digest('base64url');
  return `${encoded}.${signature}`;
}

export function verifySessionToken(token: string): AuthUser | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [encoded, sig] = parts;
    const expectedSig = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(encoded)
      .digest('base64url');

    const sigBuf = Buffer.from(sig);
    const expectedBuf = Buffer.from(expectedSig);
    if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as TokenPayload;
    if (!payload.exp || Date.now() > payload.exp) return null;
    return payload.user;
  } catch {
    return null;
  }
}

function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;
  cookieHeader.split(';').forEach((pair) => {
    const idx = pair.indexOf('=');
    if (idx > -1) {
      const key = pair.slice(0, idx).trim();
      const val = pair.slice(idx + 1).trim();
      cookies[key] = decodeURIComponent(val);
    }
  });
  return cookies;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

export function extractTokenFromRequest(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }
  const cookies = parseCookies(req.headers.cookie);
  return cookies[SESSION_COOKIE_NAME] || null;
}

export function authenticateRequest(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = extractTokenFromRequest(req);
  if (!token) {
    return res.status(401).json({ error: 'Authentication required.' });
  }
  const user = verifySessionToken(token);
  if (!user) {
    return res.status(401).json({ error: 'Invalid or expired session.' });
  }
  req.user = user;
  return next();
}

export function requireRole(role: UserRole) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }
    if (req.user.role !== role) {
      return res.status(403).json({
        error: 'Forbidden: Altivio administrator role required.',
      });
    }
    return next();
  };
}

export function requireTenantAccess(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required.' });
  }
  const targetTenantId = req.params.tenantId || req.body?.tenantId;
  if (!targetTenantId) {
    return res.status(400).json({ error: 'Tenant identifier missing.' });
  }
  if (req.user.role === 'altivio_admin') {
    return next();
  }
  if (req.user.tenantId !== targetTenantId) {
    return res.status(403).json({
      error: 'Forbidden: Cross-tenant access is strictly prohibited.',
    });
  }
  return next();
}
