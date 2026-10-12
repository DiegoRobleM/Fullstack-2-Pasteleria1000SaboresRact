import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { createServer } from "node:net";
import { readFile, mkdir, mkdtemp } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import { PNG } from "pngjs";
import { pages } from "../src/app/pages.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const original = path.resolve(root, "../Pasteleria1000Sabores/Fullstack_2");
const output = path.join(root, "test-results");
const servers = [];
let browser, sourceURL, reactURL;
const demo = {
  nombre: "Administrador",
  apellido: "Demo",
  email: "admin@pasteleria.test",
  password: "AdminDemo123!",
  rol: "admin",
  direccion: "Dirección ficticia",
  tipoPropiedad: "Local",
  region: "metropolitana",
  comuna: "santiago",
  guardarDatos: false,
};
const product = {
  id: "pasteleria-1",
  titulo: "Pastel de Chocolate",
  imagen: "../Pasteleria/img/pchoco.jpg",
  descripcion:
    "Delicioso pastel de bizcocho de chocolate con relleno de mermelada y manjar.",
  precio: 25000,
};
const query = {
  id: "consulta-1",
  correo: "cliente@example.test",
  mensaje: "Consulta de prueba",
  fecha: "2026-10-09T12:00:00.000Z",
  estado: "pendiente",
};

async function port() {
  const server = createServer();
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const number = server.address().port;
  await new Promise((resolve) => server.close(resolve));
  return number;
}

