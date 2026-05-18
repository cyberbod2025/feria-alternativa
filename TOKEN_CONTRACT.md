# Contrato de Token — Handoff SASE → Feria Alternativa

## Propósito

SASE redirige al usuario a Feria Alternativa con un token JWT en el query string.
Feria Alternativa valida el token contra su backend (`POST /api/feria/handoff`)
y crea una sesión si es válido.

**Feria Alternativa no modifica SASE ni su lógica de emisión de tokens.**
Este documento especifica el formato exacto que SASE debe producir.

---

## Endpoint

```
GET /#/auth/handoff?sase_token=<JWT>
```

Ejemplo:
```
https://feria-alternativa.vercel.app/#/auth/handoff?sase_token=eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoidGVhY2hlciIsIm1vZHVsZSI6ImZlcmlhIiwic3ViIjoiMTIzIn0.abc123signature
```

---

## Formato del Token

**Tipo:** JWT estándar (3 segmentos separados por `.`: `header.payload.signature`)

### Header

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

### Payload (claims)

```json
{
  "sub": "uuid-del-usuario",
  "role": "teacher",
  "module": "feria",
  "name": "Juan",
  "lastName": "Pérez",
  "group": "3B",
  "exp": 1747000000,
  "iat": 1746913600
}
```

| Claim | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `sub` | string | sí | Identificador único del usuario en SASE |
| `role` | string | sí | `"teacher"` \| `"admin"` \| `"staff"` |
| `module` | string | sí | **Debe ser `"feria"`** — cualquier otro valor es rechazado |
| `name` | string | no | Nombre del operador (se muestra en el panel) |
| `lastName` | string | no | Apellido del operador |
| `group` | string | no | Grupo asignado (visible en el panel) |
| `exp` | number (Unix) | sí | Expiración en segundos desde epoch |
| `iat` | number (Unix) | no | Emitido en. Si está en el futuro, el token se rechaza |

### Signature

- **Algoritmo:** HMAC-SHA256 (`HS256`)
- **Clave secreta:** Configurada en Feria Alternativa como variable de entorno `FERIA_SHARED_SECRET`
- **Payload firmado:** `base64url(header) + "." + base64url(payload)`

---

## Validación del lado de Feria Alternativa

El endpoint `POST /api/feria/handoff` (Vercel Function) ejecuta esta secuencia:

1. **Formato:** ¿Tiene 3 segmentos? Si no → `401 "Formato de token inválido"`
2. **Sub:** ¿`payload.sub` es un string no vacío? Si no → `401 "Token sin identificador de usuario (sub)"`
3. **Module:** ¿`payload.module === "feria"`? Si no → `401 "El token no corresponde al módulo Feria"`
4. **Role:** ¿`payload.role in ("teacher","admin","staff")`? Si no → `401 "Rol no autorizado para el panel docente"`
5. **Exp:** ¿`payload.exp * 1000 > Date.now()`? Si expiró → `401 "El token ha expirado"`
6. **Iat:** ¿`payload.iat * 1000 <= Date.now()`? Si está en futuro → `401 "El token tiene un iat en el futuro"`
7. **Signature:** Si `FERIA_SHARED_SECRET` está configurado, verifica HMAC-SHA256. Si no coincide → `401 "Firma del token inválida"`
8. **Si no hay `FERIA_SHARED_SECRET` configurado**, la firma NO se verifica (modo demo). Esto permite desarrollo sin compartir secretos.

---

## Respuesta del Backend

### Éxito (200)

```json
{
  "ok": true,
  "mode": "real",
  "session": {
    "sub": "uuid-del-usuario",
    "role": "teacher",
    "module": "feria",
    "name": "Juan",
    "lastName": "Pérez",
    "group": "3B",
    "expiresAt": 1747000000000
  }
}
```

- La sesión viaja en una cookie `feria_session` HttpOnly, Secure, SameSite=Lax, cifrada con AES-256-GCM.
- El cliente nunca ve el token interno. El campo `sub` identifica al usuario.

### Error (401)

```json
{
  "ok": false,
  "error": "El token ha expirado"
}
```

---

## Configuración necesaria en Feria Alternativa

| Variable | Propósito | Ejemplo |
|----------|-----------|---------|
| `FERIA_SHARED_SECRET` | Clave HMAC para verificar firma del token (opcional en demo) | `"mi-secreto-compartido"` |
| `FERIA_SESSION_SECRET` | Clave AES-256-GCM para cifrar cookie de sesión | `"otro-secreto-para-session"` |
| `VITE_SUPABASE_URL` | URL del proyecto Supabase compartido | `https://uvnetpnjinxzhggoqmwz.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Anon key del proyecto Supabase | `sb_publishable_...` |

---

## Notas

- Feria Alternativa **nunca asigna roles en el cliente**. Todo token se valida contra el backend.
- Sin `FERIA_SHARED_SECRET`, la validación de firma se salta (modo demo / desarrollo local).
- Sin `FERIA_SESSION_SECRET`, se usa `FERIA_SHARED_SECRET` como fallback para cifrar la cookie.
- En modo demo, el badge muestra "Demo" en lugar de "Real".
- Los endpoints `/api/feria/*` son Vercel Functions. En desarrollo local, `server.ts` replica los mismos endpoints usando la lógica compartida en `api/_shared/`.
