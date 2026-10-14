# Informe de pruebas y cobertura

Ejecución: 14-10-2026, 3:36:59 a. m. (America/Santiago).

## Resultado unitario verificado

**10 casos ejecutados, 10 aprobados y 0 fallidos.**

Herramientas: Jasmine y Karma 6.4.4. Navegador: Chrome Headless 155.0.0.0 (Windows 10).

| Métrica | Cobertura | Cubierto / total |
| --- | --- | --- |
| Sentencias | 36,90% | 100 / 271 |
| Ramas | 32,12% | 71 / 221 |
| Funciones | 43,87% | 43 / 98 |
| Líneas | 39,74% | 93 / 234 |

## Método y proceso

La suite contiene diez pruebas unitarias simples de componentes. Cada caso declara ID, entrada y resultado esperado. Se monta un root React dentro de MemoryRouter y ProveedorTienda, con almacenamiento limpio por caso. act espera los cambios y el root se desmonta al terminar. Los eventos de clic, input y submit verifican el DOM y jasmine.createSpy comprueba los callbacks.

El bundle JSX se genera con esbuild. Istanbul instrumenta los módulos de src importados por la suite y karma-coverage produce HTML y JSON. main.jsx y la creación del navegador en routes.jsx no están instrumentados; las rutas y el arranque se comprueban con las suites de navegador. Las posiciones del HTML de cobertura corresponden al JavaScript transformado desde JSX. Estas métricas no equivalen a cobertura completa del sistema.

## Alcance

PU-001 a PU-005: contenido, tipo y visibilidad de Alerta, mensajes de AlertaFormulario, referencias React y contenido de Notificacion.

PU-006 a PU-010: datos y descuento de una tarjeta, callback al agregar al carrito, búsqueda del catálogo, alerta de carrito vacío y edición del precio desde FormularioProducto.

La suite unitaria se redujo a diez casos por solicitud del estudiante. La cobertura refleja los módulos importados por esas pruebas y no conserva el alcance de la suite anterior de 47 casos.

Las suites de navegador contienen 22 casos: 13 de navegación/sesión, cinco de estilos y cuatro de CRUD/filtros/compra. La compra aprobada también comprueba ingresos, pedidos, ticket promedio y unidades del panel de ventas. Los selectores de tarjetas usan article y las expectativas de textos y CSS corresponden al rediseño integrado. La suite de estilos abre las 18 pantallas a 1440 y 390 píxeles. La revisión visual genera 20 capturas de diez pantallas y comprueba desbordamiento horizontal y errores JavaScript.

## Repetir

Ejecutar npm run build y npm test. Para aislar suites: npm run test:unitarias, npm run test:e2e y npm run test:visual. Chrome o Edge son necesarios; CHROME_BIN permite seleccionar el ejecutable.

El reporte HTML reproducible queda en test-results/coverage/index.html. docs/resultados-pruebas.json conserva entradas, expectativas, estados y duración de cada caso. docs/Registro_Pruebas_Unitarias.xlsx traslada esos resultados al formato de la plantilla académica; la plantilla original se conserva.

## Límites y seguimiento

No se prueban backend, pasarela real, autorización de servidor, logística ni navegadores distintos de Chrome. La comparación test:parity conserva las expectativas del HTML original y las diferencias funcionales nuevas son intencionales; no se declara aprobada como equivalencia visual completa.

La instalación de Karma conserva tres alertas altas de desarrollo vinculadas a braces (GHSA-vfj7-8cjw-p6xm). La versión publicada consultada es 3.0.3, también afectada; la solución automática propuesta cambia a versiones anteriores de Karma/karma-jasmine. La configuración ejecuta pruebas únicas con patrones locales definidos por el proyecto. Revisar la actualización del proveedor antes de ampliar la herramienta a entradas no confiables. Esta dependencia no se importa en el frontend de producción.

## Casos ejecutados

| ID | Comprobación | Resultado |
| --- | --- | --- |
| PU-001 | Alerta muestra un mensaje de éxito | Aprobada |
| PU-002 | Alerta permite ocultar y mostrar el contenido | Aprobada |
| PU-003 | AlertaFormulario se oculta sin mensaje | Aprobada |
| PU-004 | AlertaFormulario muestra varios errores | Aprobada |
| PU-005 | Notificacion recibe su contenido | Aprobada |
| PU-006 | Tarjetas muestra el producto y su descuento | Aprobada |
| PU-007 | Agregar al carrito llama a la notificación | Aprobada |
| PU-008 | La búsqueda filtra el catálogo | Aprobada |
| PU-009 | El carrito vacío muestra una alerta | Aprobada |
| PU-010 | FormularioProducto entrega el precio editado | Aprobada |
