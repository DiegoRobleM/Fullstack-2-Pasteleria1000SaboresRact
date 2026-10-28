# Pastelería 1000 Sabores en React

Tienda frontend con React, Vite, React Router, Bootstrap y persistencia simulada en el navegador. Conserva las trece pantallas e imágenes del original y añade categorías, ofertas, checkout, compra confirmada y pago rechazado: dieciocho pantallas en total.

## Ejecutar

Requiere Node.js 20.19+ o 22.12+ y npm. Las versiones instaladas quedan fijadas en package-lock.json.

```powershell
npm install
npm run dev
npm run build
npm run preview
```

Las rutas se declaran en src/routes.jsx con createBrowserRouter, siguiendo el patrón de clases. RouterProvider se monta en #root dentro de ProveedorTienda. Link y useNavigate permiten navegar sin recargar. Las pantallas usan rutas como /pasteleria, /carrito y /producto/:idProducto. Las direcciones desconocidas vuelven al inicio.

## Funciones

- Catálogos por categoría, búsqueda por nombre/descripción, orden por precio final y ofertas.
- Detalle por /producto/:idProducto, enlace directo, recarga, validación de cantidad y notificación.
- Carrito persistente con cantidades, eliminación, vaciado y total con descuentos.
- Registro, cuenta temporal o recordada, perfil, cierre de sesión y protección de administración por rol.
- Contacto con validación, guardado y administración del estado de consultas.
- Administración CRUD de productos: crear, listar, editar y eliminar con confirmación. La edición conserva el ID; cambiar precio, descuento o categoría actualiza el carrito vigente. Eliminar un producto también lo retira del carrito.
- Checkout con datos de sesión precargados, dirección y opción de entrega. Despacho: $3.000; retiro: $0. Los importes son reglas de la demostración.
- Pago simulado aprobado o rechazado. El aprobado guarda un único pedido y vacía el carrito; el rechazado conserva los productos y permite reintentar.
- Confirmación recargable por /compra/:idPedido e historial de la cuenta activa. Los pedidos conservan los precios pagados aunque después cambie el catálogo.
- Panel de ventas del administrador con ingresos, cantidad de pedidos, ticket promedio, unidades vendidas, productos más vendidos y últimas compras. Los indicadores se calculan sobre los pedidos simulados de este navegador.

Administrador ficticio: admin@pasteleria.test / AdminDemo123!. Se crea al abrir Inicio de sesión.

No hay backend ni cobros reales. La sesión, los roles y los datos son una simulación local; la información pertenece al origen del navegador. Las claves de almacenamiento son carrito, usuariosRegistrados, usuarioActivo, consultasContacto, productosPasteleria y pedidosPasteleria. El detalle obtiene el producto mediante el ID de la URL y el catálogo compartido.

## Organización

- src/pages: estado, efectos y eventos junto al JSX de cada pantalla.
- src/components/estructura: barra de navegación, menú de sesión y pie de página.
- src/components/productos: catálogo reutilizable, tarjetas y presentación de precios.
- src/components/carrito y src/components/administracion: filas y tablas reutilizables.
- src/components/alerta: Alerta para avisos generales y AlertaFormulario para mensajes de validación o éxito. Admiten colores Bootstrap, visibilidad, contenido, ID, clases y referencias; los formularios reutilizan la presentación de uno o varios mensajes.
- src/context/ContextoTienda.jsx: carrito, productos, usuario y pedidos compartidos.
- src/services: validación, CRUD y persistencia; no importan componentes React.
- src/hooks: título de página y notificación con limpieza del temporizador.
- src/utils: almacenamiento, precios, imágenes y combinación de clases.
- src/styles: estilos globales y compartidos. Los estilos locales usan CSS Modules.

Se retiraron usePageBindings, los diccionarios genéricos props/content y el adaptador de páginas. App conserva el montaje por visita, el desplazamiento inicial y la protección de acceso. Los nombres propios están en español; las APIs de React, Bootstrap y React Router, las claves persistidas y la convención routes.jsx mantienen sus nombres.

El rediseño integra banners, tarjetas y formularios en tonos café y crema. Cada CSS Module conserva sus variables dentro de la clase de su pantalla o componente; el fondo global se define una vez en src/styles/global.css. Se mantienen Alerta, AlertaFormulario y Notificacion como componentes reutilizables.

## Comprobar

```powershell
npm run build
npm test
```

npm test ejecuta Jasmine/Karma y después las suites de navegador en serie. Requiere Chrome o Edge; CHROME_BIN permite indicar el ejecutable. Las pruebas de navegador también admiten Chromium de Playwright.

- npm run test:unitarias: exactamente diez pruebas simples de componentes con Jasmine/Karma; genera cobertura y registro de resultados. Los casos están en tests/unitarias/componentes.spec.jsx.
- npm run test:e2e: navegación, estilos y flujos de compra con Playwright.
- npm run test:router, npm run test:styles y npm run test:tienda: suites separadas.
- npm run test:visual: capturas de diez pantallas en escritorio y móvil y comprobación de desbordamiento horizontal.
- npm run formatear: formato de código con Prettier.

La configuración de Karma usa ejecución única, sin vigilancia automática de archivos. El informe y el registro real están en docs/TESTING.md, docs/resultados-pruebas.json y docs/Registro_Pruebas_Unitarias.xlsx. Las métricas se generan en test-results/coverage y sus archivos temporales están ignorados por Git.

## Documentación

- docs/ERS_V2.md: requisitos, reglas y alcance de la versión actual.
- docs/TESTING.md: método, resultados y cobertura de la última ejecución.
- docs/Continuar_aprendizaje_React.md: estado del plan y recorrido para estudiar el código.

Para alojar dist, el servidor debe devolver index.html al abrir o recargar rutas de la aplicación. Vite dev y preview ya lo hacen. El proyecto se sirve en la raíz del origen.
