# Especificación de requisitos del software V2

Proyecto: Pastelería 1000 Sabores. Fecha de la versión original: 14 de octubre de 2026. Actualizado el 27 de noviembre de 2026 para incluir la integración con el backend. Equipo: Diego Roble, Victoria Arias y Vicente Perez.

## Objetivo y usuarios

Desarrollar una tienda web de pastelería con un frontend en React (componentes reutilizables, navegación y estado compartido) conectado a una API REST en Spring Boot, con datos en MySQL (AWS RDS) y autenticación con JWT y roles. El visitante consulta productos, registra una cuenta, envía consultas y puede completar una compra simulada. El cliente autenticado dispone de perfil e historial de pedidos. El administrador gestiona productos, consultas, usuarios y ventas.

## Requisitos funcionales

| ID | Requisito | Criterio verificable |
| --- | --- | --- |
| RF-01 | Navegación con React Router | Dieciocho pantallas accesibles mediante rutas React, enlaces directos y Atrás/Adelante. |
| RF-02 | Catálogos y categorías | Productos obtenidos de la API (`GET /productos`) y separados en las cuatro categorías originales. |
| RF-03 | Búsqueda, orden y ofertas | Filtro por nombre/descripción sin distinguir mayúsculas; orden por precio final; ofertas con descuento mayor que cero. |
| RF-04 | Detalle | Identificador en URL, cantidad entera positiva y estado de producto inexistente. |
| RF-05 | Carrito | Añadir, acumular, cambiar cantidades, quitar, vaciar, persistir y calcular importes. |
| RF-06 | Registro | Validaciones en el front y en el backend (`POST /auth/registro`), correo único (error 409 si ya existe), nueva cuenta siempre de cliente. |
| RF-07 | Sesión | Inicio de sesión (`POST /auth/login`) que devuelve un token JWT, cuenta temporal o recordada, menú reactivo, renovación automática del token (`POST /auth/renovar`) y cierre de sesión. |
| RF-08 | Control de acceso | Perfil requiere sesión; administración requiere rol admin. Se controla en el frontend (redirecciones) y en el backend, que responde 401 sin token válido y 403 si el rol no tiene permiso. |
| RF-09 | Consultas | Enviar consultas (`POST /consultas`, público); el administrador las ve y cambia su estado a pendiente, en revisión o resuelta (`PATCH /consultas/{id}/estado`) y puede eliminarlas. |
| RF-10 | CRUD de productos | Validar campos, crear, editar conservando ID y eliminar con confirmación, mediante `POST`, `PUT` y `DELETE /productos` (solo administrador). |
| RF-11 | Descuentos | Mismo precio final en catálogo, detalle, carrito y compra. |
| RF-12 | Checkout | Precargar datos de sesión, recoger dirección y seleccionar despacho/retiro. El pedido se crea con `POST /pedidos`. |
| RF-13 | Resultado de pago | Aprobado guarda el pedido y vacía el carrito; rechazado conserva el carrito y permite reintentar. El pago es simulado. |
| RF-14 | Historial | El cliente ve sus pedidos (`GET /pedidos/mios`) con los precios y datos de entrega de cuando compró. |
| RF-15 | Panel de ventas | El administrador consulta ingresos, número de pedidos, ticket promedio, unidades vendidas, ranking de productos y últimas ventas, y puede cambiar el estado de los pedidos o eliminarlos. |
| RF-16 | Gestión de usuarios | El administrador ve, edita y elimina las cuentas registradas (`GET`, `PUT` y `DELETE /usuarios`). |

## Reglas de negocio

El precio base es un entero positivo en pesos chilenos. El descuento está entre 0 y 100. El precio final se redondea al peso con Math.round(precio × (1 − descuento/100)). Los subtotales multiplican el precio final por una cantidad entera positiva. Disminuir una unidad a cero elimina la fila.

Despacho a domicilio cuesta $3.000 y retiro en tienda $0. El total es productos más entrega. Ejemplo: dos productos de $10.000 con 20% de descuento y despacho suman $19.000. Los importes de entrega pertenecen a esta demostración y no representan una tarifa comercial externa.

