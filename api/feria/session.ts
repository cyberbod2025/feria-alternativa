import { IncomingMessage, ServerResponse } from 'http';
import { readSessionFromCookie } from '../_shared/feriaSession';

function connectionMode() {
  return process.env.FERIA_SHARED_SECRET ? 'real' : 'demo';
}

function json(res: ServerResponse, status: number, data: unknown) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Credentials': 'true',
  });
  res.end(body);
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Credentials': 'true',
    });
    res.end();
    return;
  }

  if (req.method !== 'GET') {
    json(res, 405, { ok: false, error: 'Metodo no permitido' });
    return;
  }

  const session = readSessionFromCookie(req.headers.cookie);

  if (!session) {
    json(res, 401, { ok: false, mode: 'offline', error: 'No hay sesion activa' });
    return;
  }

  json(res, 200, {
    ok: true,
    mode: connectionMode(),
    session: {
      sub: session.sub,
      role: session.role,
      module: session.module,
      name: session.name,
      lastName: session.lastName,
      group: session.group,
      expiresAt: session.expiresAt,
    },
  });
}
