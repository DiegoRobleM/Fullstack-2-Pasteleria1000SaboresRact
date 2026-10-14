import { combinarClases } from "../../utils/combinarClases.js";
import estilos from "./notificacion.module.css";

export default function Notificacion({
  className = estilos.oculta,
  children,
  ...atributos
}) {
  return (
    <div
      {...atributos}
      className={combinarClases(estilos.notificacion, className)}
    >
      {children}
    </div>
  );
}
