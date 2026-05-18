import crypto from 'crypto';

export interface HandoffPayload {
  sub: string;
  role: string;
  module: string;
  name?: string;
  lastName?: string;
  group?: string;
  exp?: number;
  iat?: number;
}

export interface VerifyResult {
  valid: boolean;
  payload?: HandoffPayload;
  error?: string;
}

const FERIA_SHARED_SECRET = process.env.FERIA_SHARED_SECRET || '';

export function verifySaseToken(token: string): VerifyResult {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return { valid: false, error: 'Formato de token inválido' };
    }

    const [headerB64, payloadB64, signatureB64] = parts;

    const payload: HandoffPayload = JSON.parse(
      Buffer.from(payloadB64.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8')
    );

    if (!payload.sub || typeof payload.sub !== 'string') {
      return { valid: false, error: 'Token sin identificador de usuario (sub)' };
    }

    if (payload.module !== 'feria') {
      return { valid: false, error: 'El token no corresponde al módulo Feria' };
    }

    if (!['teacher', 'admin', 'staff'].includes(payload.role)) {
      return { valid: false, error: 'Rol no autorizado para el panel docente' };
    }

    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return { valid: false, error: 'El token ha expirado' };
    }

    if (payload.iat && payload.iat * 1000 > Date.now()) {
      return { valid: false, error: 'El token tiene un iat en el futuro' };
    }

    if (FERIA_SHARED_SECRET) {
      const expectedSignature = crypto
        .createHmac('sha256', FERIA_SHARED_SECRET)
        .update(`${headerB64}.${payloadB64}`)
        .digest('base64url');

      if (signatureB64 !== expectedSignature) {
        return { valid: false, error: 'Firma del token inválida' };
      }
    }

    return { valid: true, payload };
  } catch {
    return { valid: false, error: 'No se pudo validar el token' };
  }
}
