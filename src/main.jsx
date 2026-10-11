import { createRoot } from "react-dom/client";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { StoreProvider } from "./store.jsx";
import { pages } from "./pages.js";
import { useOriginalBindings } from "./bindings.jsx";
import Inicio from "./pages/Inicio.jsx";
import Pasteleria from "./pages/Pasteleria.jsx";
import Panaderia from "./pages/Panaderia.jsx";
import Salados from "./pages/Salados.jsx";
import SinAzucar from "./pages/SinAzucar.jsx";
import DetalleProducto from "./pages/DetalleProducto.jsx";
import Carrito from "./pages/Carrito.jsx";
import RegistroUsuario from "./pages/RegistroUsuario.jsx";
import InicioSesion from "./pages/InicioSesion.jsx";
import PerfilUsuario from "./pages/PerfilUsuario.jsx";
import Contacto from "./pages/Contacto.jsx";
import SobreNosotros from "./pages/SobreNosotros.jsx";
import Administrador from "./pages/Administrador.jsx";

// Se conservan las URL .html y la navegación por páginas del sitio original.
if (
  window.location.pathname === "/" ||
  window.location.pathname === "/index.html"
) {
  window.history.replaceState(null, "", "/Inicio/index.html");
}
const page = pages[window.location.pathname];
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
if (!page) {
  window.location.replace("/Inicio/index.html");
} else {
  document.title = page.title;
  document.body.setAttribute("style", page.bodyStyle);
  for (const href of page.styles) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  }
  function App() {
    const bindings = useOriginalBindings(page.name);
    const View = views[page.name];
    return <View {...bindings} />;
  }
  // Montar sobre body mantiene body > main y los custom tags del CSS original.
  createRoot(document.body).render(
    <StoreProvider>
      <App />
    </StoreProvider>,
  );
}
