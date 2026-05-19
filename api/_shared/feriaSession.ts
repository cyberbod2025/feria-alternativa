import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const COOKIE_NAME = 'feria_session';

export interface SessionData {
  sub: string;
  role: string;
  module: string;
  name: string;
  lastName: string;
  group: string;
  expiresAt: number;
}

function getKey(): Buffer {
  const secret = process.env.FERIA_SESSION_SECRET || process.env.FERIA_SHARED_SECRET || '';
  return crypto.scryptSync(secret, 'feria-session-salt', 32);
}

export function createSessionCookie(data: SessionData): string {
  const key = getKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const plaintext = JSON.stringify(data);
  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const tag = cipher.getAuthTag().toString('hex');

  const payload = `${iv.toString('hex')}:${tag}:${encrypted}`;
  const maxAge = Math.floor((data.expiresAt - Date.now()) / 1000);

  return `${COOKIE_NAME}=${payload}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${Math.max(0, maxAge)}`;
}

export function readSessionFromCookie(cookieHeader?: string): SessionData | null {
  if (!cookieHeader) return null;

  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  if (!match) return null;

  const parts = match[1].split(':');
  if (parts.length !== 3) return null;

  try {
    const key = getKey();
    const iv = Buffer.from(parts[0], 'hex');
    const tag = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);

    let plaintext = decipher.update(encrypted, 'hex', 'utf8');
    plaintext += decipher.final('utf8');

    const data: SessionData = JSON.parse(plaintext);
    if (data.expiresAt < Date.now()) return null;

    return data;
  } catch {
    return null;
  }
}

export function clearSessionCookie(): string {
  return `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`;
}