El frontend envía al backend solo los identificadores y las cantidades de los productos. El backend recalcula precios, descuentos, costo de entrega y total desde la base de datos, de modo que el monto no puede alterarse desde el navegador.

Un producto editado mantiene su ID aunque cambie de categoría. El carrito usa su información vigente. Los productos eliminados se retiran del carrito. El pedido guarda una copia del nombre, cantidad, precio base, descuento y precio final de cada producto; modificaciones posteriores del catálogo no cambian lo pagado.

El correo del propietario del pedido corresponde a la cuenta activa o al correo informado por el visitante. El historial filtra por ese correo. El pago no solicita datos de tarjeta ni realiza operaciones externas. Los envíos duplicados del mismo formulario se bloquean mientras se procesa la compra.

El panel administrativo suma el total de los pedidos, incluyendo entrega, cuenta sus pedidos y unidades y calcula el ticket promedio como ingresos divididos por cantidad de pedidos, redondeado al peso. Sin pedidos muestra cero. Dos unidades de $10.000 con descuento de 20% y retiro generan ingresos de $16.000, un pedido, ticket promedio de $16.000 y dos unidades vendidas. El nombre de contacto es opcional y se conserva junto al correo y la consulta.

## Requisitos de calidad y seguridad

Componentes con una responsabilidad, propiedades explícitas y estado local junto al JSX. Contexto compartido para los datos de tienda y servicios independientes de React. Todas las peticiones al backend pasan por un único cliente HTTP (`src/services/api.js`), que agrega el token, convierte la respuesta a JSON y traduce los errores. Bootstrap responsivo y CSS Modules para aislar estilos. Recursos de public desde la raíz. Temporizadores cancelados al desmontar la pantalla o volver a enviar el formulario.

Seguridad del backend: las contraseñas se guardan con BCrypt y nunca se devuelven en las respuestas. El inicio de sesión entrega un token JWT firmado con HS256 que dura 2 horas y puede renovarse hasta un máximo de 7 días desde el ingreso con contraseña. El servidor no guarda sesiones. La autorización se aplica por rol y por ruta. CORS permite solo los orígenes del frontend. Los errores se devuelven como `{"mensaje": "..."}` con los códigos HTTP 400, 401, 403, 404 y 409.

Pruebas: diez pruebas unitarias simples con Jasmine/Karma para alertas, renderizado, propiedades, búsqueda, eventos y DOM; spies para verificar callbacks. Pruebas de navegador con Playwright para flujos completos, persistencia, navegación y estados visuales, que usan una API simulada con los mismos endpoints, tokens y códigos que el backend. En el backend se verificaron con curl los códigos de respuesta, las restricciones por rol y el manejo del token. Registro de entradas, expectativas previas y resultados reales e informe de cobertura en `docs/TESTING.md`. Los avisos se reutilizan mediante Alerta y AlertaFormulario; Notificacion presenta los mensajes temporales del carrito.

## Alcance y límites

Incluye el frontend React, el backend Spring Boot con su documentación Swagger, la base de datos MySQL en AWS RDS y el despliegue del backend en una instancia EC2 de AWS. No incluye pasarela de pago real, inventario, reportes contables o exportables ni boletas tributarias. Las categorías están definidas en los datos del frontend y no tienen CRUD administrativo.

Las pruebas de navegador no usan el backend real ni la base de datos; la autorización del servidor se verificó con curl. La instancia de AWS Academy se detiene al terminar la sesión del laboratorio, por lo que el backend debe volver a iniciarse antes de cada uso.

## Fuentes académicas

Se revisaron las instrucciones de Evaluación Parcial 2, su anexo y la guía de continuidad disponibles en la carpeta documentos del proyecto principal. La versión actual aplica el patrón de createBrowserRouter del ejemplo de clases y suma la integración con el backend descrita en `docs/INTEGRACION.md`.
