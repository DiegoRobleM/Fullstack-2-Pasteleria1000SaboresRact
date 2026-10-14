import { Fragment, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useTienda } from "../context/ContextoTienda.jsx";
export default function App({ nombre, children }) {
  const { usuario } = useTienda();
  const ubicacion = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [ubicacion.key]);
  if ((nombre === "PerfilUsuario" || nombre === "Administrador") && !usuario)
    return <Navigate to="/inicio-sesion" replace />;
  if (nombre === "Administrador" && usuario.rol !== "admin")
    return <Navigate to="/" replace />;
  return <Fragment key={ubicacion.key}>{children}</Fragment>;
}
