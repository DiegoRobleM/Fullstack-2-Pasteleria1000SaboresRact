# Especificación de requisitos del software V2

Proyecto: Pastelería 1000 Sabores ReactPort. Fecha: 13 de octubre de 2026.

## Objetivo y usuarios

Desarrollar una tienda frontend de demostración con componentes React reutilizables, navegación, estado local, persistencia simulada y pruebas de componentes. El visitante consulta productos, registra una cuenta, envía consultas y puede completar una compra simulada. El cliente autenticado dispone de perfil e historial. El administrador gestiona productos y estados de consultas y consulta las cuentas registradas.

## Requisitos funcionales

| ID | Requisito | Criterio verificable |
| --- | --- | --- |
| RF-01 | Navegación con React Router | Dieciocho pantallas accesibles, compatibilidad .html, enlaces directos y Atrás/Adelante. |
| RF-02 | Catálogos y categorías | Productos separados en las cuatro categorías originales. |
| RF-03 | Búsqueda, orden y ofertas | Filtro por nombre/descripción sin distinguir mayúsculas; orden por precio final; ofertas con descuento mayor que cero. |
| RF-04 | Detalle | Identificador en URL, cantidad entera positiva y estado de producto inexistente. |
| RF-05 | Carrito | Añadir, acumular, cambiar cantidades, quitar, vaciar, persistir y calcular importes. |
| RF-06 | Registro | Validaciones, correo normalizado y único, nueva cuenta siempre de cliente. |
| RF-07 | Sesión | Credenciales, cuenta temporal/recordada, menú reactivo y cierre de sesión. |
| RF-08 | Control de acceso | Perfil requiere sesión; administración requiere rol admin. Es control frontend simulado. |
| RF-09 | Consultas | Guardar correo/mensaje y cambiar a pendiente, en revisión o resuelta. |
| RF-10 | CRUD de productos | Validar campos, crear, editar conservando ID y eliminar con confirmación. |
| RF-11 | Descuentos | Mismo precio final en catálogo, detalle, carrito y compra. |
| RF-12 | Checkout | Precargar datos de sesión, recoger dirección y seleccionar despacho/retiro. |
| RF-13 | Resultado de pago | Aprobado guarda pedido y vacía carrito; rechazado conserva carrito y permite reintentar. |
| RF-14 | Historial | Mostrar pedidos de la cuenta activa y conservar sus precios y datos de entrega. |

## Reglas de negocio

El precio base es un entero positivo en pesos chilenos. El descuento está entre 0 y 100. El precio final se redondea al peso con Math.round(precio × (1 − descuento/100)). Los subtotales multiplican el precio final por una cantidad entera positiva. Disminuir una unidad a cero elimina la fila.

Despacho a domicilio cuesta $3.000 y retiro en tienda $0. El total es productos más entrega. Ejemplo: dos productos de $10.000 con 20% de descuento y despacho suman $19.000. Los importes de entrega pertenecen a esta demostración y no representan una tarifa comercial externa.

Un producto editado mantiene su ID aunque cambie de categoría. El carrito usa su información vigente. Los productos eliminados se retiran del carrito. El pedido aprobado guarda una copia del nombre, cantidad, precio base, descuento y precio final; modificaciones posteriores del catálogo no cambian lo pagado.

El correo del propietario del pedido corresponde a la cuenta activa o al correo informado por el visitante. El historial filtra por ese correo. El pago no solicita datos de tarjeta ni realiza operaciones externas. Los envíos duplicados del mismo formulario se bloquean mientras se procesa la compra.

## Requisitos de calidad

Componentes con una responsabilidad, propiedades explícitas y estado local junto al JSX. Contexto compartido para los datos de tienda y servicios independientes de React. Bootstrap responsivo y CSS Modules para aislar estilos. Recursos de public desde la raíz. Temporizadores cancelados al desmontar la pantalla o volver a enviar el formulario. Datos previos e identificadores conservados.

Pruebas con Jasmine/Karma para lógica, renderizado, propiedades, estado, eventos y DOM; spies para verificar callbacks. Pruebas de navegador para flujos completos, persistencia, navegación y estados visuales. Registro de entradas, expectativas previas y resultados reales e informe de cobertura.

## Alcance y límites

Incluye frontend y persistencia en localStorage/sessionStorage, sin backend, pasarela real, inventario, reportes comerciales ni boletas tributarias. Las categorías están definidas en datos; las cuentas pueden registrarse y consultarse, pero no hay CRUD administrativo de categorías/usuarios. Estas funciones más amplias del anexo no forman parte del plan implementado.

La publicación de GitHub, la configuración de hosting, los nombres de integrantes y la presentación oral corresponden a la entrega del equipo. Esta implementación no publica el repositorio ni inventa información de autoría o de equipo.

## Fuentes académicas

Se revisaron las instrucciones de Evaluación Parcial 2, su anexo y la guía de continuidad disponibles en la carpeta documentos del proyecto principal. La versión actual aplica el patrón de createBrowserRouter del ejemplo de clases y adapta las propuestas de compra a una simulación frontend.
