// Toma las capturas del manual de usuario (docs/MANUAL_USUARIO.md) recorriendo
// la tienda REAL: front en http://localhost:5173 (npm run dev) y backend en
// http://localhost:8080 con su base de datos.
//
//   node scripts/capturas-manual.mjs
//
// Deja datos de demostración en la base: el cliente cliente.demo@pasteleria.test,
// una compra y una consulta. Para repetir solo algunas partes sin duplicar la
// compra ni la consulta, indicar las secciones en SOLO, por ejemplo:
//   $env:SOLO = "registro,admin"; node scripts/capturas-manual.mjs
// Secciones: visitante, registro, cliente, admin, celular.
// "registro" elimina primero la cuenta de demostración (si existe) para volver a crearla.
//
// Variables opcionales:
// - URL_FRONT y URL_API: direcciones del front y la API.
// - ADMIN_PASSWORD: contraseña del administrador; si no se define, se usa la
//   de desarrollo de BackPasteleria/src/main/resources/application.properties.
// - CHROME_BIN: ruta de Chrome o Edge si Playwright no encuentra el navegador.
import { existsSync, readFileSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { chromium } from "@playwright/test";

const BASE = process.env.URL_FRONT || "http://localhost:5173";
const API = process.env.URL_API || "http://localhost:8080/api";
const CARPETA = "../docs/manual/img/";
const SOLO = process.env.SOLO?.split(",").map((s) => s.trim());
const incluir = (seccion) => !SOLO || SOLO.includes(seccion);

// Cliente de demostración del manual.
const CLIENTE = {
  nombre: "Camila",
  apellido: "Demo",
  email: "cliente.demo@pasteleria.test",
  password: "ClienteDemo123!",
  direccion: "Av. Providencia 1234",
  comuna: "Providencia",
  tipoPropiedad: "Departamento",
};
const ADMIN_EMAIL = "admin@pasteleria.test";

function passwordAdmin() {
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD;
  const propiedades = readFileSync(
    "../BackPasteleria/src/main/resources/application.properties",
    "utf8",
  );
  const valor = propiedades.match(/app\.admin\.password=\$\{ADMIN_PASSWORD:([^}]*)\}/);
  if (!valor) throw new Error("Define ADMIN_PASSWORD para iniciar sesión como admin.");
  return valor[1];
}

/** Borra la cuenta de demostración (con la API, como admin) para poder registrarla de nuevo. */
async function eliminarClienteDemo() {
  const login = await fetch(API + "/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: passwordAdmin() }),
  });
  if (!login.ok) throw new Error("No se pudo iniciar sesión como admin: " + login.status);
  const { token } = await login.json();
  const cabeceras = { Authorization: "Bearer " + token };
  const usuarios = await (await fetch(API + "/usuarios", { headers: cabeceras })).json();
  const demo = usuarios.find((u) => u.email === CLIENTE.email);
  if (demo) await fetch(API + "/usuarios/" + demo.id, { method: "DELETE", headers: cabeceras });
}

const executablePath = process.env.CHROME_BIN;
const browser = await chromium.launch({
  headless: true,
  executablePath,
  channel:
    !executablePath && !existsSync(chromium.executablePath()) ? "chrome" : undefined,
});
await mkdir(CARPETA, { recursive: true });

const contexto = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  locale: "es-CL",
});
const page = await contexto.newPage();
const errores = [];
page.on("pageerror", (error) => errores.push(error.message));

const capturas = [];
/** Guarda una captura. Con `elemento`, solo esa parte; con `completa`, la página entera. */
async function capturar(archivo, { elemento, completa = false } = {}) {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400); // animaciones y notificaciones
  const ruta = CARPETA + archivo + ".png";
  if (elemento) await page.locator(elemento).first().screenshot({ path: ruta });
  else await page.screenshot({ path: ruta, fullPage: completa });
  capturas.push(archivo);
  console.log("✓", archivo);
}
async function ir(ruta) {
  await page.goto(BASE + ruta, { waitUntil: "networkidle" });
}
async function abrirMenuUsuario() {
  await page.locator("#nombre-usuario-navbar").click();
  await page.waitForTimeout(300);
}
async function iniciarSesion(email, password) {
  await ir("/inicio-sesion");
  await page.locator("#inputEmail").fill(email);
  await page.locator("#inputPassword").fill(password);
  await page.locator("#form-inicio-sesion button[type=submit]").click();
  await page.locator("#nombre-usuario-navbar").waitFor();
}
async function cerrarSesion() {
  await abrirMenuUsuario();
  await page.locator("#btn-cerrar-sesion-navbar").click();
  await page.getByRole("link", { name: "Iniciar sesión", exact: true }).waitFor();
}
async function agregarPrimerProducto(categoria) {
  await ir("/" + categoria);
  await page
    .getByRole("button", { name: "Agregar al carrito", exact: true })
    .first()
    .click();
}

