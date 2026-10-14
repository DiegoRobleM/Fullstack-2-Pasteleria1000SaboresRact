# Informe de pruebas y cobertura

Ejecución: 13-10-2026, 9:49:45 p. m. (America/Santiago).

## Resultado unitario verificado

**47 casos ejecutados, 47 aprobados y 0 fallidos.**

Herramientas: Jasmine y Karma 6.4.4. Navegador: Chrome Headless 155.0.0.0 (Windows 10).

| Métrica | Cobertura | Cubierto / total |
| --- | --- | --- |
| Sentencias | 80,73% | 394 / 488 |
| Ramas | 73,87% | 263 / 356 |
| Funciones | 76,70% | 135 / 176 |
| Líneas | 81,23% | 355 / 437 |

## Método y proceso

Cada caso declara su ID, entrada y resultado esperado antes de la ejecución. Las aserciones comparan lógica y comportamiento reales. Los servicios usan almacenamiento limpio por caso. Las pruebas de componentes montan un root React dentro de MemoryRouter y ProveedorTienda, simulan inputs/selects/clics/submits y verifican DOM y persistencia. act espera los cambios de React y cada root se desmonta al finalizar. jasmine.createSpy verifica los callbacks recibidos por props.

El bundle JSX se genera con esbuild. Istanbul instrumenta los módulos de src importados por la suite y karma-coverage produce HTML y JSON. main.jsx y la creación del navegador en routes.jsx no están instrumentados; las rutas y el arranque se comprueban con las suites de navegador. Las posiciones del HTML de cobertura corresponden al JavaScript transformado desde JSX. Estas métricas no equivalen a cobertura completa del sistema.

## Alcance

PU-001 a PU-020: almacenamiento inválido, cantidades, descuentos, CRUD, validaciones, registro, credenciales, sesiones, administrador demo, consultas, compra e historial.

PU-021 a PU-047: renderizado, props, spies, estado de búsqueda y formularios, eventos, mensajes condicionales, carrito, detalle, administración, protección de rutas, checkout, rechazo, confirmación e historial.

Las suites de navegador contienen 22 casos: 13 de navegación/sesión, cinco de estilos y cuatro de CRUD/filtros/compra. La suite de estilos abre las 18 pantallas a 1440 y 390 píxeles. También se generaron 20 capturas de diez pantallas y se comprobó ausencia de desbordamiento horizontal y errores JavaScript. Se revisaron visualmente carrito, checkout, perfil y administración.

## Repetir

Ejecutar npm run build y npm test. Para aislar suites: npm run test:unitarias, npm run test:e2e y npm run test:visual. Chrome o Edge son necesarios; CHROME_BIN permite seleccionar el ejecutable.

El reporte HTML reproducible queda en test-results/coverage/index.html. docs/resultados-pruebas.json conserva entradas, expectativas, estados y duración de cada caso. docs/Registro_Pruebas_Unitarias.xlsx traslada esos resultados al formato de la plantilla académica; la plantilla original se conserva.

## Límites y seguimiento

No se prueban backend, pasarela real, autorización de servidor, logística ni navegadores distintos de Chrome. La comparación test:parity conserva las expectativas del HTML original y las diferencias funcionales nuevas son intencionales; no se declara aprobada como equivalencia visual completa.

La instalación de Karma conserva tres alertas altas de desarrollo vinculadas a braces (GHSA-vfj7-8cjw-p6xm). La versión publicada consultada es 3.0.3, también afectada; la solución automática propuesta cambia a versiones anteriores de Karma/karma-jasmine. La configuración ejecuta pruebas únicas con patrones locales definidos por el proyecto. Revisar la actualización del proveedor antes de ampliar la herramienta a entradas no confiables. Esta dependencia no se importa en el frontend de producción.

## Casos ejecutados

| ID | Comprobación | Resultado |
| --- | --- | --- |
| PU-001 | Recupera almacenamiento inválido | Aprobada |
| PU-002 | Normaliza carrito con el catálogo vigente | Aprobada |
| PU-003 | Acumula productos sin mutar el carrito anterior | Aprobada |
| PU-004 | Rechaza cantidades inválidas | Aprobada |
| PU-005 | Quita el producto al disminuir su última unidad | Aprobada |
| PU-006 | Calcula descuentos y totales en pesos enteros | Aprobada |
| PU-007 | Completa CRUD sin cambiar el identificador al editar | Aprobada |
| PU-008 | Valida datos e identificadores en administración | Aprobada |
| PU-009 | Valida un registro vacío | Aprobada |
| PU-010 | Normaliza correo y evita registros duplicados | Aprobada |
| PU-011 | Rechaza credenciales incorrectas | Aprobada |
| PU-012 | Guarda sesión temporal sin contraseña | Aprobada |
| PU-013 | Guarda la cuenta recordada y recupera sesión corrupta | Aprobada |
| PU-014 | Crea administrador demo sin duplicados | Aprobada |
| PU-015 | Normaliza consultas y actualiza su estado | Aprobada |
| PU-016 | No guarda consultas vacías | Aprobada |
| PU-017 | Registra total, entrega y precios pagados | Aprobada |
| PU-018 | Pago rechazado no crea pedido | Aprobada |
| PU-019 | Rechaza compras vacías o con datos inválidos | Aprobada |
| PU-020 | Historial muestra pedidos del usuario correspondiente | Aprobada |
| PU-021 | Tarjetas renderiza los datos recibidos por props | Aprobada |
| PU-022 | Evento agregar ejecuta callback y actualiza el carrito | Aprobada |
| PU-023 | Notificación usa contenido y atributos recibidos | Aprobada |
| PU-024 | Catálogo renderiza solamente su categoría | Aprobada |
| PU-025 | Búsqueda reacciona al estado del input | Aprobada |
| PU-026 | Catálogo muestra el estado sin resultados | Aprobada |
| PU-027 | Orden del catálogo responde al select | Aprobada |
| PU-028 | Carrito vacío oculta acciones de compra | Aprobada |
| PU-029 | Carrito actualiza cantidades y elimina la última unidad | Aprobada |
| PU-030 | Detalle resuelve identificadores inexistentes | Aprobada |
| PU-031 | Detalle usa el parámetro y añade la cantidad elegida | Aprobada |
| PU-032 | Detalle rechaza cantidades fraccionarias | Aprobada |
| PU-033 | Registro muestra errores condicionalmente | Aprobada |
| PU-034 | Registro guarda datos y limpia el formulario | Aprobada |
| PU-035 | Login inválido limpia y enfoca la contraseña | Aprobada |
| PU-036 | Login actualiza el menú de sesión inmediatamente | Aprobada |
| PU-037 | Contacto valida, guarda y limpia sus campos | Aprobada |
| PU-038 | Tabla de productos ejecuta callbacks recibidos por props | Aprobada |
| PU-039 | Formulario de edición precarga props y entrega cambios | Aprobada |
| PU-040 | Las rutas protegidas bloquean visitantes y clientes | Aprobada |
| PU-041 | Checkout precarga sesión y mantiene estado de campos | Aprobada |
| PU-042 | Checkout aprobado confirma y vacía el carrito | Aprobada |
| PU-043 | Checkout rechazado conserva el carrito | Aprobada |
| PU-044 | Perfil filtra el historial por la cuenta activa | Aprobada |
| PU-045 | Resumen de compra maneja pedidos inexistentes | Aprobada |
| PU-046 | Ofertas excluye productos sin descuento | Aprobada |
| PU-047 | Categorías renderiza el conjunto disponible | Aprobada |
