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
GET /#/auth/handoff?token=<JWT>
```

Ejemplo:
```
https://feria-alternativa.vercel.app/#/auth/handoff?token=eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoidGVhY2hlciIsIm1vZHVsZSI6ImZlcmlhIn0.abc123signature
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
| `role` | string | sí | `"teacher"` \| `"admin"` \| `"staff"` |
| `module` | string | sí | **Debe ser `"feria"`** — cualquier otro valor es rechazado |
| `name` | string | no | Nombre del operador (se muestra en el panel) |
| `lastName` | string | no | Apellido del operador |
| `group` | string | no | Grupo asignado (visible en el panel) |
| `exp` | number (Unix) | no | Expiración en segundos desde epoch. Si se omite, no expira |
| `iat` | number (Unix) | no | Emitido en. Sin efecto en validación |

### Signature

- **Algoritmo:** HMAC-SHA256 (`HS256`)
- **Clave secreta:** Configurada en Feria Alternativa como variable de entorno `FERIA_SHARED_SECRET`
- **Payload firmado:** `base64url(header) + "." + base64url(payload)`

---

## Validación del lado de Feria Alternativa

El backend (`server.ts`) ejecuta esta secuencia:

1. **Formato:** ¿Tiene 3 segmentos? Si no → `401 "Formato de token inválido"`
2. **Module:** ¿`payload.module === "feria"`? Si no → `401 "El token no corresponde al módulo Feria"`
3. **Role:** ¿`payload.role in ("teacher","admin","staff")`? Si no → `401 "Rol no autorizado para el panel docente"`
4. **Exp:** ¿`payload.exp` es futuro (o no está presente)? Si expiró → `401 "El token ha expirado"`
5. **Signature:** Si `FERIA_SHARED_SECRET` está configurado, verifica HMAC-SHA256. Si no coincide → `401 "Firma del token inválida"`
6. **Si no hay `FERIA_SHARED_SECRET` configurado**, la firma NO se verifica (modo demo). Esto permite desarrollo sin compartir secretos.

---

## Respuesta del Backend

### Éxito (200)

```json
{
  "valid": true,
  "session": {
    "token": "uuid-de-sesion-interno",
    "role": "teacher",
    "name": "Juan",
    "lastName": "Pérez",
    "group": "3B",
    "expiresAt": 1747000000000
  }
}
```

### Error (401)

```json
{
  "valid": false,
  "error": "El token ha expirado"
}
```

---

## Configuración necesaria en Feria Alternativa

| Variable | Propósito | Ejemplo |
|----------|-----------|---------|
| `FERIA_SHARED_SECRET` | Clave HMAC para verificar firma del token (opcional en demo) | `"mi-secreto-compartido"` |
| `VITE_SUPABASE_URL` | URL del proyecto Supabase compartido | `https://uvnetpnjinxzhggoqmwz.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Anon key del proyecto Supabase | `sb_publishable_...` |

---

## Notas

- Feria Alternativa **nunca asigna roles en el cliente**. Todo token se valida contra el backend.
- Sin `FERIA_SHARED_SECRET`, la validación de firma se salta (modo demo / desarrollo local).
- En modo demo, el badge muestra "Demo" en lugar de "Real".
- En producción (Vercel), el backend Express NO corre — los endpoints `/api/feria/*` deben implementarse como serverless functions o el handoff se rechaza con "servidor no disponible".
