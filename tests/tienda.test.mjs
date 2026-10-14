import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { expect } from "@playwright/test";
import { iniciarSitio } from "./helpers/sitio.mjs";
let sitio, browser, base;
before(async () => {
  sitio = await iniciarSitio();
  ({ browser, base } = sitio);
});
after(async () => {
  await sitio?.cerrar();
});
const cliente = {
  nombre: "Ana",
  apellido: "Prueba",
  email: "ana@example.test",
  rol: "cliente",
  direccion: "Calle 123",
  comuna: "Santiago",
  region: "metropolitana",
};
const producto = {
  id: "pasteleria-1",
  titulo: "Pastel de prueba",
  categoria: "pasteleria",
  descripcion: "Prueba de compra",
  imagen: "../Pasteleria/img/pchoco.jpg",
  precio: 10000,
  descuento: 20,
};
async function abrir(ruta, datos = {}) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    locale: "es-CL",
  });
  await context.addInitScript((datos) => {
    if (sessionStorage.getItem("tienda-prueba")) return;
    for (const [clave, valor] of Object.entries(datos))
      (clave === "usuarioActivo" ? sessionStorage : localStorage).setItem(
        clave,
        JSON.stringify(valor),
      );
    sessionStorage.setItem("tienda-prueba", "true");
  }, datos);
  const page = await context.newPage();
  const errores = [];
  page.on("pageerror", (error) => errores.push(error.message));
  page.on("response", (respuesta) => {
    if (respuesta.status() >= 400)
      errores.push(respuesta.status() + " " + respuesta.url());
  });
  await page.goto(base + ruta, { waitUntil: "networkidle" });
  await page.evaluate(() => {
    window.documentoTienda = true;
  });
  return { context, page, errores };
}
async function irAdmin(page) {
  await page.locator("#nombre-usuario-navbar").click();
  await page.getByRole("link", { name: "Panel de administración" }).click();
  await page.locator("#btn-ver-productos").click();
}
test("CRUD, descuento y cambios de categoría actualizan catálogo, detalle y carrito", async () => {
  const { context, page, errores } = await abrir("/administrador", {
    usuarioActivo: { ...cliente, rol: "admin" },
    productosPasteleria: [],
  });
  try {
    await page.locator("#btn-ver-productos").click();
    for (const [campo, valor] of Object.entries({
      titulo: "Pastel CRUD",
      descripcion: "Producto creado",
      imagen: "../Pasteleria/img/pchoco.jpg",
      precio: "10000",
      descuento: "25",
    }))
      await page.locator("#producto-" + campo).fill(valor);
    await page
      .getByRole("button", { name: "Guardar producto", exact: true })
      .click();
    await expect(
      page.getByText("Producto creado correctamente.", { exact: true }),
    ).toBeVisible();
    const id = await page.evaluate(
      () => JSON.parse(localStorage.productosPasteleria)[0].id,
    );
    await page
      .locator("#seccion-productos")
      .getByRole("link", { name: "Pastelería", exact: true })
      .click();
    await expect(page.locator("#productos article")).toContainText("$7.500");
    await page
      .getByRole("button", { name: "Agregar al carrito", exact: true })
      .click();
    await page.getByRole("button", { name: "Ver", exact: true }).click();
    await expect(page.locator("#detalle-precio")).toContainText("$7.500");
    await page.locator("#enlace-carrito-navbar").click();
    await expect(page.locator("#total")).toHaveText("$7.500");
    await irAdmin(page);
    await page
      .getByRole("button", { name: "Editar Pastel CRUD", exact: true })
      .click();
    await page.locator("#producto-precio").fill("8000");
    await page.locator("#producto-descuento").fill("50");
    await page.locator("#producto-categoria").selectOption("salados");
    await page
      .getByRole("button", { name: "Guardar cambios", exact: true })
      .click();
    await expect(
      page.getByText("Producto actualizado correctamente.", { exact: true }),
    ).toBeVisible();
    assert.equal(
      await page.evaluate(
        () => JSON.parse(localStorage.productosPasteleria)[0].id,
      ),
      id,
    );
    await page.locator("#enlace-carrito-navbar").click();
    await expect(page.locator("#total")).toHaveText("$4.000");
    await irAdmin(page);
    await page
      .getByRole("button", { name: "Eliminar Pastel CRUD", exact: true })
      .click();
    await page.getByRole("button", { name: "Cancelar", exact: true }).click();
    assert.equal(
      await page.evaluate(
        () => JSON.parse(localStorage.productosPasteleria).length,
      ),
      1,
    );
    await page
      .getByRole("button", { name: "Eliminar Pastel CRUD", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Confirmar eliminación", exact: true })
      .click();
    await expect(
      page.getByText("Producto eliminado correctamente.", { exact: true }),
    ).toBeVisible();
    assert.deepEqual(
      await page.evaluate(() => JSON.parse(localStorage.carrito)),
      [],
    );
    assert.deepEqual(
      await page.evaluate(() => JSON.parse(localStorage.productosPasteleria)),
      [],
    );
    assert.equal(await page.evaluate(() => window.documentoTienda), true);
    assert.deepEqual(errores, []);
  } finally {
    await context.close();
  }
});
test("Búsqueda, orden por precio y ofertas muestran los resultados correspondientes", async () => {
  const { context, page, errores } = await abrir("/pasteleria");
  try {
    await page.getByLabel("Buscar productos").fill("FRUTILLA");
    await expect(page.locator("#productos article")).toHaveCount(1);
    await page.getByLabel("Buscar productos").fill("ningún producto coincide");
    await expect(
      page.getByRole("heading", {
        name: "No se encontraron productos",
        exact: true,
      }),
    ).toBeVisible();
    await page.getByLabel("Buscar productos").fill("");
    await page.getByLabel("Ordenar por").selectOption("menor");
    await expect(page.locator("#productos h5").first()).toHaveText(
      "Pastel de Vainilla",
    );
    await page.getByLabel("Ordenar por").selectOption("mayor");
    await expect(page.locator("#productos h5").first()).toHaveText(
      "Pastel de Chocolate",
    );
    await page
      .locator("mi-navbar")
      .getByRole("link", { name: "Productos", exact: true })
      .click();
    await page.getByRole("link", { name: "Ofertas", exact: true }).click();
    await expect(
      page.getByRole("heading", {
        name: "No se encontraron productos",
        exact: true,
      }),
    ).toBeVisible();
    assert.deepEqual(errores, []);
  } finally {
    await context.close();
  }
});
test("Compra aprobada precarga datos, guarda un único pedido y conserva los precios pagados", async () => {
  const { context, page, errores } = await abrir("/checkout", {
    usuarioActivo: cliente,
    productosPasteleria: [producto],
    carrito: [{ ...producto, cantidad: 2 }],
  });
  try {
    await expect(page.locator("#checkout-nombre")).toHaveValue("Ana Prueba");
    await expect(page.locator("#checkout-direccion")).toHaveValue("Calle 123");
    await expect(page.locator("#checkout-total")).toHaveText("$19.000");
    await page.locator("#checkout-entrega").selectOption("retiro");
    await expect(page.locator("#checkout-total")).toHaveText("$16.000");
    await page.locator("#form-checkout").evaluate((formulario) => {
      formulario.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true }),
      );
      formulario.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true }),
      );
    });
    await page.waitForURL((url) => url.pathname.startsWith("/compra/"));
    await expect(page.locator("#pedido-total")).toHaveText("$16.000");
    const pedidos = await page.evaluate(() =>
      JSON.parse(localStorage.pedidosPasteleria),
    );
    assert.equal(pedidos.length, 1);
    assert.equal(pedidos[0].productos[0].precioFinal, 8000);
    assert.deepEqual(
      await page.evaluate(() => JSON.parse(localStorage.carrito)),
      [],
    );
    await page.reload();
    await expect(page.locator("#pedido-total")).toHaveText("$16.000");
    await page
      .getByRole("link", { name: "Ver historial", exact: true })
      .click();
    await expect(page.locator("#historial-pedidos")).toContainText(
      "Pastel de prueba",
    );
    await page
      .getByRole("link", { name: "Ver detalle completo", exact: true })
      .click();
    await page.evaluate(() => {
      const productos = JSON.parse(localStorage.productosPasteleria);
      productos[0].precio = 90000;
      localStorage.productosPasteleria = JSON.stringify(productos);
    });
    await page.reload();
    await expect(page.locator("#pedido-total")).toHaveText("$16.000");
    await page.evaluate(() =>
      sessionStorage.setItem(
        "usuarioActivo",
        JSON.stringify({
          nombre: "Otra",
          email: "otra@example.test",
          rol: "cliente",
        }),
      ),
    );
    await page.goto(base + "/perfil");
    await expect(page.locator("#historial-pedidos")).not.toContainText(
      "Pastel de prueba",
    );
    await page.evaluate(() =>
      sessionStorage.setItem(
        "usuarioActivo",
        JSON.stringify({
          nombre: "Admin",
          email: "admin@example.test",
          rol: "admin",
        }),
      ),
    );
    await page.goto(base + "/administrador");
    await expect(page.locator("#ventas-ingresos")).toHaveText("$16.000");
    await expect(page.locator("#ventas-pedidos")).toHaveText("1");
    await expect(page.locator("#ventas-promedio")).toHaveText("$16.000");
    await expect(page.locator("#ventas-unidades")).toHaveText("2");
    await expect(page.locator("#seccion-ventas table tbody")).toContainText(
      cliente.email,
    );
    assert.deepEqual(errores, []);
  } finally {
    await context.close();
  }
});
test("Pago rechazado conserva carrito y permite reintentar sin registrar pedidos", async () => {
  const { context, page, errores } = await abrir("/checkout", {
    usuarioActivo: cliente,
    productosPasteleria: [producto],
    carrito: [{ ...producto, cantidad: 1 }],
  });
  try {
    await page.locator("#checkout-pago").selectOption("rechazado");
    await page
      .getByRole("button", { name: "Confirmar compra", exact: true })
      .click();
    await page.waitForURL(base + "/compra-fallida");
    assert.equal(
      await page.evaluate(() => localStorage.getItem("pedidosPasteleria")),
      null,
    );
    assert.equal(
      await page.evaluate(() => JSON.parse(localStorage.carrito)[0].cantidad),
      1,
    );
    await page
      .getByRole("link", { name: "Volver a intentar", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Confirmar compra", exact: true })
      .click();
    await page.waitForURL((url) => url.pathname.startsWith("/compra/"));
    assert.equal(
      await page.evaluate(
        () => JSON.parse(localStorage.pedidosPasteleria).length,
      ),
      1,
    );
    assert.deepEqual(
      await page.evaluate(() => JSON.parse(localStorage.carrito)),
      [],
    );
    assert.equal(await page.evaluate(() => window.documentoTienda), true);
    assert.deepEqual(errores, []);
  } finally {
    await context.close();
  }
});
