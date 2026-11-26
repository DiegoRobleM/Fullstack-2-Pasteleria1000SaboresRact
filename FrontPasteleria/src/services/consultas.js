import { pedirApi } from "./api.js";

export const estadosConsulta = ["pendiente", "en revisión", "resuelta"];

// Cualquiera puede enviar una consulta. Devuelve el mensaje para mostrar.
export async function registrarConsulta(formulario) {
  const correo = String(formulario.get("correo") ?? "")
    .trim()
    .toLowerCase();
  const mensaje = String(formulario.get("mensaje") ?? "").trim();
  const nombre = String(formulario.get("nombre") ?? "").trim();
  if (!correo || !mensaje)
    return { texto: "Debes completar todos los campos.", tipo: "warning" };
  try {
    await pedirApi("/consultas", {
      metodo: "POST",
      cuerpo: { correo, nombre, mensaje },
    });
  } catch (error) {
    return { texto: error.message, tipo: "danger" };
  }
  return { texto: "Tu consulta fue enviada correctamente.", tipo: "success" };
}

// Solo administradores. El backend las entrega de la más reciente a la más antigua.
export function obtenerConsultas() {
  return pedirApi("/consultas");
}

// Solo administradores. Devuelve la consulta actualizada.
export function cambiarEstadoConsulta(id, estado) {
  if (!estadosConsulta.includes(estado))
    return Promise.reject(new Error("Estado de consulta inválido."));
  return pedirApi(`/consultas/${id}/estado`, {
    metodo: "PATCH",
    cuerpo: { estado },
  });
}
