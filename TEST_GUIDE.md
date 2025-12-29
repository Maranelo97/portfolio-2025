# Test Guide

✅ Objetivo: mantener 100% de coverage con Karma + Jasmine.

Comandos:

- `npm test` — Ejecuta tests en modo watch (local).
- `npm run test:ci` — Ejecuta en headless para CI con reporte de cobertura.

Buenas prácticas:

- Escribir tests unitarios por archivo con cobertura de statements/branches/functions/lines.
- Mockear Http con `HttpClientTestingModule`.
- Para services que usan `NgZone` o `ApplicationRef`, usa mocks ligeros para evitar dependencias del scheduler.
- Para directivas o componentes con `gsap` usa `spyOn(gsap, 'to')` / `spyOn(gsap, 'set')` para aislar animaciones.
- Preferir tests unitarios que creen instancias (Object.create) para aislar lógica DOM heavy.

CI:

- El workflow `ci-tests.yml` ejecuta `npm run test:ci` y fallará si la cobertura global no cumple el threshold.

Nota: no modifiques código de producción para "forzar" cobertura; en su lugar añade tests que validen rutas alternativas y errores.
