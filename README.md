# Pastelería 1000 Sabores

Proyecto de la asignatura Desarrollo Fullstack II (DSY1104, Duoc UC): una tienda web de pastelería con un frontend en React conectado a una API REST en Spring Boot, base de datos MySQL en AWS RDS y autenticación con JWT y roles.

## Equipo

Desarrollado en equipo por [DiegoRobleM](https://github.com/DiegoRobleM), [Victoria-A02](https://github.com/Victoria-A02) y [Vicentep12](https://github.com/Vicentep12).

## Estructura del repositorio

- **FrontPasteleria**: tienda en React 19 con Vite, React Router y Bootstrap. Catálogo por categorías, búsqueda, carrito, registro e inicio de sesión, checkout con pago simulado, historial de pedidos y panel de administración (productos, consultas, usuarios y ventas). Todos los datos se obtienen de la API. Más detalle en [FrontPasteleria/README.md](FrontPasteleria/README.md).
- **BackPasteleria**: API REST en Spring Boot (Java 25) con Spring Data JPA, Spring Security (JWT y roles), validación y documentación Swagger con springdoc. Expone `/api/auth`, `/api/productos`, `/api/consultas`, `/api/pedidos` y `/api/usuarios`.
- **docs**: requisitos (ERS), [documento de integración](docs/INTEGRACION.md) y [documentación de pruebas](docs/TESTING.md).

## Tecnologías

- Front: React, Vite, React Router, Bootstrap; pruebas con Karma, Jasmine y Playwright.
- Back: Spring Boot, Spring Data JPA, Spring Security (OAuth2 Resource Server con JWT HS256), BCrypt, MySQL, Lombok y springdoc-openapi.

## API y seguridad

| Recurso | Público | Cliente con sesión | Administrador |
| --- | --- | --- | --- |
| `/api/auth` | Registro e inicio de sesión | Renovar el token | Renovar el token |
| `/api/productos` | Ver | Ver | CRUD completo |
| `/api/consultas` | Enviar | Enviar | Ver, cambiar estado y eliminar |
| `/api/pedidos` | Comprar | Comprar y ver los suyos | Ver todos, cambiar estado, eliminar y resumen de ventas |
| `/api/usuarios` | — | — | Ver, editar y eliminar |

- El inicio de sesión devuelve un token JWT de 2 horas con el correo y el rol. El front lo envía como `Authorization: Bearer <token>` y lo renueva automáticamente cuando le quedan menos de 30 minutos, hasta un máximo de 7 días desde el inicio de sesión.
- Las contraseñas se guardan con BCrypt y nunca se devuelven en las respuestas.
- Los errores llegan como `{"mensaje": "..."}` con el código HTTP correspondiente (400, 401, 403, 404, 409).

El detalle de los flujos, el modelo de datos y la gestión de sesión está en [docs/INTEGRACION.md](docs/INTEGRACION.md).

## Cómo ejecutarlo

### Backend (requiere Java 25)

La base de datos es MySQL en AWS RDS. Las credenciales se entregan por variables de entorno y no están en el repositorio:

```powershell
cd BackPasteleria
$env:SPRING_PROFILES_ACTIVE = "rds"
$env:DB_USER = "<usuario>"
$env:DB_PASSWORD = "<contraseña>"
$env:JWT_SECRET = "<clave de al menos 32 caracteres>"
.\mvnw spring-boot:run
```

Sin el perfil `rds`, el backend usa la URL de `DB_URL` junto a `DB_USER` y `DB_PASSWORD`. Opcionales: `DB_NAME` (por defecto `pasteleria`) y `ADMIN_PASSWORD`.

- API: `http://localhost:8080/api`
- Swagger: `http://localhost:8080/swagger-ui.html` (con **Authorize** se pega el token para probar las rutas protegidas).
- Al arrancar se crea, si no existe, la cuenta administradora `admin@pasteleria.test`, con la contraseña de `ADMIN_PASSWORD`.
- Si la tabla de productos está vacía, se carga el catálogo inicial de 12 productos (pastelería, panadería, salados y sin azúcar). Si ya hay productos, no se toca, así no se duplican ni se pierden los cambios del administrador.

### Frontend (requiere Node.js 20.19 o superior)

```powershell
cd FrontPasteleria
npm install
npm run dev
```

Abrir `http://localhost:5173`. Para usar otra dirección de la API, definir `VITE_URL_API` (por defecto `http://localhost:8080/api`).

## Pruebas

- Frontend: `npm test` ejecuta 10 pruebas unitarias (Jasmine y Karma) y 24 casos de navegador (Playwright) que usan una API simulada con los mismos endpoints, tokens y códigos que el backend. Ver [docs/TESTING.md](docs/TESTING.md).
- Backend: `.\mvnw test` comprueba que la aplicación arranca; necesita las mismas variables de la base de datos.
