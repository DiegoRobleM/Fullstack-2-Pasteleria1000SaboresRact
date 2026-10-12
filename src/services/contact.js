import { readArray } from "../utils/storage.js";

export function contact(form) {
  const correo = form.get("correo").trim().toLowerCase();
  const mensaje = form.get("mensaje").trim();
  if (!correo || !mensaje)
    return { text: "Debes completar todos los campos.", type: "warning" };
  const queries = readArray("consultasContacto");
  queries.push({
    id: `consulta-${Date.now()}`,
    correo,
    mensaje,
    fecha: new Date().toISOString(),
    estado: "pendiente",
  });
  localStorage.setItem("consultasContacto", JSON.stringify(queries));
  return { text: "Tu consulta fue enviada correctamente.", type: "success" };
}
