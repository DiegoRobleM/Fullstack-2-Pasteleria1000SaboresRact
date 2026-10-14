import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { expect } from "@playwright/test";
import { paginas } from "../src/app/pages.js";
import { iniciarSitio } from "./helpers/sitio.mjs";

let sitio, browser, base;
before(async () => {
  sitio = await iniciarSitio();
  ({ browser, base } = sitio);
});
after(async () => {
  await sitio?.cerrar();
});

async function open(route, { width = 1440 } = {}) {
  const context = await browser.newContext({
    viewport: { width, height: 1000 },
    locale: "es-CL",
  });
  await context.addInitScript(() => {
    sessionStorage.setItem(
      "usuarioActivo",
      JSON.stringify({ nombre: "Admin", apellido: "Prueba", rol: "admin" }),
    );
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (response.status() >= 400)
      errors.push(`${response.status()}: ${response.url()}`);
  });
  await page.goto(base + route, { waitUntil: "networkidle" });
  return { context, page, errors };
}

for (const width of [1440, 390]) {
  test(`Las ${Object.keys(paginas).length} pantallas cargan sus estilos, fuentes e imágenes a ${width}px`, async () => {
    for (const [nombre, config] of Object.entries(paginas)) {
      const { context, page, errors } = await open(
        config.path
          .replace(":idProducto", "pasteleria-1")
          .replace(":idPedido", "no-existe"),
        { width },
      );
      try {
        await expect(page.locator("main")).toBeVisible();
        assert.deepEqual(errors, [], nombre);
        assert.equal(
          await page.locator('link[rel="stylesheet"]').count(),
          1,
          "El CSS se carga desde Vite, sin hojas añadidas por página.",
        );
        await expect(page.locator("body")).toHaveCSS(
          "background-color",
          "rgb(241, 230, 199)",
        );
      } finally {
        await context.close();
      }
    }
  });
}

test("Los módulos no modifican tarjetas, párrafos ni contenedores ajenos", async () => {
  const { context, page } = await open("/pasteleria");
  try {
    for (const route of [
      "/pasteleria",
      "/sobre-nosotros",
      "/perfil",
      "/contacto",
      "/pasteleria",
    ]) {
      if (route === "/pasteleria") {
        await page
          .locator("mi-navbar")
          .getByRole("link", { name: "Productos", exact: true })
          .click();
      }
      if (route === "/perfil")
        await page.locator("#nombre-usuario-navbar").click();
      await page.locator(`mi-navbar a[href="${route}"]`).click();
      await page.waitForURL(base + route);
      const styles = await page.evaluate(() => {
        const container = document.createElement("div");
        container.style.width = "400px";
        const main = document.createElement("main");
        const card = document.createElement("div");
        card.className = "card";
        const paragraph = document.createElement("p");
        paragraph.textContent = "Contenido ajeno a las páginas";
        card.append(paragraph);
        main.append(card);
        container.append(main);
        document.body.append(container);
        const result = {
          width: getComputedStyle(card).width,
          fontSize: getComputedStyle(paragraph).fontSize,
          marginTop: getComputedStyle(main).marginTop,
        };
        container.remove();
        return result;
      });
      assert.deepEqual(
        styles,
        { width: "400px", fontSize: "16px", marginTop: "0px" },
        route,
      );
    }
  } finally {
    await context.close();
  }
});

test("Las notificaciones conservan posición y estilos cuando cambia su visibilidad", async () => {
  const { context, page } = await open("/pasteleria");
  try {
    await expect(page.locator("#productos article").first()).toHaveCSS(
      "width",
      "352px",
    );
    await expect(page.locator("#toast-notificacion")).toHaveCSS("opacity", "0");
    await page
      .getByRole("button", { name: "Agregar al carrito", exact: true })
      .first()
      .click();
    await expect(page.locator("#toast-notificacion")).toHaveCSS("opacity", "1");
    await expect(page.locator("#toast-notificacion")).toHaveCSS(
      "bottom",
      "30px",
    );
    await page
      .getByRole("button", { name: "Ver", exact: true })
      .first()
      .click();
    await page.waitForURL("**/producto/pasteleria-1");
    await expect(page.locator("#detalle-producto")).toHaveCSS(
      "padding-top",
      "35px",
    );
    await page.locator("#btn-agregar-detalle").click();
    await expect(page.locator("#mensaje-carrito")).toHaveCSS("opacity", "1");
    await expect(page.locator("#mensaje-carrito")).toHaveCSS(
      "margin-bottom",
      "0px",
    );
  } finally {
    await context.close();
  }
});

test("Los mensajes de registro y el detalle vacío conservan sus estilos", async () => {
  const { context, page } = await open("/registro");
  try {
    await page.evaluate(() =>
      document
        .querySelector("#form-registro")
        .dispatchEvent(
          new Event("submit", { bubbles: true, cancelable: true }),
        ),
    );
    await expect(page.locator("#mensaje-registro")).toBeVisible();
    await expect(page.locator("#mensaje-registro")).toHaveCSS(
      "border-radius",
      "12px",
    );
    await expect(page.locator("#mensaje-registro")).toHaveCSS(
      "font-weight",
      "600",
    );
    await page.goto(base + "/producto/sin-seleccion");
    await expect(page.locator("#detalle-producto")).toBeHidden();
    await expect(page.locator("#mensaje-detalle")).toBeVisible();
  } finally {
    await context.close();
  }
});
