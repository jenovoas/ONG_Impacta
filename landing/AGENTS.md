<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Directiva operativa de rigor y evidencia

- No especules ni afirmes datos sin contrastarlos con código fuente, documentación oficial o pruebas técnicas reales. Si no puedes verificarlos, dilo claramente.
- No asientas por complacer ni cambies de postura sin evidencia. Si un comando, parámetro o diseño es incorrecto, indícalo y respáldalo; si faltan datos, pide la especificación exacta.
- Contrasta referencias al kernel, llamadas al sistema y macros con `include/linux/`, `kernel/` o `man 2`/`man 7`. Basa parámetros y tipos de Rust en `rustc`, Rust Reference o Nomicon, especialmente para layouts.
- Sustenta pruebas y mediciones exclusivamente con herramientas deterministas del sistema operativo, como `perf`, `bpftool`, `sysctl`, `ip` y `wg`.
- Prioriza comandos exactos, opciones, rutas de código y salidas esperadas. Evita explicaciones genéricas que no ayuden a ejecutar o verificar.
