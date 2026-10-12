import { usePageBindings } from "../hooks/usePageBindings.jsx";
import Inicio from "../pages/Inicio.jsx";
import Pasteleria from "../pages/Pasteleria.jsx";
import Panaderia from "../pages/Panaderia.jsx";
import Salados from "../pages/Salados.jsx";
import SinAzucar from "../pages/SinAzucar.jsx";
import DetalleProducto from "../pages/DetalleProducto.jsx";
import Carrito from "../pages/Carrito.jsx";
import RegistroUsuario from "../pages/RegistroUsuario.jsx";
import InicioSesion from "../pages/InicioSesion.jsx";
import PerfilUsuario from "../pages/PerfilUsuario.jsx";
import Contacto from "../pages/Contacto.jsx";
import SobreNosotros from "../pages/SobreNosotros.jsx";
import Administrador from "../pages/Administrador.jsx";

const views = {
  Inicio,
  Pasteleria,
  Panaderia,
  Salados,
  SinAzucar,
  DetalleProducto,
  Carrito,
  RegistroUsuario,
  InicioSesion,
  PerfilUsuario,
  Contacto,
  SobreNosotros,
  Administrador,
};

export default function App({ page }) {
  const bindings = usePageBindings(page.name);
  const View = views[page.name];
  return <View {...bindings} />;
}
