import { usePageBindings } from "../hooks/usePageBindings.jsx";
import Inicio from "../pages/inicio/inicio.jsx";
import Pasteleria from "../pages/pasteleria/pasteleria.jsx";
import Panaderia from "../pages/panaderia/panaderia.jsx";
import Salados from "../pages/salados/salados.jsx";
import SinAzucar from "../pages/sinAzucar/sinAzucar.jsx";
import DetalleProducto from "../pages/detalleProducto/detalleProducto.jsx";
import Carrito from "../pages/carrito/carrito.jsx";
import RegistroUsuario from "../pages/registroUsuario/registroUsuario.jsx";
import InicioSesion from "../pages/inicioSesion/inicioSesion.jsx";
import PerfilUsuario from "../pages/perfilUsuario/perfilUsuario.jsx";
import Contacto from "../pages/contacto/contacto.jsx";
import SobreNosotros from "../pages/sobreNosotros/sobreNosotros.jsx";
import Administrador from "../pages/administrador/administrador.jsx";

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
