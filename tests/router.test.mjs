import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { expect } from "@playwright/test";
import { paginas, rutasAnteriores } from "../src/app/pages.js";
import { iniciarSitio } from "./helpers/sitio.mjs";

let sitio, browser, base;
before(async () => {
  sitio = await iniciarSitio();
  ({ browser, base } = sitio);
});
after(async () => {
  await sitio?.cerrar();
});

async function abrir(ruta, { usuario, ancho = 1440, productos } = {}) {
  const context = await browser.newContext({
    viewport: { width: ancho, height: 1000 },
    locale: "es-CL",
  });
  await context.addInitScript(
    ({ usuario, productos }) => {
      if (sessionStorage.getItem("datos-prueba")) return;
      if (usuario)
        sessionStorage.setItem("usuarioActivo", JSON.stringify(usuario));
      if (productos)
        localStorage.setItem("productosPasteleria", JSON.stringify(productos));
      sessionStorage.setItem("datos-prueba", "true");
    },
    { usuario, productos },
  );
  const page = await context.newPage();
  const errores = [];
  page.on("pageerror", (error) => errores.push(error.message));
  page.on("response", (response) => {
    if (response.status() >= 400)
      errores.push(`${response.status()}: ${response.url()}`);
  });
  await page.goto(base + ruta, { waitUntil: "networkidle" });
  await page.evaluate(() => {
    window.documentoPrueba = "sin-recarga";
  });
  return { context, page, errores };
}

async function comprobarSinRecarga(page, errores) {
  assert.equal(
    await page.evaluate(() => window.documentoPrueba),
    "sin-recarga",
  );
  assert.deepEqual(errores, []);
}

async function completarRegistro(page, correo = "ANA@example.test") {
  for (const [id, valor] of Object.entries({
    nombre: "Ana",
    apellido: "Prueba",
    inputEmail: correo,
    inputPassword: "Prueba123!",
    inputAddress: "Calle 123",
    inputComuna: "Ñuñoa",
  })) {
    await page.locator("#" + id).fill(valor);
  }
  await page.locator("[name=region]").selectOption("metropolitana");
  await page.locator("[name=tipoPropiedad]").fill("Casa");
}

test("Las trece URL antiguas redirigen; raíz, index y ruta desconocida abren Inicio", async () => {
  const { context, page, errores } = await abrir("/", {
    usuario: { nombre: "Admin", rol: "admin" },
  });
  try {
    for (const [ruta, nombre] of Object.entries(rutasAnteriores)) {
      await page.goto(base + ruta);
      const destino = paginas[nombre].path.replace(
        ":idProducto",
        "sin-seleccion",
      );
      await page.waitForURL(base + destino);
      await expect(page.locator("main")).toBeVisible();
      await expect(page).toHaveTitle(paginas[nombre].title);
    }
    for (const ruta of ["/", "/index.html", "/direccion-desconocida"]) {
      await page.goto(base + ruta);
      await page.waitForURL(base + "/");
      await expect(page).toHaveTitle(paginas.Inicio.title);
    }
    await page.evaluate(() =>
      sessionStorage.setItem("productoSeleccionado", '{"id":"panaderia-2"}'),
    );
    await page.goto(base + "/DetalleProducto/index.html");
    await page.waitForURL(base + "/producto/panaderia-2");
    await expect(page.locator("#detalle-titulo")).toHaveText("Pan Ciabatta");
    await page.evaluate(() =>
      sessionStorage.setItem("productoSeleccionado", "dato inválido"),
    );
    await page.goto(base + "/DetalleProducto/index.html");
    await page.waitForURL(base + "/producto/sin-seleccion");
    await expect(page.locator("#mensaje-detalle")).toBeVisible();
    assert.deepEqual(errores, []);
  } finally {
    await context.close();
  }
});

