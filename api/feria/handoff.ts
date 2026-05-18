import { IncomingMessage, ServerResponse } from 'http';
import { verifySaseToken } from '../_shared/verifySaseToken';
import { createSessionCookie, SessionData } from '../_shared/feriaSession';

function json(res: ServerResponse, status: number, data: unknown) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(body);
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    json(res, 405, { ok: false, error: 'Método no permitido' });
    return;
  }

  let body = '';
  for await (const chunk of req) body += chunk;

  let token: string;
  try {
    const parsed = JSON.parse(body);
    token = parsed.token;
  } catch {
    json(res, 400, { ok: false, error: 'Cuerpo inválido' });
    return;
  }

  if (!token || typeof token !== 'string') {
    json(res, 400, { ok: false, error: 'Token no proporcionado' });
    return;
  }

  const result = verifySaseToken(token);
  if (!result.valid || !result.payload) {
    json(res, 401, { ok: false, error: result.error });
    return;
  }

  const { sub, role, name, lastName, group } = result.payload;
  const expiresAt = Date.now() + 1000 * 60 * 60 * 8;

  const session: SessionData = {
    sub,
    role,
    module: 'feria',
    name: name || 'Docente/Admin',
    lastName: lastName || '',
    group: group || '',
    expiresAt,
  };

  const cookie = createSessionCookie(session);

  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Set-Cookie': cookie,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });

  res.end(JSON.stringify({
    ok: true,
    mode: process.env.FERIA_SESSION_SECRET ? 'real' : 'demo',
    session: {
      sub: session.sub,
      role: session.role,
      module: session.module,
      name: session.name,
      lastName: session.lastName,
      group: session.group,
      expiresAt: session.expiresAt,
    },
  }));
}
