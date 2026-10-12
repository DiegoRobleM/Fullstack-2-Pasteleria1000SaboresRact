# Pastelería 1000 Sabores: port del original a React

Esta carpeta contiene el port de `../Pasteleria1000Sabores/Fullstack_2` en el commit `3c8dd53f2fbf2ee716914ef2aff683b5849f0fab`. Mantiene sus 13 pantallas, imágenes, estilos, URL `.html` y navegación por páginas, e incorpora la creación de productos desde administración. Es un proyecto independiente dentro del repositorio principal `FullStack2`, no un submódulo.

El original sigue en su carpeta. Esta versión permite registrar un porcentaje de descuento por producto, pero no lo aplica al precio del catálogo ni al carrito. No incorpora búsqueda, orden de catálogo, checkout, historial de pedidos ni edición de productos.

## Ejecutar

Requiere Node.js 20.19+ o 22.12+ y npm. Las dependencias se fijan en `package-lock.json`.

Desde esta carpeta:

```sh
npm install
npm run dev
```

La raíz abre el inicio. Los enlaces conservan las rutas del original, por ejemplo `/Pasteleria/pasteleria.html` y `/Carrito/carrito.html`.

```sh
npm run build
npm run preview
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
- Administración: creación y listado de productos, listado de usuarios y consultas con cambio de estado. No permite editar productos.
- Navbar y footer: mismos enlaces, menús Bootstrap, contador y cierre de sesión.

La cuenta ficticia `admin@pasteleria.test` / `AdminDemo123!` ya existía en el original y se crea al cargar el inicio de sesión. Se mantienen las claves `carrito`, `productoSeleccionado`, `usuariosRegistrados`, `usuarioActivo` y `consultasContacto`, sin backend. Los productos creados se guardan en `productosPasteleria`. El almacenamiento pertenece al origen del navegador, como en el original.

## Estructura

```text
src/
├── app/
│   ├── App.jsx               # Selección de la pantalla React
│   ├── pages.js              # Rutas, títulos y estilos por pantalla
│   └── setupPage.js          # Preparación de la página y redirecciones
├── components/
│   ├── admin/                # Formulario y tabla de productos
│   ├── cart/                 # Filas del carrito
│   ├── layout/               # Navbar, menú de sesión y footer
│   └── products/             # Tarjetas del catálogo
├── context/
│   └── StoreContext.jsx      # Estado compartido: carrito, usuario y productos
├── data/
│   ├── catalogo.js           # Catálogos originales por categoría
│   └── productos.js          # Productos iniciales con categoría y descuento
├── hooks/
│   └── usePageBindings.jsx   # Eventos y contenido variable de las pantallas
├── pages/                    # Las 13 pantallas en JSX
├── services/
│   ├── auth.js               # Registro, login y sesión
│   ├── contact.js            # Validación y almacenamiento de consultas
│   └── productos.js          # Lectura, creación, guardado y eliminación
├── utils/
│   ├── formatPrice.js        # Formato de precios en pesos chilenos
│   └── storage.js            # Lectura de arrays desde localStorage
└── main.jsx                  # Entrada y montaje de React
public/                       # Imágenes, CSS y librerías originales
tests/                        # Comparación con el sitio original
```

Las pantallas usan componentes y reciben sus eventos y contenido de `usePageBindings`. El contexto mantiene el estado compartido y los servicios contienen las reglas y la persistencia; los servicios no dependen de componentes React. Para agregar una pantalla, crea su componente en `src/pages/`, registra su ruta en `src/app/pages.js` y su vista en `src/app/App.jsx`.

Los archivos de `public/` mantienen sus rutas para conservar las referencias de imágenes y CSS. Bootstrap e iconos se sirven localmente con las versiones del original (5.3.3 y 1.11.3); `public/vendor/` incluye sus licencias. `dist/`, `node_modules/` y `test-results/` son carpetas generadas e ignoradas por Git.

React renderiza las pantallas y actualiza su contenido mediante estado y eventos. No se cargan los scripts antiguos, no se inyecta su HTML con `innerHTML` y no se utiliza un iframe.

## Comparar con el original

Las pruebas requieren Python 3 y Chromium/Chrome. También deben estar descargados los submódulos del principal:

```sh
# Desde FullStack2, solo si todavía faltan los submódulos:
git submodule update --init --recursive

# Desde Pasteleria1000SaboresReactPort:
npm run build
npm test
```

El runner inicia y detiene dos servidores locales: el original y la compilación React. Compara textos, títulos y capturas de las 13 pantallas a 1440 y 390 píxeles de ancho. También ejercita navegación, detalle, carrito persistente, registro, login, perfil, protección del panel, contacto, estado de consultas y menús de visitante/usuario. Sirve al original los mismos archivos Bootstrap del proyecto para evitar que la red altere las comparaciones. Esta suite conserva las expectativas del original; las funciones añadidas en administración pueden producir diferencias de paridad.

Las capturas y diferencias se guardan en `test-results/`, ignorado por Git. El comparador admite una diferencia máxima de 8 por canal de color para evitar ruido de rasterización y exige cero píxeles que superen ese margen. No cubre todos los tamaños de pantalla ni todos los datos posibles; conserva las limitaciones del original.

El runner necesita que Python esté disponible como `python3`. Utiliza `CHROME_BIN` si está definido; en Linux detecta `/usr/bin/chromium`. Si no está disponible, instala Chromium mediante Playwright (`npm exec -- playwright install chromium`). En el contenedor cloud se puede usar el lanzador local:

```sh
CHROME_BIN=/workspace/.cache/fullstack2/bin/chromium-cloud npm test
```
