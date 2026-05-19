import { IncomingMessage, ServerResponse } from 'http';
import { clearSessionCookie } from '../_shared/feriaSession';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Credentials': 'true',
    });
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: false, error: 'Metodo no permitido' }));
    return;
  }

  const cookie = clearSessionCookie();

  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Set-Cookie': cookie,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Credentials': 'true',
  });

  res.end(JSON.stringify({ ok: true }));
}
