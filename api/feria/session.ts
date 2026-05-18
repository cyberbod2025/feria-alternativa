import { IncomingMessage, ServerResponse } from 'http';
import { readSessionFromCookie } from '../_shared/feriaSession';

function json(res: ServerResponse, status: number, data: unknown) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(body);
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  if (req.method !== 'GET') {
    json(res, 405, { ok: false, error: 'Método no permitido' });
    return;
  }

  const session = readSessionFromCookie(req.headers.cookie);

  if (!session) {
    json(res, 401, { ok: false, mode: 'offline', error: 'No hay sesión activa' });
    return;
  }

  json(res, 200, {
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
  });
}