test("Catálogo, detalle, carrito y Atrás/Adelante conservan el documento y el estado", async () => {
  const { context, page, errores } = await abrir("/pasteleria");
  try {
    await page
      .getByRole("button", { name: "Agregar al carrito", exact: true })
      .first()
      .click();
    await page
      .getByRole("button", { name: "Ver", exact: true })
      .first()
      .click();
    await page.waitForURL(base + "/producto/pasteleria-1");
    await page.locator("#detalle-cantidad").fill("3");
    await page.locator("#btn-agregar-detalle").click();
    await page.goBack();
    await page.waitForURL(base + "/pasteleria");
    await expect(page.locator("#toast-notificacion")).toHaveCSS("opacity", "0");
    await page.getByRole("button", { name: "Ver", exact: true }).nth(1).click();
    await page.waitForURL(base + "/producto/pasteleria-2");
    await expect(page.locator("#detalle-cantidad")).toHaveValue("1");
    await expect(page.locator("#mensaje-carrito")).toBeHidden();
    await page.goBack();
    await page.goForward();
    await expect(page.locator("#detalle-titulo")).toHaveText(
      "Pastel de Frutilla",
    );
    await expect(page).toHaveTitle(
      "Pastel de Frutilla | Pastelería 1000 Sabores",
    );
    await page.locator("#enlace-carrito-navbar").click();
    await page.waitForURL(base + "/carrito");
    await expect(page.locator("#total")).toHaveText(/100\.000/);
    await page.getByLabel("Disminuir cantidad de Pastel de Chocolate").click();
    await expect(page.locator("#total")).toHaveText(/75\.000/);
    await comprobarSinRecarga(page, errores);
    await page.reload();
    await expect(page.locator("#total")).toHaveText(/75\.000/);
    await page.getByRole("button", { name: "Eliminar", exact: true }).click();
    await expect(page.locator("#carrito")).toContainText(
      "Tu carrito está vacío",
    );
    assert.deepEqual(errores, []);
  } finally {
    await context.close();
  }
});

test("Detalle directo y recarga funcionan sin selección previa en las cuatro categorías", async () => {
  for (const categoria of [
    "pasteleria",
    "panaderia",
    "salados",
    "sin-azucar",
  ]) {
    const { context, page, errores } = await abrir(`/producto/${categoria}-1`);
    try {
      assert.equal(
        await page.evaluate(() =>
          sessionStorage.getItem("productoSeleccionado"),
        ),
        null,
      );
      await expect(page.locator("#detalle-producto")).toBeVisible();
      assert.equal(
        await page
          .locator("#detalle-imagen")
          .evaluate((img) => img.complete && img.naturalWidth > 0),
        true,
      );
      await page.reload();
      await expect(page.locator("#detalle-producto")).toBeVisible();
      await page.locator("#btn-volver-catalogo").click();
      await page.waitForURL(base + "/" + categoria);
      await expect(page.locator("#productos article")).toHaveCount(3);
      assert.deepEqual(errores, []);
    } finally {
      await context.close();
    }
  }
});

test("Detalle usa el producto persistido e interpreta su imagen antigua desde la raíz", async () => {
  const producto = {
    id: "panaderia-personalizado",
    categoria: "panaderia",
    titulo: "Pan nuevo",
    descripcion: "Prueba de producto guardado",
    precio: 3000,
    imagen: "../Panaderia/img/pan.JPG",
  };
  const { context, page, errores } = await abrir(
    "/producto/panaderia-personalizado",
    { productos: [producto] },
  );
  try {
    await expect(page.locator("#detalle-titulo")).toHaveText("Pan nuevo");
    await expect(page.locator("#detalle-imagen")).toHaveAttribute(
      "src",
      "/Panaderia/img/pan.JPG",
    );
    await page.locator("#btn-agregar-detalle").click();
    await page.locator("#enlace-carrito-navbar").click();
    await expect(page.locator("#carrito img")).toHaveAttribute(
      "src",
      "/Panaderia/img/pan.JPG",
    );
    await comprobarSinRecarga(page, errores);
  } finally {
    await context.close();
  }
});

test("Un ID inexistente muestra un mensaje y permite volver al catálogo", async () => {
  const { context, page, errores } = await abrir("/producto/no-existe");
  try {
    await expect(page.locator("#detalle-producto")).toBeHidden();
    await expect(page.locator("#mensaje-detalle")).toContainText("no existe");
    await page.getByRole("link", { name: "Volver al catálogo" }).click();
    await page.waitForURL(base + "/pasteleria");
    await comprobarSinRecarga(page, errores);
  } finally {
    await context.close();
  }
});

