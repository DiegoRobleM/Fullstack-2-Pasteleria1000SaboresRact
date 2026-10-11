# Pastelería 1000 Sabores: port del original a React

Esta carpeta contiene el port de `../Pasteleria1000Sabores/Fullstack_2` en el commit `3c8dd53f2fbf2ee716914ef2aff683b5849f0fab`. Se conserva la página original: sus 13 pantallas, textos, imágenes, colores, distribución, URL `.html`, navegación por páginas y comportamiento. Es un proyecto independiente dentro del repositorio principal `FullStack2`, no un submódulo.

El original y `../Pasteleria1000SaboresReact` siguen en sus carpetas. Esta versión no incorpora las funciones agregadas en la otra migración: búsqueda, orden de catálogo, ofertas, descuentos, checkout, historial de pedidos ni edición de productos.

## Ejecutar

Requiere Node.js 20.19+ o 22.12+ y pnpm. Se validó con Node 24.19.0 y pnpm 11.19.0.

Desde esta carpeta:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

La raíz abre el inicio. Los enlaces conservan las rutas del original, por ejemplo `/Pasteleria/pasteleria.html` y `/Carrito/carrito.html`.

```sh
pnpm build
pnpm preview
```

Para alojar `dist/`, configura el servidor para servir `index.html` también en las rutas `.html` del sitio. Vite dev y preview ya lo hacen. El proyecto se sirve en la raíz del origen.

## Pantallas y comportamiento conservados

- Inicio y Sobre nosotros, con el contenido y las tarjetas del original.
- Pastelería, Panadería, Salados y Sin azúcar: tres productos por categoría, en el mismo orden.
- Detalle: selección mediante `sessionStorage`, cantidad, notificación y retorno al catálogo de origen.
- Carrito: cantidades, eliminación, vaciado, contador y total; sin flujo de pago.
- Registro: los mismos campos, opciones, validaciones y mensajes.
- Inicio de sesión: cuenta temporal o recordada y los mismos mensajes y tiempos de redirección.
- Perfil: nombre, correo, dirección y “Sin pedidos registrados”.
- Contacto: consultas guardadas en el navegador.
- Administración: consulta de catálogos, listado de usuarios y consultas con cambio de estado. No permite editar productos.
- Navbar y footer: mismos enlaces, menús Bootstrap, contador y cierre de sesión.

La cuenta ficticia `admin@pasteleria.test` / `AdminDemo123!` ya existía en el original y se crea al cargar el inicio de sesión. Se mantienen las claves `carrito`, `productoSeleccionado`, `usuariosRegistrados`, `usuarioActivo` y `consultasContacto`, sin backend. El almacenamiento pertenece al origen del navegador, como en el original.

## Estructura

- `src/pages/`: HTML original convertido a JSX, con los mismos elementos y clases.
- `src/components/Layout.jsx`: navbar, menú de sesión y footer en React.
- `src/components/Products.jsx`: tarjetas y filas del carrito en React.
- `src/bindings.jsx`: estado, eventos y contenido variable de las pantallas.
- `src/store.jsx`, `src/forms.js`, `src/products.js`: almacenamiento, reglas originales y catálogo original.
- `src/pages.js`: títulos, rutas y hojas de estilo de cada pantalla.
- `public/`: imágenes y CSS originales. Las únicas adaptaciones de `globalstyle.css` son las dos rutas de importación de Bootstrap e iconos: se sirven localmente, con las mismas versiones del original (5.3.3 y 1.11.3). `public/vendor/` incluye sus licencias.

React renderiza las pantallas y actualiza su contenido mediante estado y eventos. No se cargan los scripts antiguos, no se inyecta su HTML con `innerHTML` y no se utiliza un iframe.

## Comparar con el original

Las pruebas requieren Python 3 y Chromium/Chrome. También deben estar descargados los submódulos del principal:

```sh
# Desde FullStack2, solo si todavía faltan los submódulos:
git submodule update --init --recursive

# Desde Pasteleria1000SaboresReactOriginal:
pnpm build
pnpm test
```

El runner inicia y detiene dos servidores locales: el original y la compilación React. Compara textos, títulos y capturas de las 13 pantallas a 1440 y 390 píxeles de ancho. También ejercita navegación, detalle, carrito persistente, registro, login, perfil, protección del panel, contacto, estado de consultas y menús de visitante/usuario. Sirve al original los mismos archivos Bootstrap del proyecto para evitar que la red altere las comparaciones.

Las capturas y diferencias se guardan en `test-results/`, ignorado por Git. El comparador admite una diferencia máxima de 8 por canal de color para evitar ruido de rasterización y exige cero píxeles que superen ese margen. No cubre todos los tamaños de pantalla ni todos los datos posibles; conserva las limitaciones del original.

El runner utiliza `CHROME_BIN` si está definido; en Linux detecta `/usr/bin/chromium`. Si no está disponible, instala Chromium mediante Playwright (`pnpm exec playwright install chromium`). En el contenedor cloud se puede usar el lanzador local:

```sh
CHROME_BIN=/workspace/.cache/fullstack2/bin/chromium-cloud pnpm test
```
