// Cliente común para hablar con el backend (Spring Boot).
export const URL_API =
  import.meta.env?.VITE_URL_API || "http://localhost:8080/api";

const CLAVE_SESION = "usuarioActivo";

// La escucha ContextoTienda para cerrar la sesión en pantalla.
export const EVENTO_SESION_EXPIRADA = "sesion-expirada";
// La escucha ContextoTienda para leer el usuario con el token nuevo.
export const EVENTO_SESION_RENOVADA = "sesion-renovada";

// Si al token le quedan menos de 30 minutos, se pide uno nuevo.
const MARGEN_RENOVACION = 30 * 60;

// El token se guarda junto al usuario activo al iniciar sesión, en
// sessionStorage o en localStorage ("Recordar cuenta").
function leerSesion() {
  for (const almacen of [sessionStorage, localStorage]) {
    const texto = almacen.getItem(CLAVE_SESION);
    if (!texto) continue;
    try {
      return { datos: JSON.parse(texto), almacen };
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Segundos que le quedan al token según su dato "exp" (0 si venció o no se puede leer).
 * Solo se lee la fecha para decidir cuándo renovar: la firma la verifica el backend.
 */
export function segundosRestantes(token) {
  try {
    const parte = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const { exp } = JSON.parse(atob(parte));
    return Math.max(0, exp - Math.floor(Date.now() / 1000));
  } catch {
    return 0;
  }
}

function expirarSesion() {
  sessionStorage.removeItem(CLAVE_SESION);
  localStorage.removeItem(CLAVE_SESION);
  window.dispatchEvent(new Event(EVENTO_SESION_EXPIRADA));
}

// Una sola renovación a la vez, aunque varias peticiones la pidan juntas.
let renovacionEnCurso = null;

/**
 * Devuelve un token vigente: el actual o uno renovado si está por vencer.
 * Si el token ya venció o el backend rechaza la renovación, cierra la sesión.
 */
export function renovarSiHaceFalta() {
  const sesion = leerSesion();
  const token = sesion?.datos?.token;
  if (!token) return Promise.resolve(null);
  const restante = segundosRestantes(token);
  if (restante === 0) {
    expirarSesion();
    return Promise.resolve(null);
  }
  if (restante > MARGEN_RENOVACION) return Promise.resolve(token);
  renovacionEnCurso ??= renovar(sesion).finally(() => {
    renovacionEnCurso = null;
  });
  return renovacionEnCurso;
}

async function renovar({ datos, almacen }) {
  try {
    const respuesta = await enviar("/auth/renovar", { metodo: "POST" }, datos.token);
    // Se guarda en el mismo almacenamiento; el rol se actualiza por si cambió.
    const actualizado = {
      ...datos,
      rol: respuesta.usuario?.rol || datos.rol,
      token: respuesta.token,
    };
    almacen.setItem(CLAVE_SESION, JSON.stringify(actualizado));
    window.dispatchEvent(new Event(EVENTO_SESION_RENOVADA));
    return respuesta.token;
  } catch (error) {
    if (error.estado === 401) {
      expirarSesion();
      return null;
    }
    // Sin conexión u otro error: se sigue usando el token actual mientras dure.
    return datos.token;
  }
}

const mensajesPorEstado = {
  400: "Datos inválidos.",
  401: "Tu sesión expiró o no es válida. Inicia sesión nuevamente.",
  403: "No tienes permiso para realizar esta acción.",
  404: "No se encontró lo solicitado.",
  409: "Los datos ya existen.",
};

/**
 * Hace una petición a la API. Envía el token si hay sesión (renovándolo si está
 * por vencer). Si el servidor responde con error, lanza un Error con el mensaje
 * del backend (o uno genérico) y la propiedad `estado` con el código HTTP.
 */
export async function pedirApi(ruta, opciones = {}) {
  const token = await renovarSiHaceFalta();
  try {
    return await enviar(ruta, opciones, token);
  } catch (error) {
    // Spring rechaza un token inválido incluso en rutas públicas: se cierra la
    // sesión guardada, se avisa a la app y se reintenta una vez sin token.
    if (error.estado !== 401 || !token) throw error;
    expirarSesion();
    return enviar(ruta, opciones, null);
  }
}

async function enviar(ruta, { metodo = "GET", cuerpo } = {}, token) {
  const cabeceras = { "Content-Type": "application/json" };
  if (token) cabeceras.Authorization = "Bearer " + token;

  let respuesta;
  try {
    respuesta = await fetch(URL_API + ruta, {
      method: metodo,
      headers: cabeceras,
      body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo),
    });
  } catch {
    throw new Error("No se pudo conectar con el servidor.");
  }

  if (!respuesta.ok) {
    let mensaje;
    try {
      mensaje = (await respuesta.json()).mensaje;
    } catch {
      // Respuesta sin cuerpo JSON (por ejemplo 401 o 403 de seguridad).
    }
    const error = new Error(
      mensaje ||
        mensajesPorEstado[respuesta.status] ||
        "Error del servidor. Intenta de nuevo.",
    );
    error.estado = respuesta.status;
    throw error;
  }
  // DELETE responde 204 sin contenido.
  return respuesta.status === 204 ? null : respuesta.json();
}