async function start(command, args, url) {
  const process = spawn(command, args, {
    cwd: root,
    stdio: ["ignore", "pipe", "pipe"],
  });
  servers.push(process);
  let log = "";
  process.stdout.on("data", (data) => {
    log += data;
  });
  process.stderr.on("data", (data) => {
    log += data;
  });
  for (let attempt = 0; attempt < 100; attempt++) {
    if (process.exitCode !== null)
      throw new Error(`Servidor terminó con ${process.exitCode}: ${log}`);
    try {
      if ((await fetch(url)).ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`El servidor no arrancó: ${log}`);
}

before(async () => {
  assert.ok(
    existsSync(path.join(original, "Inicio/index.html")),
    "Inicializa los submódulos: git submodule update --init --recursive",
  );
  assert.ok(
    existsSync(path.join(root, "dist/index.html")),
    "Ejecuta npm run build antes de npm test",
  );
  await mkdir(output, { recursive: true });
  sourceURL = `http://127.0.0.1:${await port()}`;
  reactURL = `http://127.0.0.1:${await port()}`;
  await start(
    "python3",
    [
      "-u",
      "-m",
      "http.server",
      new URL(sourceURL).port,
      "--bind",
      "127.0.0.1",
      "--directory",
      original,
    ],
    sourceURL + "/Inicio/index.html",
  );
  await start(
    process.execPath,
    [
      "node_modules/vite/bin/vite.js",
      "preview",
      "--host",
      "127.0.0.1",
      "--port",
      new URL(reactURL).port,
      "--strictPort",
    ],
    reactURL,
  );
  const temporary = await mkdtemp(
    path.join(os.tmpdir(), "react-original-browser-"),
  );
  browser = await chromium.launch({
    headless: true,
    executablePath:
      process.env.CHROME_BIN ||
      (existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined),
    args: ["--disable-dev-shm-usage"],
    env: {
      ...process.env,
      XDG_CONFIG_HOME: temporary,
      XDG_CACHE_HOME: temporary,
    },
  });
});

after(async () => {
  await browser?.close();
  for (const server of servers) {
    if (server.exitCode === null) {
      server.kill("SIGTERM");
      await once(server, "exit");
    }
  }
});

async function open(
  base,
  pathname,
  { viewport = { width: 1440, height: 1000 }, seed = true } = {},
) {
  const context = await browser.newContext({
    viewport,
    locale: "es-CL",
    timezoneId: "America/Santiago",
  });
  // El original pide estas versiones al CDN. Servir los mismos bytes locales
  // elimina la red y garantiza que la comparación usa idéntico Bootstrap.
  await context.route("https://cdn.jsdelivr.net/**", async (route) => {
    const url = new URL(route.request().url());
    let filename;
    if (url.pathname.includes("/bootstrap@5.3.3/dist/"))
      filename = path.join(
        root,
        "node_modules/bootstrap/dist",
        url.pathname.split("/dist/")[1],
      );
    else if (url.pathname.includes("/bootstrap-icons@1.11.3/font/"))
      filename = path.join(
        root,
        "node_modules/bootstrap-icons/font",
        url.pathname.split("/font/")[1],
      );
    if (!filename || !existsSync(filename))
      throw new Error(`Recurso CDN no previsto: ${url.pathname}`);
    await route.fulfill({
      path: filename,
      contentType: filename.endsWith(".css")
        ? "text/css"
        : filename.endsWith(".js")
          ? "text/javascript"
          : "font/woff2",
    });
  });
  if (seed)
    await context.addInitScript(
      ({ demo, product, query, base }) => {
        if (sessionStorage.getItem("parity-seeded")) return;
        localStorage.setItem("usuariosRegistrados", JSON.stringify([demo]));
        sessionStorage.setItem("usuarioActivo", JSON.stringify(demo));
        localStorage.setItem(
          "carrito",
          JSON.stringify([{ ...product, cantidad: 2 }]),
        );
        localStorage.setItem("consultasContacto", JSON.stringify([query]));
        sessionStorage.setItem(
          "productoSeleccionado",
          JSON.stringify({
            ...product,
            paginaOrigen: base + "/Pasteleria/pasteleria.html",
          }),
        );
        sessionStorage.setItem("parity-seeded", "true");
      },
      { demo, product, query, base },
    );
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(base + pathname, { waitUntil: "networkidle" });
  await page.locator("mi-navbar nav").waitFor();
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(async () => {
    await Promise.all(
      [...document.images].map((image) =>
        image.complete
          ? Promise.resolve()
          : new Promise((resolve) => {
              image.onload = resolve;
              image.onerror = resolve;
            }),
      ),
    );
  });
  return { context, page, errors };
}

async function compare(left, right, label) {
  await left.mouse.move(0, 0);
  await right.mouse.move(0, 0);
  await left.waitForTimeout(200);
  await right.waitForTimeout(200);
  const text = (page) =>
    page
      .locator("body")
      .innerText()
      .then((value) => value.replace(/\s+/g, " ").trim());
  assert.equal(
    await text(right),
    await text(left),
    `${label}: textos visibles`,
  );
  assert.equal(await right.title(), await left.title(), `${label}: título`);
  const [aBuffer, bBuffer] = await Promise.all([
    left.screenshot({
      fullPage: true,
      animations: "disabled",
      path: path.join(output, label + "-original.png"),
    }),
    right.screenshot({
      fullPage: true,
      animations: "disabled",
      path: path.join(output, label + "-react.png"),
    }),
  ]);
  const a = PNG.sync.read(aBuffer),
    b = PNG.sync.read(bBuffer);
  assert.equal(b.width, a.width, `${label}: ancho`);
  assert.equal(b.height, a.height, `${label}: alto`);
  let changed = 0;
  const diff = new PNG({ width: a.width, height: a.height });
  for (let offset = 0; offset < a.data.length; offset += 4) {
    const different = [0, 1, 2].some(
      (channel) =>
        Math.abs(a.data[offset + channel] - b.data[offset + channel]) > 8,
    );
    if (different) changed++;
    diff.data.set(different ? [255, 0, 0, 255] : [255, 255, 255, 255], offset);
  }
  if (changed) {
    const { writeFile } = await import("node:fs/promises");
    await writeFile(
      path.join(output, label + "-diff.png"),
      PNG.sync.write(diff),
    );
  }
  assert.equal(
    changed,
    0,
    `${label}: ${changed} píxeles distintos; revisar test-results/${label}-diff.png`,
  );
}

for (const viewport of [
  { width: 1440, height: 1000 },
  { width: 390, height: 844 },
]) {
  for (const [pathname, data] of Object.entries(pages)) {
    test(`Port fiel: ${data.name} a ${viewport.width}px`, async () => {
      const left = await open(sourceURL, pathname, { viewport });
      const right = await open(reactURL, pathname, { viewport });
      try {
        assert.deepEqual(
          right.errors,
          [],
          "React no debe arrojar errores JavaScript",
        );
        await compare(left.page, right.page, `${data.name}-${viewport.width}`);
      } finally {
        await left.context.close();
        await right.context.close();
      }
    });
  }
}

test("Catálogo → detalle → carrito: navegación, cantidades, persistencia y vaciado iguales", async () => {
  for (const base of [sourceURL, reactURL]) {
    const { context, page, errors } = await open(
      base,
      "/Pasteleria/pasteleria.html",
      { seed: false },
    );
    try {
      assert.equal(
        await page.locator(".contenedorProductos > .card").count(),
        3,
      );
      await page.locator(".btn-agregar").first().click();
      await page.locator(".btn-ver").first().click();
      await page.waitForURL("**/DetalleProducto/index.html");
      await page.locator("#detalle-cantidad").fill("3");
      await page.locator("#btn-agregar-detalle").click();
      assert.equal(
        await page.evaluate(() => JSON.parse(localStorage.carrito)[0].cantidad),
        4,
      );
      await page.locator("#btn-volver-catalogo").click();
      await page.waitForURL("**/Pasteleria/pasteleria.html");
      await page.locator("#enlace-carrito-navbar").click();
      await page.waitForURL("**/Carrito/carrito.html");
      assert.equal(
        (await page.locator("#total").innerText()).replace(/\s/g, ""),
        "$100.000",
      );
      await page
        .getByLabel("Disminuir cantidad de Pastel de Chocolate")
        .click();
      await page.getByLabel("Aumentar cantidad de Pastel de Chocolate").click();
      await page.reload();
      assert.equal(
        (await page.locator("#total").innerText()).replace(/\s/g, ""),
        "$100.000",
      );
      await page.locator(".btn-eliminar").click();
      await page.locator("#carrito .alert").waitFor();
      await page.goto(base + "/Pasteleria/pasteleria.html");
      await page.locator(".btn-agregar").first().click();
      await page.locator("#enlace-carrito-navbar").click();
      await page.waitForURL("**/Carrito/carrito.html");
      await page.locator("#btn-vaciar").click();
      assert.equal(await page.evaluate(() => localStorage.carrito), "[]");
      assert.deepEqual(errors, []);
    } finally {
      await context.close();
    }
  }
});

test("Detalle sin selección y protección de perfil/admin iguales", async () => {
  for (const base of [sourceURL, reactURL]) {
    const { context, page, errors } = await open(
      base,
      "/DetalleProducto/index.html",
      { seed: false },
    );
    try {
      assert.match(
        await page.locator("#mensaje-detalle").innerText(),
        /No hay un producto seleccionado/,
      );
      assert.equal(await page.locator("#detalle-producto").isVisible(), false);
      await page.goto(base + "/PerfilUsuario/index.html");
      await page.waitForURL("**/InicioSesion/iniciosesion.html");
      await page.goto(base + "/Administrador/index.html");
      await page.waitForURL("**/InicioSesion/iniciosesion.html");
      await page.evaluate(() =>
        sessionStorage.setItem(
          "usuarioActivo",
          JSON.stringify({ nombre: "Cliente", rol: "cliente" }),
        ),
      );
      await page.goto(base + "/Administrador/index.html");
      await page.waitForURL("**/Inicio/index.html");
      assert.deepEqual(errors, []);
    } finally {
      await context.close();
    }
  }
});

test("Registro, login, cuenta recordada, perfil y cierre de sesión iguales", async () => {
  for (const base of [sourceURL, reactURL]) {
    const { context, page, errors } = await open(
      base,
      "/RegistroUsuario/registro.html",
      { seed: false },
    );
    try {
      await page.locator("#form-registro button[type=submit]").click();
      await page.locator("#mensaje-registro").waitFor({ state: "visible" });
      assert.match(
        await page.locator("#mensaje-registro").innerText(),
        /El nombre es obligatorio/,
      );
      for (const [id, value] of Object.entries({
        nombre: "Ana",
        apellido: "Prueba",
        inputEmail: "ANA@example.test",
        inputPassword: "Prueba123!",
        inputAddress: "Calle 123",
        inputComuna: "Ñuñoa",
      }))
        await page.locator("#" + id).fill(value);
      await page.locator("[name=region]").selectOption("metropolitana");
      await page.locator("[name=tipoPropiedad]").fill("Casa");
      await page.locator("#form-registro button[type=submit]").click();
      await page.waitForURL("**/InicioSesion/iniciosesion.html");
      const users = await page.evaluate(() =>
        JSON.parse(localStorage.usuariosRegistrados),
      );
      assert.equal(users[0].email, "ana@example.test");
      assert.equal(users[0].rol, "cliente");
      await page.locator("#inputEmail").fill("ana@example.test");
      await page.locator("#inputPassword").fill("Incorrecta");
      await page.locator("#form-inicio-sesion button[type=submit]").click();
      await page.locator("#mensaje-login").waitFor({ state: "visible" });
      assert.equal(
        await page.locator("#mensaje-login").innerText(),
        "El correo o la contraseña son incorrectos.",
      );
      await page.locator("#inputPassword").fill("Prueba123!");
      await page.locator("#gridCheck").check();
      await page.locator("#form-inicio-sesion button[type=submit]").click();
      await page.waitForURL("**/PerfilUsuario/index.html");
      assert.equal(
        await page.locator("#perfil-nombre").innerText(),
        "Ana Prueba",
      );
      assert.equal(
        await page.evaluate(
          () => JSON.parse(localStorage.usuarioActivo).password,
        ),
        undefined,
      );
      await page.locator("#btn-cerrar-sesion").click();
      await page.waitForURL("**/InicioSesion/iniciosesion.html");
      assert.equal(
        await page.evaluate(() => localStorage.getItem("usuarioActivo")),
        null,
      );
      assert.deepEqual(errors, []);
    } finally {
      await context.close();
    }
  }
});

test("Contacto y administración: consultas, estado y usuarios iguales", async () => {
  const left = await open(sourceURL, "/Contacto/contacto.html");
  const right = await open(reactURL, "/Contacto/contacto.html");
  try {
    for (const { page } of [left, right]) {
      await page.locator("#correo-contacto").fill("NUEVA@example.test");
      await page.locator("#consulta-contacto").fill("Consulta nueva");
      await page.locator("#form-contacto button[type=submit]").click();
      assert.equal(
        await page.locator("#mensaje-contacto").innerText(),
        "Tu consulta fue enviada correctamente.",
      );
      const queries = await page.evaluate(() =>
        JSON.parse(localStorage.consultasContacto),
      );
      assert.equal(queries.at(-1).correo, "nueva@example.test");
      // Fijar únicamente la fecha/ID del dato de prueba para comparar imágenes.
      await page.evaluate(() => {
        const queries = JSON.parse(localStorage.consultasContacto);
        queries.at(-1).id = "consulta-2";
        queries.at(-1).fecha = "2026-10-10T12:00:00.000Z";
        localStorage.consultasContacto = JSON.stringify(queries);
      });
      await page.goto(
        (page === left.page ? sourceURL : reactURL) +
          "/Administrador/index.html",
      );
      await page.locator("#btn-ver-consultas").click();
      await page.locator("#tabla-consultas tr").nth(1).waitFor();
      await page
        .getByLabel("Cambiar estado de la consulta de nueva@example.test")
        .selectOption("resuelta");
      assert.equal(
        await page.evaluate(
          () => JSON.parse(localStorage.consultasContacto).at(-1).estado,
        ),
        "resuelta",
      );
      await page.locator("#btn-ver-usuarios").click();
      await page.locator("#tabla-usuarios tr").waitFor();
      await page.locator("#btn-ver-productos").click();
      assert.equal(await page.locator("#seccion-productos a").count(), 4);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(400);
    }
    await compare(left.page, right.page, "Administrador-expandido");
    assert.deepEqual(right.errors, []);
  } finally {
    await left.context.close();
    await right.context.close();
  }
});

for (const width of [1440, 390]) {
  for (const seed of [false, true]) {
    test(`Navegación original: menús a ${width}px, sesión ${seed ? "activa" : "cerrada"}`, async () => {
      const options = { viewport: { width, height: 1000 }, seed };
      const left = await open(sourceURL, "/Inicio/index.html", options);
      const right = await open(reactURL, "/Inicio/index.html", options);
      try {
        for (const { page } of [left, right]) {
          if (width < 992) {
            await page.locator(".navbar-toggler").click();
            await page.locator("#menu.show").waitFor();
            await page.waitForTimeout(400);
          }
          await page
            .locator("mi-navbar")
            .getByRole("link", { name: "Productos", exact: true })
            .click();
          await page.locator("mi-navbar .dropdown-menu.show").waitFor();
        }
        await compare(left.page, right.page, `Menu-productos-${width}-${seed}`);
        if (seed) {
          for (const { page } of [left, right]) {
            await page
              .locator("mi-navbar")
              .getByRole("link", { name: "Productos", exact: true })
              .click();
            await page.locator("#nombre-usuario-navbar").click();
            await page.locator("#btn-cerrar-sesion-navbar").waitFor();
          }
          await compare(left.page, right.page, `Menu-sesion-${width}`);
          for (const { page } of [left, right]) {
            await page.locator("#btn-cerrar-sesion-navbar").click();
            await page.waitForURL("**/InicioSesion/iniciosesion.html");
            assert.equal(
              await page.evaluate(() =>
                sessionStorage.getItem("usuarioActivo"),
              ),
              null,
            );
          }
        }
        assert.deepEqual(right.errors, []);
      } finally {
        await left.context.close();
        await right.context.close();
      }
    });
  }
}

test("Estados vacíos: carrito y detalle conservan el diseño original", async () => {
  for (const pathname of [
    "/Carrito/carrito.html",
    "/DetalleProducto/index.html",
  ]) {
    const left = await open(sourceURL, pathname, { seed: false });
    const right = await open(reactURL, pathname, { seed: false });
    try {
      await compare(left.page, right.page, pathname.split("/")[1] + "-vacio");
      assert.deepEqual(right.errors, []);
    } finally {
      await left.context.close();
      await right.context.close();
    }
  }
});
