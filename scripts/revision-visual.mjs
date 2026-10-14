import { iniciarSitio } from "../tests/helpers/sitio.mjs";
import { productosIniciales } from "../src/data/productos.js";
import { mkdir, writeFile } from "node:fs/promises";
const sitio = await iniciarSitio();
const rutas = [
  "/",
  "/sobre-nosotros",
  "/pasteleria",
  "/producto/pasteleria-1",
  "/carrito",
  "/checkout",
  "/compra/pedido-visual",
  "/perfil",
  "/ofertas",
  "/administrador",
];
const productos = productosIniciales.map((producto, indice) => ({
  ...producto,
  descuento: indice === 0 ? 20 : 0,
}));
const usuario = {
  nombre: "Ana",
  apellido: "Prueba",
  email: "ana@example.test",
  rol: "admin",
  direccion: "Calle 123",
  comuna: "Santiago",
  region: "metropolitana",
};
const pedido = {
  id: "pedido-visual",
  correoCliente: usuario.email,
  fecha: "2026-10-13T18:00:00Z",
  estado: "confirmado",
  cliente: usuario,
  productos: [{ ...productos[0], cantidad: 2, precioFinal: 20000 }],
  entrega: { nombre: "Despacho a domicilio", costo: 3000 },
  subtotal: 40000,
  total: 43000,
};
await mkdir("test-results/visual", { recursive: true });
const resultados = [];
try {
  for (const ancho of [1440, 390])
    for (const ruta of rutas) {
      const contexto = await sitio.browser.newContext({
        viewport: { width: ancho, height: 1000 },
        locale: "es-CL",
      });
      await contexto.addInitScript(
        ({ usuario, productos, pedido }) => {
          sessionStorage.setItem("usuarioActivo", JSON.stringify(usuario));
          localStorage.setItem(
            "productosPasteleria",
            JSON.stringify(productos),
          );
          localStorage.setItem(
            "carrito",
            JSON.stringify([{ ...productos[0], cantidad: 2 }]),
          );
          localStorage.setItem("pedidosPasteleria", JSON.stringify([pedido]));
        },
        { usuario, productos, pedido },
      );
      const pagina = await contexto.newPage();
      const errores = [];
      pagina.on("pageerror", (error) => errores.push(error.message));
      await pagina.goto(sitio.base + ruta, { waitUntil: "networkidle" });
      if (ruta === "/administrador")
        await pagina.locator("#btn-ver-productos").click();
      await pagina.evaluate(() => document.fonts.ready);
      const anchoReal = await pagina.evaluate(
        () => document.documentElement.scrollWidth,
      );
      const etiqueta =
        ruta === "/" ? "inicio" : ruta.replaceAll("/", "-").slice(1);
      await pagina.screenshot({
        path: "test-results/visual/" + etiqueta + "-" + ancho + ".png",
        fullPage: true,
      });
      resultados.push({ ruta, ancho, anchoReal, errores });
      await contexto.close();
    }
} finally {
  await sitio.cerrar();
}
await writeFile(
  "test-results/visual/resultados.json",
  JSON.stringify(resultados, null, 2),
);
const problemas = resultados.filter(
  (resultado) =>
    resultado.anchoReal > resultado.ancho + 1 || resultado.errores.length,
);
console.log(JSON.stringify({ revisadas: resultados.length, problemas }));
process.exitCode = problemas.length ? 1 : 0;
