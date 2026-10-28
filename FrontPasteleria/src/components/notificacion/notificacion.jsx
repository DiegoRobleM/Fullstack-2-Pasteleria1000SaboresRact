import { combinarClases } from "../../utils/combinarClases.js";
import estilos from "./notificacion.module.css";

export default function Notificacion({
  className = estilos.oculta,
  role = "status",
  children,
  ...atributos
}) {
  return (
    <div
      {...atributos}
      role={role}
      className={combinarClases(estilos.notificacion, className)}
    >
      {children}
    </div>
  );
}
