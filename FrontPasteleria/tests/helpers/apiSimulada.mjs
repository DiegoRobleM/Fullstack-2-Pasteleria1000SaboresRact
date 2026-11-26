// Backend simulado para las pruebas de navegador.
// Intercepta las peticiones a la API con Playwright (context.route) y responde
// como el backend de Spring Boot: mismos endpoints, IDs numéricos, token, roles
// y códigos de error. Así las pruebas no necesitan la base de datos ni el back.
import { productosIniciales } from "../../src/data/productos.js";

export const URL_API = "http://localhost:8080/api";

export const ADMIN = {
  nombre: "Administrador",
  apellido: "Demo",
  email: "admin@pasteleria.test",
  password: "AdminDemo123!",
  rol: "admin",
  direccion: "Dirección ficticia",
  tipoPropiedad: "Local",
  region: "metropolitana",
  comuna: "santiago",
};

const ENTREGAS = {
  domicilio: { nombre: "Despacho a domicilio", costo: 3000 },
  retiro: { nombre: "Retiro en tienda", costo: 0 },
};
const ESTADOS_CONSULTA = ["pendiente", "en revisión", "resuelta"];

/** ID numérico que tendrá un producto del catálogo inicial (por ejemplo "pasteleria-1" → 1). */
export function idDe(idCatalogo) {
  const indice = productosIniciales.findIndex((p) => p.id === idCatalogo);
  if (indice < 0) throw new Error("No existe en el catálogo: " + idCatalogo);
  return indice + 1;
}

const FIRMA = "firma-simulada";
const base64url = (objeto) =>
  Buffer.from(JSON.stringify(objeto)).toString("base64url");

/**
 * Token con forma de JWT (cabecera.datos.firma) que entiende la API simulada.
 * El front lee su "exp" para decidir cuándo renovarlo.
 * - segundos: validez desde ahora (negativo = ya vencido). Por defecto, 2 horas.
 */
export function tokenDe(email, { segundos = 2 * 60 * 60 } = {}) {
  const exp = Math.floor(Date.now() / 1000) + segundos;
  return [
    base64url({ alg: "HS256" }),
    base64url({ sub: email.toLowerCase(), exp }),
    FIRMA,
  ].join(".");
}

/** Datos de un token de la API simulada, o null si no tiene su forma o firma. */
function leerToken(token) {
  const [, datos, firma] = token.split(".");
  if (firma !== FIRMA) return null;
  try {
    return JSON.parse(Buffer.from(datos, "base64url").toString());
  } catch {
    return null;
  }
}

/** Usuario activo tal como lo guarda el front después del login. */
export function sesion(usuario, opcionesToken) {
  const { password, ...datos } = usuario;
  return {
    ...datos,
    rol: datos.rol || "cliente",
    token: tokenDe(usuario.email, opcionesToken),
  };
}

function precioFinal(precio, descuento) {
  const d = Math.min(100, Math.max(0, descuento));
  return Math.round(precio * (1 - d / 100));
}

/**
 * Crea una API simulada.
 * - productos: catálogo inicial (por defecto, el de src/data). Se les asignan IDs 1, 2, 3...
 * - usuarios: cuentas además del administrador (cada una con password, por defecto "Prueba123!").
 * El objeto `estado` se puede leer y modificar desde la prueba.
 */
