import { readFile, writeFile } from "node:fs/promises";
const registro = JSON.parse(await readFile("docs/resultados-pruebas.json", "utf8"));
const cobertura = JSON.parse(await readFile("test-results/coverage/coverage-summary.json", "utf8")).total;
await writeFile("docs/cobertura.json", JSON.stringify({ fecha: registro.fecha, total: cobertura }, null, 2) + "\n");
const fecha = new Date(registro.fecha).toLocaleString("es-CL", { timeZone: "America/Santiago" });
const numero = (valor) => Number(valor).toLocaleString("es-CL", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const etiquetas = { statements: "Sentencias", branches: "Ramas", functions: "Funciones", lines: "Líneas" };
const filas = Object.entries(etiquetas).map(([clave, etiqueta]) => "| " + etiqueta + " | " + numero(cobertura[clave].pct) + "% | " + cobertura[clave].covered + " / " + cobertura[clave].total + " |");
const casos = registro.casos.map((caso) => "| " + caso.id + " | " + caso.nombre.replaceAll("|", "/") + " | " + caso.estado + " |");
const texto = [
  "# Informe de pruebas y cobertura", "", "Ejecución: " + fecha + " (America/Santiago).", "", "## Resultado unitario verificado", "",
  "**" + registro.total + " casos ejecutados, " + registro.aprobadas + " aprobados y " + registro.fallidas + " fallidos.**", "",
  "Herramientas: Jasmine y Karma 6.4.4. Navegador: " + registro.casos[0].navegador + ".", "",
  "| Métrica | Cobertura | Cubierto / total |", "| --- | --- | --- |", ...filas, "",
  "## Método y proceso", "",
  "Cada caso declara su ID, entrada y resultado esperado antes de la ejecución. Las aserciones comparan lógica y comportamiento reales. Los servicios usan almacenamiento limpio por caso. Las pruebas de componentes montan un root React dentro de MemoryRouter y ProveedorTienda, simulan inputs/selects/clics/submits y verifican DOM y persistencia. act espera los cambios de React y cada root se desmonta al finalizar. jasmine.createSpy verifica los callbacks recibidos por props.", "",
  "El bundle JSX se genera con esbuild. Istanbul instrumenta los módulos de src importados por la suite y karma-coverage produce HTML y JSON. main.jsx y la creación del navegador en routes.jsx no están instrumentados; las rutas y el arranque se comprueban con las suites de navegador. Las posiciones del HTML de cobertura corresponden al JavaScript transformado desde JSX. Estas métricas no equivalen a cobertura completa del sistema.", "",
  "## Alcance", "",
  "PU-001 a PU-020: almacenamiento inválido, cantidades, descuentos, CRUD, validaciones, registro, credenciales, sesiones, administrador demo, consultas, compra e historial.", "",
  "PU-021 a PU-047: renderizado, props, spies, estado de búsqueda y formularios, eventos, mensajes condicionales, carrito, detalle, administración, protección de rutas, checkout, rechazo, confirmación e historial.", "",
  "Las suites de navegador contienen 22 casos: 13 de navegación/sesión, cinco de estilos y cuatro de CRUD/filtros/compra. La suite de estilos abre las 18 pantallas a 1440 y 390 píxeles. También se generaron 20 capturas de diez pantallas y se comprobó ausencia de desbordamiento horizontal y errores JavaScript. Se revisaron visualmente carrito, checkout, perfil y administración.", "",
  "## Repetir", "", "Ejecutar npm run build y npm test. Para aislar suites: npm run test:unitarias, npm run test:e2e y npm run test:visual. Chrome o Edge son necesarios; CHROME_BIN permite seleccionar el ejecutable.", "",
  "El reporte HTML reproducible queda en test-results/coverage/index.html. docs/resultados-pruebas.json conserva entradas, expectativas, estados y duración de cada caso. docs/Registro_Pruebas_Unitarias.xlsx traslada esos resultados al formato de la plantilla académica; la plantilla original se conserva.", "",
  "## Límites y seguimiento", "",
  "No se prueban backend, pasarela real, autorización de servidor, logística ni navegadores distintos de Chrome. La comparación test:parity conserva las expectativas del HTML original y las diferencias funcionales nuevas son intencionales; no se declara aprobada como equivalencia visual completa.", "",
  "La instalación de Karma conserva tres alertas altas de desarrollo vinculadas a braces (GHSA-vfj7-8cjw-p6xm). La versión publicada consultada es 3.0.3, también afectada; la solución automática propuesta cambia a versiones anteriores de Karma/karma-jasmine. La configuración ejecuta pruebas únicas con patrones locales definidos por el proyecto. Revisar la actualización del proveedor antes de ampliar la herramienta a entradas no confiables. Esta dependencia no se importa en el frontend de producción.", "",
  "## Casos ejecutados", "", "| ID | Comprobación | Resultado |", "| --- | --- | --- |", ...casos, "",
];
await writeFile("docs/TESTING.md", texto.join("\n"));
