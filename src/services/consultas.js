import { leerArreglo } from "../utils/almacenamiento.js";

export function registrarConsulta(formulario) {
  const correo = String(formulario.get("correo") ?? "")
    .trim()
    .toLowerCase();
  const mensaje = String(formulario.get("mensaje") ?? "").trim();
  const nombre = String(formulario.get("nombre") ?? "").trim();
  if (!correo || !mensaje)
    return { texto: "Debes completar todos los campos.", tipo: "warning" };
  const consultas = leerArreglo("consultasContacto");
  consultas.push({
    id: `consulta-${Date.now()}`,
    correo,
    nombre,
    mensaje,
    fecha: new Date().toISOString(),
    estado: "pendiente",
  });
  localStorage.setItem("consultasContacto", JSON.stringify(consultas));
  return { texto: "Tu consulta fue enviada correctamente.", tipo: "success" };
}

export function obtenerConsultas() {
  return leerArreglo("consultasContacto").sort(
    (a, b) => new Date(b.fecha) - new Date(a.fecha),
  );
}
export function cambiarEstadoConsulta(id, estado) {
  if (!["pendiente", "en revisión", "resuelta"].includes(estado))
    throw new Error("Estado de consulta inválido.");
  const consultas = obtenerConsultas();
  if (!consultas.some((consulta) => consulta.id === id))
    throw new Error("Consulta no encontrada.");
  const actualizadas = consultas.map((consulta) =>
    consulta.id === id ? { ...consulta, estado } : consulta,
  );
  localStorage.setItem("consultasContacto", JSON.stringify(actualizadas));
  return actualizadas;
}