for (const recordar of [false, true]) {
  test(`Login ${recordar ? "recordado" : "temporal"}, menú reactivo y logout sin recargar`, async () => {
    const { context, page, errores } = await abrir("/inicio-sesion");
    try {
      await page.locator("#inputEmail").fill("admin@pasteleria.test");
      await page.locator("#inputPassword").fill("incorrecta");
      await page.locator("#form-inicio-sesion button[type=submit]").click();
      await expect(page.locator("#mensaje-login")).toContainText("incorrectos");
      await expect(page.locator("#inputPassword")).toHaveValue("");
      await expect(page.locator("#inputPassword")).toBeFocused();
      await page.locator("#inputPassword").fill("AdminDemo123!");
      if (recordar) await page.locator("#gridCheck").check();
      await page.locator("#form-inicio-sesion button[type=submit]").click();
      await expect(page.locator("#nombre-usuario-navbar")).toHaveText(
        "Hola, Administrador",
      );
      await page.waitForURL(base + "/perfil");
      await expect(page.locator("#perfil-nombre")).toHaveText(
        "Administrador Demo",
      );
      assert.equal(
        await page.evaluate((recordar) => {
          const guardado = JSON.parse(
            (recordar ? localStorage : sessionStorage).getItem("usuarioActivo"),
          );
          return (
            guardado.email === "admin@pasteleria.test" && !guardado.password
          );
        }, recordar),
        true,
      );
      const otraPagina = await context.newPage();
      otraPagina.on("pageerror", (error) => errores.push(error.message));
      await otraPagina.goto(base + "/perfil");
      await otraPagina.waitForURL(
        base + (recordar ? "/perfil" : "/inicio-sesion"),
      );
      await otraPagina.close();
      await page.locator("#nombre-usuario-navbar").click();
      await page.getByRole("link", { name: "Panel de administración" }).click();
      await page.waitForURL(base + "/administrador");
      await page.locator("#nombre-usuario-navbar").click();
      await page.locator("#btn-cerrar-sesion-navbar").click();
      await page.waitForURL(base + "/inicio-sesion");
      await expect(
        page.getByRole("link", { name: "Iniciar sesión", exact: true }),
      ).toBeVisible();
      assert.equal(
        await page.evaluate(
          () =>
            localStorage.getItem("usuarioActivo") ||
            sessionStorage.getItem("usuarioActivo"),
        ),
        null,
      );
      await page.goBack();
      await page.waitForURL(base + "/inicio-sesion");
      await comprobarSinRecarga(page, errores);
    } finally {
      await context.close();
    }
  });
}

test("Perfil y administración protegen el acceso de visitantes y clientes", async () => {
  for (const ruta of [
    "/perfil",
    "/administrador",
    "/Administrador/index.html",
  ]) {
    const { context, page, errores } = await abrir(ruta);
    try {
      await page.waitForURL(base + "/inicio-sesion");
      await expect(page.locator("#form-inicio-sesion")).toBeVisible();
      assert.deepEqual(errores, []);
    } finally {
      await context.close();
    }
  }
  const { context, page, errores } = await abrir("/administrador", {
    usuario: { nombre: "Cliente", rol: "cliente" },
  });
  try {
    await page.waitForURL(base + "/");
    await expect(
      page.getByRole("link", { name: "Panel de administración" }),
    ).toHaveCount(0);
    assert.deepEqual(errores, []);
  } finally {
    await context.close();
  }
});

test("Abandonar login tras el éxito cancela su redirección sin perder la sesión", async () => {
  const { context, page, errores } = await abrir("/inicio-sesion");
  try {
    await page.locator("#inputEmail").fill("admin@pasteleria.test");
    await page.locator("#inputPassword").fill("AdminDemo123!");
    await page.locator("#form-inicio-sesion button[type=submit]").click();
    await expect(page.locator("#nombre-usuario-navbar")).toContainText(
      "Administrador",
    );
    await page
      .locator("mi-navbar")
      .getByRole("link", { name: "Contacto", exact: true })
      .click();
    await page.waitForURL(base + "/contacto");
    await page.waitForTimeout(1800);
    assert.equal(page.url(), base + "/contacto");
    await expect(page.locator("#nombre-usuario-navbar")).toContainText(
      "Administrador",
    );
    await comprobarSinRecarga(page, errores);
  } finally {
    await context.close();
  }
});

