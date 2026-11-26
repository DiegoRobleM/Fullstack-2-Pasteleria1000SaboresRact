// Cliente común para hablar con el backend (Spring Boot).
export const URL_API =
  import.meta.env?.VITE_URL_API || "http://localhost:8080/api";

const CLAVE_SESION = "usuarioActivo";

// El token se guarda junto al usuario activo al iniciar sesión.
function leerToken() {
  const texto =
    sessionStorage.getItem(CLAVE_SESION) || localStorage.getItem(CLAVE_SESION);
  try {
    return texto ? JSON.parse(texto).token : null;
  } catch {
    return null;
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
 * Hace una petición a la API. Envía el token si hay sesión.
 * Si el servidor responde con error, lanza un Error con el mensaje del backend
 * (o uno genérico) y la propiedad `estado` con el código HTTP.
 */
export async function pedirApi(ruta, opciones = {}) {
  const token = leerToken();
  try {
    return await enviar(ruta, opciones, token);
  } catch (error) {
    // Spring rechaza un token vencido incluso en rutas públicas: se cierra la
    // sesión guardada, se avisa a la app y se reintenta una vez sin token.
    if (error.estado !== 401 || !token) throw error;
    sessionStorage.removeItem(CLAVE_SESION);
    localStorage.removeItem(CLAVE_SESION);
    window.dispatchEvent(new Event(EVENTO_SESION_EXPIRADA));
    return enviar(ruta, opciones, null);
  }
}

// La escucha ContextoTienda para cerrar la sesión en pantalla.
export const EVENTO_SESION_EXPIRADA = "sesion-expirada";

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
