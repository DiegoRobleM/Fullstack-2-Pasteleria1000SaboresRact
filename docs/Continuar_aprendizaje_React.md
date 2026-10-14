# Continuar el aprendizaje de Pastelería 1000 Sabores

Actualizado el 14 de octubre de 2026. Proyecto actual: Pasteleria1000SaboresReactPort. Usar npm. Equipo: Vicente, Victoria y Diego.

## Estado del plan

El estudiante solicitó explícitamente implementar todo el plan y realizar commits durante el avance. Ya se implementaron:

1. React Router con createBrowserRouter, RouterProvider y montaje en #root. Dieciocho pantallas, rutas .html compatibles y detalle por parámetro.
2. Carpetas por página, nombres propios en español y lógica local junto al JSX. Se retiraron usePageBindings, los diccionarios props/content y el adaptador temporal.
3. Contexto de productos, carrito, usuario y pedidos; servicios de autenticación, consultas, productos, carrito y pedidos; utilidades de precios y almacenamiento.
4. CRUD completo de productos, con edición que conserva IDs y eliminación confirmada. Carrito actualizado después de los cambios de catálogo.
5. Descuentos aplicados, búsqueda, orden por precio final, categorías y ofertas.
6. Checkout simulado, opciones de entrega, resultados aprobado/rechazado, confirmación persistida e historial de la cuenta activa.
7. Jasmine/Karma con diez pruebas unitarias simples de componentes, cobertura, pruebas de navegador y registro de resultados reales. Consultar docs/TESTING.md para la última ejecución; no extrapolar resultados de otra versión.
8. Bootstrap, CSS Modules y comprobaciones de escritorio y móvil.

Por solicitud del estudiante se simplificó la suite a diez casos PU-001 a PU-010. Alerta centraliza los avisos Bootstrap y AlertaFormulario presenta los mensajes de los formularios, incluidos varios errores. Notificacion conserva los avisos temporales del carrito. Las pantallas usan estos componentes en lugar de repetir su marcado.

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

README.md explica ejecución y estructura. docs/ERS_V2.md define el alcance. docs/TESTING.md, docs/resultados-pruebas.json y docs/Registro_Pruebas_Unitarias.xlsx documentan la ejecución real. El registro identifica a Vicente, Victoria y Diego como equipo responsable conjunto. Los casos no tienen una asignación individual acordada.

## Pendientes revisados, sin implementar

El plan funcional acordado está implementado: router, lógica local, nombres en español, CRUD de productos, descuentos, compra simulada e historial. El cierre documental incorpora ERS, cobertura y registro de pruebas. No quedan tareas de ese plan funcional identificadas en esta revisión.

1. Publicación y entrega: verificar que el enlace GitHub sea público y contenga la versión final, preparar el proyecto comprimido solicitado y la presentación según las instrucciones de clases. El remoto configurado es https://github.com/DiegoRobleM/Fullstack-2-Pasteleria1000SaboresRact.git; su visibilidad y contenido remoto no se verificaron en este cierre. Si se elige un alojamiento, configurar la recuperación de rutas SPA en ese servidor. Estas acciones quedan registradas para la siguiente instrucción.
2. Comparación histórica: test:parity aún no está verificada contra el HTML original. Requiere disponer de ese proyecto y python3 y revisar las diferencias intencionales de las funciones nuevas. Las suites actuales de router, estilos y tienda cubren la implementación vigente.
3. Dependencias de pruebas: dar seguimiento a las tres alertas altas de desarrollo de Karma/braces documentadas en TESTING.md. La actualización automática propone cambios incompatibles; no se aplicó una degradación de versiones.

Backend, pago real, inventario, reportes comerciales y CRUD administrativo de usuarios/categorías son ampliaciones de alcance. Si la entrega académica exige alguna de ellas, deben incorporarse a un plan nuevo antes de implementarlas. Este documento registra los pendientes; su implementación queda detenida por instrucción del estudiante.

La comparación histórica test:parity corresponde al diseño HTML anterior y conserva diferencias intencionales por funcionalidades nuevas; no equivale a las pruebas actuales ni se registra como aprobada sin ejecutarla.