try {
  if (incluir("visitante")) {
    await ir("/");
    await capturar("01-inicio");
    await ir("/categorias");
    await capturar("02-categorias");
    await ir("/pasteleria");
    await capturar("03-catalogo-pasteleria");

    await ir("/pasteleria");
    await page.getByRole("button", { name: "Ver", exact: true }).first().click();
    await page.locator("#detalle-producto").waitFor();
    await capturar("05-detalle-producto");
    await page.locator("#detalle-cantidad").fill("2");
    await page.locator("#btn-agregar-detalle").click();
    await capturar("06-detalle-agregado");

    await agregarPrimerProducto("panaderia");
    await capturar("07-notificacion-carrito");
    await page.locator("#enlace-carrito-navbar").click();
    await page.waitForURL("**/carrito");
    await capturar("08-carrito");
  }

  if (incluir("registro")) {
    await eliminarClienteDemo();
    await ir("/registro");
    for (const [id, valor] of Object.entries({
      nombre: CLIENTE.nombre,
      apellido: CLIENTE.apellido,
      inputEmail: CLIENTE.email,
      inputPassword: CLIENTE.password,
      inputAddress: CLIENTE.direccion,
      inputComuna: CLIENTE.comuna,
    }))
      await page.locator("#" + id).fill(valor);
    await page.locator("[name=region]").selectOption("metropolitana");
    await page.locator("[name=tipoPropiedad]").fill(CLIENTE.tipoPropiedad);
    await capturar("09-registro-formulario", { completa: true });
    await page.locator("#form-registro button[type=submit]").click();
    await page.locator("#mensaje-registro").waitFor({ state: "visible" });
    await page.evaluate(() => window.scrollTo(0, 0));
    await capturar("10-registro-resultado");
  }

  if (incluir("cliente")) {
    await ir("/inicio-sesion");
    await page.locator("#inputEmail").fill(CLIENTE.email);
    await page.locator("#inputPassword").fill(CLIENTE.password);
    await page.locator("#gridCheck").check();
    await capturar("11-inicio-sesion");
    await page.locator("#form-inicio-sesion button[type=submit]").click();
    await page.locator("#nombre-usuario-navbar").waitFor();
    await page.waitForURL("**/perfil");
    await capturar("12-perfil");
    await abrirMenuUsuario();
    await capturar("13-menu-cliente");
    await page.keyboard.press("Escape");

    // Compra aprobada: crea un pedido.
    if ((await page.locator("#contador-carrito").count()) === 0)
      await agregarPrimerProducto("pasteleria");
    await ir("/checkout");
    await page.locator("#checkout-entrega").selectOption({ index: 0 });
    await page.locator("#checkout-pago").selectOption("aprobado");
    await capturar("14-checkout", { completa: true });
    await page.getByRole("button", { name: "Confirmar compra", exact: true }).click();
    await page.waitForURL((url) => url.pathname.startsWith("/compra/"));
    await capturar("15-compra-confirmada", { completa: true });
    await ir("/perfil");
    await capturar("16-perfil-historial", { completa: true });

    // Pago rechazado: no crea pedido.
    await agregarPrimerProducto("salados");
    await ir("/checkout");
    await page.locator("#checkout-pago").selectOption("rechazado");
    await page.getByRole("button", { name: "Confirmar compra", exact: true }).click();
    await page.waitForURL("**/compra-fallida");
    await capturar("17-pago-rechazado");

    // Un cliente no puede entrar al panel: vuelve al inicio.
    await ir("/administrador");
    await page.waitForURL((url) => url.pathname === "/");

    // Contacto: crea una consulta.
    await ir("/contacto");
    await page.locator("#nombre-contacto").fill(CLIENTE.nombre + " " + CLIENTE.apellido);
    await page.locator("#correo-contacto").fill(CLIENTE.email);
    await page
      .locator("#consulta-contacto")
      .fill("Hola, ¿hacen tortas personalizadas para cumpleaños? Necesito una para 20 personas.");
    await capturar("18-contacto-formulario");
    await page.locator("#form-contacto button[type=submit]").click();
    await page.locator("#mensaje-contacto").waitFor({ state: "visible" });
    await capturar("19-contacto-enviado");
    await cerrarSesion();

    // Un visitante que abre /perfil va a Inicio de sesión.
    await ir("/perfil");
    await page.waitForURL("**/inicio-sesion");
  }

  if (incluir("admin")) {
    await iniciarSesion(ADMIN_EMAIL, passwordAdmin());
    await abrirMenuUsuario();
    await capturar("20-menu-administrador");
    await page.getByRole("link", { name: "Panel de administración" }).click();
    await page.waitForURL("**/administrador");
    await capturar("21-admin-ventas", { completa: true });
    for (const [seccion, archivo] of [
      ["productos", "22-admin-productos"],
      ["consultas", "23-admin-consultas"],
      ["usuarios", "24-admin-usuarios"],
    ]) {
      await page.locator("#btn-ver-" + seccion).click();
      await page.locator("#seccion-" + seccion).waitFor();
      // Consultas y usuarios llegan de la API después de abrir la sección.
      if (seccion !== "productos")
        await page.waitForFunction(
          (id) => document.querySelector("#total-" + id)?.textContent.trim() !== "0",
          seccion,
          { timeout: 10000 },
        );
      await capturar(archivo, { elemento: "#seccion-" + seccion });
    }
    await cerrarSesion();
  }

  if (incluir("celular")) {
    await page.setViewportSize({ width: 390, height: 844 });
    await ir("/");
    await page.locator(".navbar-toggler").click();
    await page.waitForTimeout(400);
    await capturar("25-celular-menu");
  }
} finally {
  await browser.close();
}

console.log(`\n${capturas.length} capturas en docs/manual/img`);
if (errores.length) {
  console.error("Errores de la página:", errores);
  process.exitCode = 1;
}
