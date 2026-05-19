# Feria de Ciencias 2026 - Circo Científico Escolar

App externa para el recorrido de la feria. Pensada como Plan B operativo.

## Uso con alumnos

1. Abre `/#/login` y registra nombre, apellido y grupo.
2. Entra al `/#/mapa` para ver las carpas.
3. Abre un stand, escanea su QR o escribe el `qrSlug`.
4. Responde la trivia para sumar puntos.
5. Revisa tu avance en `/#/progreso`.

## Feedback

- El formulario intenta guardar en `public.feedback_institucional`.
- Si no hay conexión, guarda el feedback en `localStorage` de este dispositivo.
- No usa Google Forms.
- No depende de una ruta fantasma `/api/feedback`.

## Reinicio local

El progreso queda en este dispositivo. Para limpiar el estado local, abre la consola del navegador y ejecuta:

```js
localStorage.removeItem('feria_progress');
localStorage.removeItem('feria_eventEndTime');
localStorage.removeItem('feria_feedback_fallback');
sessionStorage.removeItem('feria_session');
location.reload();
```

## Métricas docentes

- Las métricas del panel docente son locales si no hay backend.
- Algunas cifras se muestran como `real`, `local` o `mock` para que quede claro su origen.

## Desarrollo

```bash
pnpm install
pnpm dev:vite
pnpm dev
pnpm lint
pnpm build
```

## Nota operativa

- El progreso se guarda en este dispositivo.
- El acceso docente depende del handoff validado desde SASE.