test("Registro, redirección y cierre de sesión desde perfil funcionan con el router", async () => {
  const { context, page, errores } = await abrir("/registro");
  try {
    await page.locator("#form-registro button[type=submit]").click();
    await expect(page.locator("#mensaje-registro")).toContainText(
      "El nombre es obligatorio.",
    );
    await expect(page.locator("#mensaje-registro")).toContainText(
      "Debes seleccionar una región.",
    );
    assert.equal(
      await page.evaluate(() => localStorage.getItem("usuariosRegistrados")),
      null,
    );
    await completarRegistro(page);
    await page.locator("#form-registro button[type=submit]").click();
    await page.waitForURL(base + "/inicio-sesion");
    await page.locator("#inputEmail").fill("ana@example.test");
    await page.locator("#inputPassword").fill("Prueba123!");
    await page.locator("#form-inicio-sesion button[type=submit]").click();
    await page.waitForURL(base + "/perfil");
    await expect(page.locator("#perfil-nombre")).toHaveText("Ana Prueba");
    await page.locator("#btn-cerrar-sesion").click();
    await page.waitForURL(base + "/inicio-sesion");
    await comprobarSinRecarga(page, errores);
  } finally {
    await context.close();
  }
});

test("Registro conserva campos ante correo duplicado y cancela la redirección al salir", async () => {
  const { context, page, errores } = await abrir("/registro");
  try {
    await page.evaluate(() =>
      localStorage.setItem(
        "usuariosRegistrados",
        JSON.stringify([{ nombre: "Ana", email: "ana@example.test" }]),
      ),
    );
    await completarRegistro(page);
    await page.locator("#form-registro button[type=submit]").click();
    await expect(page.locator("#mensaje-registro")).toHaveText(
      "Ya existe una cuenta asociada a ese correo.",
    );
    await expect(page.locator("#inputEmail")).toBeFocused();
    await expect(page.locator("#nombre")).toHaveValue("Ana");
    assert.equal(
      await page.evaluate(
        () => JSON.parse(localStorage.getItem("usuariosRegistrados")).length,
      ),
      1,
    );
    await page.locator("#inputEmail").fill("nueva@example.test");
    await page.locator("#form-registro button[type=submit]").click();
    await expect(page.locator("#mensaje-registro")).toContainText(
      "Registro realizado correctamente",
    );
    await expect(page.locator("#nombre")).toHaveValue("");
    await page
      .locator("mi-navbar")
      .getByRole("link", { name: "Contacto", exact: true })
      .click();
    await page.waitForURL(base + "/contacto");
    await expect(page.locator("#form-contacto")).toBeVisible();
    await page.waitForTimeout(2800);
    assert.equal(page.url(), base + "/contacto");
    await page
      .locator("mi-navbar")
      .getByRole("link", { name: "Registrarse", exact: true })
      .click();
    await page.waitForURL(base + "/registro");
    await expect(page.locator("#mensaje-registro")).toBeHidden();
    await expect(page.locator("#inputEmail")).toHaveValue("");
    assert.equal(
      await page.evaluate(
        () => JSON.parse(localStorage.getItem("usuariosRegistrados")).length,
      ),
      2,
    );
    await comprobarSinRecarga(page, errores);
  } finally {
    await context.close();
  }
});

