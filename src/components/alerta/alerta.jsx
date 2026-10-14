import { combinarClases } from "../../utils/combinarClases.js";

export default function Alerta({
  tipo = "info",
  visible = true,
  como: Elemento = "div",
  className,
  role = tipo === "danger" || tipo === "warning" ? "alert" : "status",
  children,
  ...atributos
}) {
  return (
    <Elemento
      {...atributos}
      role={role}
      className={combinarClases(
        "alert",
        "alert-" + tipo,
        !visible && "d-none",
        className,
      )}
    >
      {children}
    </Elemento>
  );
}
