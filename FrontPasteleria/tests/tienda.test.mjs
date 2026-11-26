import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { expect } from "@playwright/test";
import { iniciarSitio } from "./helpers/sitio.mjs";
import {
  ADMIN,
  URL_API,
  crearApiSimulada,
  sesion,
} from "./helpers/apiSimulada.mjs";
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
const otraCliente = {
  nombre: "Otra",
  apellido: "Cuenta",
  email: "otra@example.test",
  rol: "cliente",
};
// En la API simulada recibe el ID 1 por ser el único producto.
const producto = {
  titulo: "Pastel de prueba",
  categoria: "pasteleria",
  descripcion: "Prueba de compra",
  imagen: "../Pasteleria/img/pchoco.jpg",
  precio: 10000,
  descuento: 20,
};
const productoGuardado = { ...producto, id: 1 };

/**
 * Abre una página con la API simulada.
 * - almacenamiento: datos iniciales del navegador (usuarioActivo va a sessionStorage).
 * - errores: errores de la página y recursos que fallan (no incluye la API).
 * - erroresApi: respuestas de error de la API, para las pruebas que las esperan.
 */
async function abrir(ruta, { almacenamiento = {}, api = crearApiSimulada() } = {}) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    locale: "es-CL",
  });
  await api.instalar(context);
  await context.addInitScript((datos) => {
    if (sessionStorage.getItem("tienda-prueba")) return;
    for (const [clave, valor] of Object.entries(datos))
      (clave === "usuarioActivo" ? sessionStorage : localStorage).setItem(
        clave,
        JSON.stringify(valor),
      );
    sessionStorage.setItem("tienda-prueba", "true");
  }, almacenamiento);
  const page = await context.newPage();
  const errores = [];
  const erroresApi = [];
  page.on("pageerror", (error) => errores.push(error.message));
  page.on("response", (respuesta) => {
    if (respuesta.status() >= 400)
      (respuesta.url().startsWith(URL_API) ? erroresApi : errores).push(
        respuesta.status() + " " + respuesta.url(),
      );
  });
  await page.goto(base + ruta, { waitUntil: "networkidle" });
  await page.evaluate(() => {
    window.documentoTienda = true;
  });
  return { context, page, errores, erroresApi, api };
}
async function irAdmin(page) {
  await page.locator("#nombre-usuario-navbar").click();
  await page.getByRole("link", { name: "Panel de administración" }).click();
  await page.locator("#btn-ver-productos").click();
}
test("CRUD, descuento y cambios de categoría actualizan catálogo, detalle y carrito", async () => {
  const { context, page, errores, erroresApi, api } = await abrir(
    "/administrador",
    {
      almacenamiento: { usuarioActivo: sesion(ADMIN) },
      api: crearApiSimulada({ productos: [] }),
    },
  );
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
    assert.equal(api.estado.productos.length, 1);
    const id = api.estado.productos[0].id;
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
    // Editar conserva el ID aunque cambie de categoría.
    assert.equal(api.estado.productos[0].id, id);
    assert.equal(api.estado.productos[0].categoria, "salados");
    await page.locator("#enlace-carrito-navbar").click();
    await expect(page.locator("#total")).toHaveText("$4.000");
    await irAdmin(page);
    await page
      .getByRole("button", { name: "Eliminar Pastel CRUD", exact: true })
      .click();
    await page.getByRole("button", { name: "Cancelar", exact: true }).click();
    assert.equal(api.estado.productos.length, 1);
    await page
      .getByRole("button", { name: "Eliminar Pastel CRUD", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Confirmar eliminación", exact: true })
      .click();
    await expect(
      page.getByText("Producto eliminado correctamente.", { exact: true }),
    ).toBeVisible();
    // El producto eliminado sale de la base y del carrito.
    assert.deepEqual(api.estado.productos, []);
    assert.deepEqual(
      await page.evaluate(() => JSON.parse(localStorage.carrito)),
      [],
    );
    assert.equal(await page.evaluate(() => window.documentoTienda), true);
    assert.deepEqual(errores, []);
    assert.deepEqual(erroresApi, []);
  } finally {
    await context.close();
  }
});
test("Búsqueda, orden por precio y ofertas muestran los resultados correspondientes", async () => {
  const { context, page, errores, erroresApi } = await abrir("/pasteleria");
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
    assert.deepEqual(erroresApi, []);
  } finally {
    await context.close();
  }
});
test("Compra aprobada precarga datos, guarda un único pedido y conserva los precios pagados", async () => {
  const { context, page, errores, erroresApi, api } = await abrir("/checkout", {
    almacenamiento: {
      usuarioActivo: sesion(cliente),
      carrito: [{ ...productoGuardado, cantidad: 2 }],
    },
    api: crearApiSimulada({
      productos: [producto],
      usuarios: [cliente, otraCliente],
    }),
  });
  try {
    await expect(page.locator("#checkout-nombre")).toHaveValue("Ana Prueba");
    await expect(page.locator("#checkout-direccion")).toHaveValue("Calle 123");
    await expect(page.locator("#checkout-total")).toHaveText("$19.000");
    await page.locator("#checkout-entrega").selectOption("retiro");
    await expect(page.locator("#checkout-total")).toHaveText("$16.000");
    // Dos envíos seguidos del formulario deben registrar un solo pedido.
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
    assert.equal(api.estado.pedidos.length, 1);
    assert.equal(api.estado.pedidos[0].correoCliente, cliente.email);
    assert.equal(api.estado.pedidos[0].productos[0].precioFinal, 8000);
    assert.deepEqual(
      await page.evaluate(() => JSON.parse(localStorage.carrito)),
      [],
    );
    // Al recargar, el pedido se vuelve a pedir al backend (/pedidos/mios).
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
    // Cambiar el precio del catálogo no altera lo pagado.
    api.estado.productos[0].precio = 90000;
    await page.reload();
    await expect(page.locator("#pedido-total")).toHaveText("$16.000");
    await page.evaluate(
      (usuario) =>
        sessionStorage.setItem("usuarioActivo", JSON.stringify(usuario)),
      sesion(otraCliente),
    );
    await page.goto(base + "/perfil");
    await expect(page.locator("#perfil-nombre")).toHaveText("Otra Cuenta");
    await expect(page.locator("#historial-pedidos")).not.toContainText(
      "Pastel de prueba",
    );
    await page.evaluate(
      (usuario) =>
        sessionStorage.setItem("usuarioActivo", JSON.stringify(usuario)),
      sesion(ADMIN),
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
    assert.deepEqual(erroresApi, []);
  } finally {
    await context.close();
  }
});
test("Pago rechazado conserva carrito y permite reintentar sin registrar pedidos", async () => {
  const { context, page, errores, erroresApi, api } = await abrir("/checkout", {
    almacenamiento: {
      usuarioActivo: sesion(cliente),
      carrito: [{ ...productoGuardado, cantidad: 1 }],
    },
    api: crearApiSimulada({ productos: [producto], usuarios: [cliente] }),
  });
  try {
    await page.locator("#checkout-pago").selectOption("rechazado");
    await page
      .getByRole("button", { name: "Confirmar compra", exact: true })
      .click();
    await page.waitForURL(base + "/compra-fallida");
    assert.equal(api.estado.pedidos.length, 0);
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
    assert.equal(api.estado.pedidos.length, 1);
    assert.deepEqual(
      await page.evaluate(() => JSON.parse(localStorage.carrito)),
      [],
    );
    assert.equal(await page.evaluate(() => window.documentoTienda), true);
    assert.deepEqual(errores, []);
    assert.deepEqual(erroresApi, []);
  } finally {
    await context.close();
  }
});
test("Un visitante compra sin sesión y un token vencido no bloquea la tienda", async () => {
  const { context, page, errores, erroresApi, api } = await abrir("/checkout", {
    almacenamiento: {
      // Token sin vencer, pero de una cuenta que la API ya no reconoce (401).
      usuarioActivo: sesion(cliente),
      carrito: [{ ...productoGuardado, cantidad: 1 }],
    },
    api: crearApiSimulada({ productos: [producto] }),
  });
  try {
    // El front cierra la sesión vencida y el catálogo carga igual.
    await expect(
      page.getByRole("link", { name: "Iniciar sesión", exact: true }),
    ).toBeVisible();
    assert.equal(
      await page.evaluate(() => sessionStorage.getItem("usuarioActivo")),
      null,
    );
    for (const [campo, valor] of Object.entries({
      nombre: "Visitante",
      email: "VISITA@example.test",
      direccion: "Calle 1",
      comuna: "Ñuñoa",
      region: "metropolitana",
    }))
      await page.locator("#checkout-" + campo).fill(valor);
    await page
      .getByRole("button", { name: "Confirmar compra", exact: true })
      .click();
    await page.waitForURL((url) => url.pathname.startsWith("/compra/"));
    await expect(page.locator("#pedido-total")).toHaveText("$11.000");
    assert.equal(api.estado.pedidos.length, 1);
    assert.equal(api.estado.pedidos[0].correoCliente, "visita@example.test");
    assert.deepEqual(errores, []);
    // Solo los 401 del token vencido, antes de cerrar la sesión.
    assert.ok(erroresApi.every((error) => error.startsWith("401 ")));
  } finally {
    await context.close();
  }
});
test("El token por vencer se renueva y uno vencido se descarta al recargar", async () => {
  // Token al que le quedan 10 minutos: el front pide uno nuevo antes de usarlo.
  const api = crearApiSimulada({ usuarios: [cliente] });
  const porVencer = sesion(cliente, { segundos: 10 * 60 });
  const { context, page, errores, erroresApi } = await abrir("/perfil", {
    almacenamiento: { usuarioActivo: porVencer },
    api,
  });
  try {
    await expect(page.locator("#nombre-usuario-navbar")).toContainText("Ana");
    await expect.poll(() => api.estado.renovaciones).toBe(1);
    const guardado = await page.evaluate(() =>
      JSON.parse(sessionStorage.getItem("usuarioActivo")),
    );
    assert.notEqual(guardado.token, porVencer.token);
    assert.equal(guardado.email, cliente.email);
    // Al recargar, la sesión renovada sigue activa y no se renueva de nuevo.
    await page.reload({ waitUntil: "networkidle" });
    await expect(page.locator("#nombre-usuario-navbar")).toContainText("Ana");
    assert.equal(api.estado.renovaciones, 1);
    assert.deepEqual(errores, []);
    assert.deepEqual(erroresApi, []);
  } finally {
    await context.close();
  }

  // Token ya vencido: se descarta al cargar, sin pedir nada con él.
  const vencida = await abrir("/perfil", {
    almacenamiento: { usuarioActivo: sesion(cliente, { segundos: -60 }) },
    api: crearApiSimulada({ usuarios: [cliente] }),
  });
  try {
    await vencida.page.waitForURL("**/inicio-sesion");
    assert.equal(
      await vencida.page.evaluate(() => sessionStorage.getItem("usuarioActivo")),
      null,
    );
    assert.deepEqual(vencida.errores, []);
    assert.deepEqual(vencida.erroresApi, []);
  } finally {
    await vencida.context.close();
  }
});