test("Contacto y creación administrativa siguen funcionando durante la navegación", async () => {
  const { context, page, errores } = await abrir("/contacto", {
    usuario: { nombre: "Admin", apellido: "Prueba", rol: "admin" },
  });
  try {
    await expect(page.locator("#mensaje-contacto")).toBeHidden();
    await page.locator("#correo-contacto").fill("CLIENTE@example.test");
    await page.locator("#consulta-contacto").fill("   ");
    await page.locator("#form-contacto button[type=submit]").click();
    await expect(page.locator("#mensaje-contacto")).toHaveText(
      "Debes completar todos los campos.",
    );
    await expect(page.locator("#correo-contacto")).toHaveValue(
      "CLIENTE@example.test",
    );
    assert.equal(
      await page.evaluate(() => localStorage.getItem("consultasContacto")),
      null,
    );
    await page
      .locator("#consulta-contacto")
      .fill("Consulta con navegación React");
    await page.locator("#form-contacto button[type=submit]").click();
    await expect(page.locator("#mensaje-contacto")).toContainText(
      "correctamente",
    );
    await expect(page.locator("#correo-contacto")).toHaveValue("");
    await expect(page.locator("#consulta-contacto")).toHaveValue("");
    const consultas = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("consultasContacto")),
    );
    assert.equal(consultas.length, 1);
    assert.equal(consultas[0].correo, "cliente@example.test");
    assert.equal(consultas[0].mensaje, "Consulta con navegación React");
    assert.equal(consultas[0].estado, "pendiente");
    await page.locator("#nombre-usuario-navbar").click();
    await page.getByRole("link", { name: "Panel de administración" }).click();
    await page.locator("#btn-ver-consultas").click();
    await expect(page.locator("#tabla-consultas")).toContainText(
      "Consulta con navegación React",
    );
    await page
      .getByLabel("Cambiar estado de la consulta de cliente@example.test")
      .selectOption("resuelta");
    await page.locator("#btn-ver-productos").click();
    for (const [nombre, valor] of Object.entries({
      titulo: "Producto React",
      descripcion: "Creado sin recargar",
      imagen: "../Panaderia/img/pan.JPG",
      precio: "4500",
    })) {
      await page.locator("#producto-" + nombre).fill(valor);
    }
    await page.locator("#producto-categoria").selectOption("panaderia");
    await page
      .getByRole("button", { name: "Guardar producto", exact: true })
      .click();
    await expect(page.getByRole("status")).toContainText(
      "Producto creado correctamente",
    );
    await page
      .locator("#seccion-productos")
      .getByRole("link", { name: "Panadería", exact: true })
      .click();
    await page.waitForURL(base + "/panaderia");
    const tarjeta = page
      .locator("#productos article")
      .filter({ hasText: "Producto React" });
    await tarjeta.getByRole("button", { name: "Ver", exact: true }).click();
    await expect(page.locator("#detalle-titulo")).toHaveText("Producto React");
    await page
      .locator("mi-navbar")
      .getByRole("link", { name: "Contacto", exact: true })
      .click();
    await page.waitForURL(base + "/contacto");
    await expect(page).toHaveTitle(paginas.Contacto.title);
    await expect(page.locator("#mensaje-contacto")).toBeHidden();
    await expect(page.locator("#correo-contacto")).toHaveValue("");
    await expect(page.locator("#consulta-contacto")).toHaveValue("");
    assert.equal(
      await page.evaluate(
        () => JSON.parse(localStorage.getItem("consultasContacto"))[0].estado,
      ),
      "resuelta",
    );
    await comprobarSinRecarga(page, errores);
  } finally {
    await context.close();
  }
});

test("Menú móvil, dropdown y footer funcionan después de cambiar de pantalla", async () => {
  const { context, page, errores } = await abrir("/", { ancho: 390 });
  try {
    for (const [nombre, ruta] of [
      ["Panadería", "/panaderia"],
      ["Pastelería", "/pasteleria"],
    ]) {
      await page.locator(".navbar-toggler").click();
      await expect(page.locator("#menu")).toHaveClass(/show/);
      await page
        .locator("mi-navbar")
        .getByRole("link", { name: "Productos", exact: true })
        .click();
      await page
        .locator("mi-navbar")
        .getByRole("link", { name: nombre, exact: true })
        .click();
      await page.waitForURL(base + ruta);
      await expect(page.locator("#menu")).not.toHaveClass(/show/);
    }
    await page
      .locator("mi-footer")
      .getByRole("link", { name: "Contacto" })
      .click();
    await page.waitForURL(base + "/contacto");
    await expect(page.locator("#form-contacto")).toBeVisible();
    await page.locator("mi-footer").scrollIntoViewIfNeeded();
    await expect(page.locator("mi-footer")).toBeVisible();
    await comprobarSinRecarga(page, errores);
  } finally {
    await context.close();
  }
});
