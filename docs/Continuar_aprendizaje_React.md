# Continuar el aprendizaje de Pastelería 1000 Sabores

Actualizado el 13 de octubre de 2026. Proyecto actual: Pasteleria1000SaboresReactPort. Usar npm.

## Estado del plan

El estudiante solicitó explícitamente implementar todo el plan y realizar commits durante el avance. Ya se implementaron:

1. React Router con createBrowserRouter, RouterProvider y montaje en #root. Dieciocho pantallas, rutas .html compatibles y detalle por parámetro.
2. Carpetas por página, nombres propios en español y lógica local junto al JSX. Se retiraron usePageBindings, los diccionarios props/content y el adaptador temporal.
3. Contexto de productos, carrito, usuario y pedidos; servicios de autenticación, consultas, productos, carrito y pedidos; utilidades de precios y almacenamiento.
4. CRUD completo de productos, con edición que conserva IDs y eliminación confirmada. Carrito actualizado después de los cambios de catálogo.
5. Descuentos aplicados, búsqueda, orden por precio final, categorías y ofertas.
6. Checkout simulado, opciones de entrega, resultados aprobado/rechazado, confirmación persistida e historial de la cuenta activa.
7. Jasmine/Karma para servicios y componentes, cobertura, pruebas de navegador y registro de resultados reales. Consultar docs/TESTING.md para la última ejecución; no extrapolar resultados de otra versión.
8. Bootstrap, CSS Modules y comprobaciones de escritorio y móvil.

## Próxima etapa de aprendizaje

Comprender y practicar lo implementado. No es necesario reconstruir carpetas ni instalar otro router. Mantener explicaciones en español, cambios pequeños y verificables y ejemplos de la pastelería. No modificar código durante una lección salvo que el estudiante lo solicite.

Recorrido sugerido:

1. index.html → main.jsx → routes.jsx → App → una página. Revisar Link, useNavigate, useParams y la protección de acceso.
2. DetalleProducto: find obtiene el producto; useState conserva cantidad; el evento agrega al carrito; la notificación usa un temporizador con limpieza.
3. ContextoTienda y servicios/carrito: agregar, map para cantidades, filter para quitar y reduce para el total. Repasar cada método cuando aparezca en el código real.
4. Administración: propiedades de FormularioProducto y TablaProductos, eventos locales y servicios de CRUD.
5. Checkout: estado controlado, datos precargados, validación, costo de entrega y copia persistida del pedido.
6. Pruebas: elegir un caso PU de docs/resultados-pruebas.json, leer su entrada y expectativa, revisar las aserciones y ejecutar npm run test:unitarias. Después seguir el mismo flujo en una prueba de navegador.

Al indicar una modificación, revisar las líneas actuales, nombrar el archivo y aportar un fragmento de referencia. Conservar claves de almacenamiento e IDs. Las APIs de bibliotecas mantienen sus nombres originales.

## Comandos

npm install
npm run dev
npm run build
npm test
npm run test:unitarias
npm run test:e2e
npm run test:visual

El pago es simulado. Los resultados están ligados al origen del navegador. No confundir este port con Pasteleria1000SaboresReactCompleto/Pasteleria1000Sabores-React ni con el proyecto de clases DSY1104-012D/miPrimeraWebReact.

## Documentación y entrega

README.md explica ejecución y estructura. docs/ERS_V2.md define el alcance. docs/TESTING.md, docs/resultados-pruebas.json y docs/Registro_Pruebas_Unitarias.xlsx documentan la ejecución real. El equipo debe completar sus nombres y responsabilidades en el registro y preparar publicación/presentación según las instrucciones de clases.

La comparación histórica test:parity corresponde al diseño HTML anterior y conserva diferencias intencionales por funcionalidades nuevas; no equivale a las pruebas actuales ni se registra como aprobada sin ejecutarla.
