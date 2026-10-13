import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { createServer } from "node:net";
import { existsSync } from "node:fs";
import { chromium, expect } from "@playwright/test";
import { pages } from "../src/app/pages.js";

let browser, server, base;
before(async () => {
  assert.ok(existsSync("dist/index.html"), "Ejecuta npm run build antes de npm run test:styles.");
  const socket = createServer();
  socket.listen(0, "127.0.0.1");
  await once(socket, "listening");
  const port = socket.address().port;
  await new Promise(resolve => socket.close(resolve));
  base = `http://127.0.0.1:${port}`;
  server = spawn(process.execPath, ["node_modules/vite/bin/vite.js", "preview", "--host", "127.0.0.1", "--port", String(port), "--strictPort"], { stdio: ["ignore", "pipe", "pipe"] });
  let log = "";
  server.stdout.on("data", data => { log += data; });
  server.stderr.on("data", data => { log += data; });
  const started = new Promise((resolve, reject) => {
    server.once("error", reject);
    (async () => {
      for (let attempt = 0; attempt < 100; attempt++) {
        if (server.exitCode !== null) throw new Error(`El servidor terminó: ${log}`);
        try { if ((await fetch(base)).ok) return resolve(); } catch {}
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      throw new Error(`El servidor no arrancó: ${log}`);
    })().catch(reject);
  });
  await started;
  const executablePath = process.env.CHROME_BIN;
  const channel = !executablePath && !existsSync(chromium.executablePath()) && process.platform === "win32" ? "chrome" : undefined;
  browser = await chromium.launch({ headless: true, executablePath, channel });
});

after(async () => {
  await browser?.close();
  if (server && server.exitCode === null) {
    server.kill();
    await once(server, "exit");
  }
});

async function open(route, { width = 1440, selected = true } = {}) {
  const context = await browser.newContext({ viewport: { width, height: 1000 }, locale: "es-CL" });
  await context.addInitScript(selected => {
    sessionStorage.setItem("usuarioActivo", JSON.stringify({ nombre: "Admin", apellido: "Prueba", rol: "admin" }));
    if (selected) sessionStorage.setItem("productoSeleccionado", JSON.stringify({ id: "pasteleria-1", titulo: "Pastel de Chocolate", imagen: "/Pasteleria/img/pchoco.jpg", descripcion: "Producto de prueba", precio: 25000 }));
  }, selected);
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("response", response => { if (response.status() >= 400) errors.push(`${response.status()}: ${response.url()}`); });
  await page.goto(base + route, { waitUntil: "networkidle" });
  return { context, page, errors };
}

for (const width of [1440, 390]) {
  test(`Las 13 pantallas cargan sus estilos, fuentes e imágenes a ${width}px`, async () => {
    for (const [route, config] of Object.entries(pages)) {
      const { context, page, errors } = await open(route, { width });
      try {
        await expect(page.locator("main")).toBeVisible();
        assert.deepEqual(errors, [], config.name);
        assert.equal(await page.locator('link[rel="stylesheet"]').count(), 1, "El CSS se carga desde Vite, sin hojas añadidas por página.");
        await expect(page.locator("body")).toHaveCSS("background-color", "rgb(255, 245, 225)");
      } finally { await context.close(); }
    }
  });
}

test("Los módulos no modifican tarjetas, párrafos ni contenedores ajenos", async () => {
  const { context, page } = await open("/Pasteleria/pasteleria.html");
  try {
    for (const route of ["/Pasteleria/pasteleria.html", "/SobreNosotros/sobrenosotros.html", "/PerfilUsuario/index.html", "/Contacto/contacto.html", "/Pasteleria/pasteleria.html"]) {
      await page.goto(base + route, { waitUntil: "networkidle" });
      const styles = await page.evaluate(() => {
        const container = document.createElement("div");
        container.style.width = "400px";
        const main = document.createElement("main");
        const card = document.createElement("div");
        card.className = "card";
        const paragraph = document.createElement("p");
        paragraph.textContent = "Contenido ajeno a las páginas";
        card.append(paragraph); main.append(card); container.append(main); document.body.append(container);
        const result = { width: getComputedStyle(card).width, fontSize: getComputedStyle(paragraph).fontSize, marginTop: getComputedStyle(main).marginTop };
        container.remove();
        return result;
      });
      assert.deepEqual(styles, { width: "400px", fontSize: "16px", marginTop: "0px" }, route);
    }
  } finally { await context.close(); }
});

test("Las notificaciones conservan posición y estilos cuando cambia su visibilidad", async () => {
  const { context, page } = await open("/Pasteleria/pasteleria.html");
  try {
    await expect(page.locator("#productos .card").first()).toHaveCSS("width", "320px");
    await expect(page.locator("#toast-notificacion")).toHaveCSS("opacity", "0");
    await page.getByRole("button", { name: "Agregar al carrito", exact: true }).first().click();
    await expect(page.locator("#toast-notificacion")).toHaveCSS("opacity", "1");
    await expect(page.locator("#toast-notificacion")).toHaveCSS("bottom", "30px");
    await page.getByRole("button", { name: "Ver", exact: true }).first().click();
    await page.waitForURL("**/DetalleProducto/index.html");
    await expect(page.locator("#detalle-producto")).toHaveCSS("padding-top", "32px");
    await page.locator("#btn-agregar-detalle").click();
    await expect(page.locator("#mensaje-carrito")).toHaveCSS("opacity", "1");
    await expect(page.locator("#mensaje-carrito")).toHaveCSS("margin-bottom", "0px");
  } finally { await context.close(); }
});

test("Los mensajes de registro y el detalle vacío conservan sus estilos", async () => {
  const { context, page } = await open("/RegistroUsuario/registro.html", { selected: false });
  try {
    await page.evaluate(() => document.querySelector("#form-registro").dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })));
    await expect(page.locator("#mensaje-registro")).toBeVisible();
    await expect(page.locator("#mensaje-registro")).toHaveCSS("border-radius", "8px");
    await expect(page.locator("#mensaje-registro")).toHaveCSS("font-weight", "600");
    await page.goto(base + "/DetalleProducto/index.html");
    await expect(page.locator("#detalle-producto")).toBeHidden();
    await expect(page.locator("#mensaje-detalle")).toBeVisible();
  } finally { await context.close(); }
});
