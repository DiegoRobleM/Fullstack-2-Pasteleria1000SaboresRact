# Pastelería 1000 Sabores

Proyecto de la asignatura Fullstack 2 (Duoc UC): una tienda web de pastelería con un front en React y una API REST en Spring Boot para gestionar productos.

## Equipo

Desarrollado en equipo por [DiegoRobleM](https://github.com/DiegoRobleM), [Victoria-A02](https://github.com/Victoria-A02) y [Vicentep12](https://github.com/Vicentep12).

## Estructura del repositorio

- **FrontPasteleria**: tienda en React 19 con Vite, React Router y Bootstrap. Incluye catálogo por categorías, búsqueda, carrito, registro e inicio de sesión, checkout con pago simulado, historial de pedidos y administración de productos. En esta versión los datos se guardan de forma simulada en el navegador. Más detalle en [FrontPasteleria/README.md](FrontPasteleria/README.md).
- **BackPasteleria**: API REST en Spring Boot (Java 25) con Spring Data JPA, validación y documentación OpenAPI con springdoc. Expone el CRUD de productos en /api/productos.
- **docs**: especificación de requisitos (ERS), documentación de pruebas y resultados de cobertura.

## Tecnologías

- Front: React, Vite, React Router, Bootstrap, pruebas con Karma, Jasmine y Playwright.
- Back: Spring Boot, Spring Data JPA, H2, MySQL, Lombok y springdoc-openapi.

## Cómo ejecutarlo

Front (requiere Node.js 20.19 o superior):

    cd FrontPasteleria
    npm install
    npm run dev

Back (requiere Java 25):

    cd BackPasteleria
    ./mvnw spring-boot:run

Por defecto el back usa una base de datos H2 en memoria, así que arranca sin instalar nada y los datos se pierden al detener la aplicación. También hay un perfil rds para conectarse a MySQL en AWS RDS, que se activa con SPRING_PROFILES_ACTIVE=rds. Las credenciales se entregan por variables de entorno y no están en el repositorio.
