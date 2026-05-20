import crypto from 'crypto';

export interface HandoffPayload {
  sub: string;
  role: string;
  module: string;
  name?: string;
  lastName?: string;
  group?: string;
  groupId?: string;
  email?: string;
  exp: number;
  iat?: number;
}

export interface VerifyResult {
  valid: boolean;
  payload?: HandoffPayload;
  error?: string;
}

const FERIA_SHARED_SECRET = process.env.FERIA_SHARED_SECRET;

export function verifySaseToken(token: string): VerifyResult {
  try {
    if (!FERIA_SHARED_SECRET) {
      return { valid: false, error: 'Configuracion de seguridad incompleta' };
    }

    // SASE genera token de 2 partes: base64url(payload).base64url(hmac-sha256(payload))
    const parts = token.split('.');
    if (parts.length !== 2) {
      return { valid: false, error: 'Formato de token invalido' };
    }

    const [payloadB64, signatureB64] = parts;

    // Verificar firma HMAC-SHA256 sobre el payload base64url
    const expectedSignature = crypto
      .createHmac('sha256', FERIA_SHARED_SECRET)
      .update(payloadB64)
      .digest('base64url');

    if (signatureB64 !== expectedSignature) {
      return { valid: false, error: 'Firma del token invalida' };
    }

    const payload: HandoffPayload = JSON.parse(
      Buffer.from(payloadB64.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8')
    );

    if (!payload.sub || typeof payload.sub !== 'string') {
      return { valid: false, error: 'Token sin identificador de usuario (sub)' };
    }

    if (payload.module !== 'feria') {
      return { valid: false, error: 'El token no corresponde al modulo Feria' };
    }

    if (!['teacher', 'admin', 'staff'].includes(payload.role)) {
      return { valid: false, error: 'Rol no autorizado para el panel docente' };
    }

    if (typeof payload.exp !== 'number') {
      return { valid: false, error: 'Token sin expiracion (exp)' };
    }

    if (payload.exp * 1000 < Date.now()) {
      return { valid: false, error: 'El token ha expirado' };
    }

    if (payload.iat && payload.iat * 1000 > Date.now()) {
      return { valid: false, error: 'El token tiene un iat en el futuro' };
    }

    // SASE envia groupId, el contrato Feria espera group
    if (!payload.group && payload.groupId) {
      (payload as any).group = payload.groupId;
    }

    return { valid: true, payload };
  } catch {
    return { valid: false, error: 'No se pudo validar el token' };
  }
}