export function crearApiSimulada({ productos, usuarios = [] } = {}) {
  let siguiente = 1;
  const nuevoId = () => siguiente++;
  const estado = {
    productos: (productos ?? productosIniciales).map((p) => {
      const { id, ...resto } = p;
      return { descuento: 0, ...resto, id: nuevoId() };
    }),
    usuarios: [ADMIN, ...usuarios].map((u) => ({
      password: "Prueba123!",
      rol: "cliente",
      ...u,
      email: u.email.toLowerCase(),
      id: nuevoId(),
    })),
    consultas: [],
    pedidos: [],
    renovaciones: 0,
  };

  const sinPassword = ({ password, ...u }) => u;

  // Igual que Spring: firma válida, sin vencer y de una cuenta que existe.
  function usuarioDelToken(request) {
    const cabecera = request.headers().authorization || "";
    if (!cabecera.startsWith("Bearer ")) return null;
    const datos = leerToken(cabecera.slice(7));
    if (!datos || datos.exp <= Date.now() / 1000) return "invalido";
    return estado.usuarios.find((u) => u.email === datos.sub) || "invalido";
  }

  async function manejar(route) {
    const request = route.request();
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
    };
    const responder = (status, cuerpo) =>
      route.fulfill({
        status,
        headers: { ...cors, "Content-Type": "application/json" },
        body: cuerpo === undefined ? "" : JSON.stringify(cuerpo),
      });
    const error = (status, mensaje) =>
      responder(status, mensaje ? { mensaje } : undefined);

    const metodo = request.method();
    if (metodo === "OPTIONS")
      return route.fulfill({ status: 204, headers: cors });

    const ruta = new URL(request.url()).pathname.replace(/^\/api/, "");
    const cuerpo = request.postData() ? JSON.parse(request.postData()) : {};
    const usuario = usuarioDelToken(request);
    // Igual que Spring: un token inválido o vencido da 401 incluso en rutas públicas.
    if (usuario === "invalido") return error(401);
    const esAdmin = usuario?.rol === "admin";
    const soloAdmin = () => (usuario ? error(403) : error(401));
    const segmentos = ruta.split("/").filter(Boolean);
    const id = Number(segmentos[1]);

    // ---------- Auth ----------
    if (metodo === "POST" && ruta === "/auth/login") {
      const encontrado = estado.usuarios.find(
        (u) =>
          u.email === String(cuerpo.email).trim().toLowerCase() &&
          u.password === cuerpo.password,
      );
      if (!encontrado)
        return error(401, "El correo o la contraseña son incorrectos.");
      return responder(200, {
        token: tokenDe(encontrado.email),
        usuario: sinPassword(encontrado),
      });
    }
    if (metodo === "POST" && ruta === "/auth/renovar") {
      if (!usuario) return error(401);
      estado.renovaciones++;
      return responder(200, {
        token: tokenDe(usuario.email),
        usuario: sinPassword(usuario),
      });
    }
    if (metodo === "POST" && ruta === "/auth/registro") {
      const email = String(cuerpo.email).trim().toLowerCase();
      if (estado.usuarios.some((u) => u.email === email))
        return error(409, "Ya existe una cuenta asociada a ese correo.");
      const nuevo = { ...cuerpo, email, rol: "cliente", id: nuevoId() };
      estado.usuarios.push(nuevo);
      return responder(201, sinPassword(nuevo));
    }

    // ---------- Usuarios (admin) ----------
    if (segmentos[0] === "usuarios") {
      if (!esAdmin) return soloAdmin();
      if (metodo === "GET" && segmentos.length === 1)
        return responder(200, estado.usuarios.map(sinPassword));
    }

    // ---------- Productos ----------
    if (segmentos[0] === "productos") {
      if (metodo === "GET" && segmentos.length === 1)
        return responder(200, estado.productos);
      if (metodo === "GET") {
        const producto = estado.productos.find((p) => p.id === id);
        return producto
          ? responder(200, producto)
          : error(404, "Producto no encontrado.");
      }
      if (!esAdmin) return soloAdmin();
      if (metodo === "POST") {
        const producto = { ...cuerpo, id: nuevoId() };
        estado.productos.push(producto);
        return responder(201, producto);
      }
      const indice = estado.productos.findIndex((p) => p.id === id);
      if (indice < 0) return error(404, "Producto no encontrado.");
      if (metodo === "PUT") {
        estado.productos[indice] = { ...cuerpo, id };
        return responder(200, estado.productos[indice]);
      }
      if (metodo === "DELETE") {
        estado.productos.splice(indice, 1);
        return responder(204);
      }
    }

    // ---------- Consultas ----------
    if (segmentos[0] === "consultas") {
      if (metodo === "POST" && segmentos.length === 1) {
        if (!String(cuerpo.correo ?? "").trim())
          return error(400, "El correo es obligatorio.");
        if (!String(cuerpo.mensaje ?? "").trim())
          return error(400, "El mensaje es obligatorio.");
        const consulta = {
          id: nuevoId(),
          nombre: String(cuerpo.nombre ?? "").trim(),
          correo: cuerpo.correo.trim().toLowerCase(),
          mensaje: cuerpo.mensaje.trim(),
          fecha: new Date().toISOString(),
          estado: "pendiente",
        };
        estado.consultas.push(consulta);
        return responder(201, consulta);
      }
      if (!esAdmin) return soloAdmin();
      if (metodo === "GET" && segmentos.length === 1)
        return responder(
          200,
          [...estado.consultas].sort((a, b) => b.fecha.localeCompare(a.fecha)),
        );
      const consulta = estado.consultas.find((c) => c.id === id);
      if (!consulta) return error(404, "Consulta no encontrada.");
      if (metodo === "PATCH" && segmentos[2] === "estado") {
        if (!ESTADOS_CONSULTA.includes(cuerpo.estado))
          return error(400, "Estado de consulta inválido.");
        consulta.estado = cuerpo.estado;
        return responder(200, consulta);
      }
    }

    // ---------- Pedidos ----------
    if (segmentos[0] === "pedidos") {
      if (metodo === "POST" && segmentos.length === 1) {
        const entrega = ENTREGAS[cuerpo.entrega];
        if (!entrega)
          return error(400, "Selecciona una opción de entrega válida.");
        const detalles = [];
        for (const item of cuerpo.productos || []) {
          const producto = estado.productos.find((p) => p.id === item.id);
          if (!producto)
            return error(400, "Hay productos no disponibles. Revisa tu carrito.");
          detalles.push({
            productoId: producto.id,
            titulo: producto.titulo,
            imagen: producto.imagen,
            categoria: producto.categoria,
            precio: producto.precio,
            descuento: producto.descuento,
            precioFinal: precioFinal(producto.precio, producto.descuento),
            cantidad: item.cantidad,
          });
        }
        if (!detalles.length)
          return error(400, "Agrega productos al carrito antes de comprar.");
        const subtotal = detalles.reduce(
          (total, d) => total + d.precioFinal * d.cantidad,
          0,
        );
        const email = cuerpo.email.trim().toLowerCase();
        const pedido = {
          id: nuevoId(),
          fecha: new Date().toISOString(),
          estado: "confirmado",
          correoCliente: usuario ? usuario.email : email,
          nombre: cuerpo.nombre,
          email,
          direccion: cuerpo.direccion,
          comuna: cuerpo.comuna,
          region: cuerpo.region,
          entrega: cuerpo.entrega,
          entregaNombre: entrega.nombre,
          costoEntrega: entrega.costo,
          productos: detalles,
          subtotal,
          total: subtotal + entrega.costo,
        };
        estado.pedidos.push(pedido);
        return responder(201, pedido);
      }
      const recientes = (lista) =>
        [...lista].sort((a, b) => b.fecha.localeCompare(a.fecha));
      if (metodo === "GET" && segmentos[1] === "mios") {
        if (!usuario) return error(401);
        return responder(
          200,
          recientes(estado.pedidos.filter((p) => p.correoCliente === usuario.email)),
        );
      }
      if (!esAdmin) return soloAdmin();
      if (metodo === "GET" && segmentos.length === 1)
        return responder(200, recientes(estado.pedidos));
    }

    return error(404, "Ruta no simulada: " + metodo + " " + ruta);
  }

  return {
    estado,
    /** Activa la API simulada en un contexto de Playwright. */
    instalar: (context) =>
      context.route((url) => url.href.startsWith(URL_API), manejar),
  };
}
