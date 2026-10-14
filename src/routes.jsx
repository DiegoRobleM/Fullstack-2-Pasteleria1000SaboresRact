import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./app/App.jsx";
import Inicio from "./pages/inicio/inicio.jsx";
import Pasteleria from "./pages/pasteleria/pasteleria.jsx";
import Panaderia from "./pages/panaderia/panaderia.jsx";
import Salados from "./pages/salados/salados.jsx";
import SinAzucar from "./pages/sinAzucar/sinAzucar.jsx";
import DetalleProducto from "./pages/detalleProducto/detalleProducto.jsx";
import Carrito from "./pages/carrito/carrito.jsx";
import RegistroUsuario from "./pages/registroUsuario/registroUsuario.jsx";
import InicioSesion from "./pages/inicioSesion/inicioSesion.jsx";
import PerfilUsuario from "./pages/perfilUsuario/perfilUsuario.jsx";
import Contacto from "./pages/contacto/contacto.jsx";
import SobreNosotros from "./pages/sobreNosotros/sobreNosotros.jsx";
import Administrador from "./pages/administrador/administrador.jsx";

import Checkout from "./pages/checkout/checkout.jsx";
import Compra from "./pages/compra/compra.jsx";
import CompraFallida from "./pages/compraFallida/compraFallida.jsx";
import Categorias from "./pages/categorias/categorias.jsx";
import Ofertas from "./pages/ofertas/ofertas.jsx";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <App nombre="Inicio">
        <Inicio />
      </App>
    ),
  },
  {
    path: "/pasteleria",
    element: (
      <App nombre="Pasteleria">
        <Pasteleria />
      </App>
    ),
  },
  {
    path: "/panaderia",
    element: (
      <App nombre="Panaderia">
        <Panaderia />
      </App>
    ),
  },
  {
    path: "/salados",
    element: (
      <App nombre="Salados">
        <Salados />
      </App>
    ),
  },
  {
    path: "/sin-azucar",
    element: (
      <App nombre="SinAzucar">
        <SinAzucar />
      </App>
    ),
  },
  {
    path: "/producto/:idProducto",
    element: (
      <App nombre="DetalleProducto">
        <DetalleProducto />
      </App>
    ),
  },
  {
    path: "/carrito",
    element: (
      <App nombre="Carrito">
        <Carrito />
      </App>
    ),
  },
  {
    path: "/registro",
    element: (
      <App nombre="RegistroUsuario">
        <RegistroUsuario />
      </App>
    ),
  },
  {
    path: "/inicio-sesion",
    element: (
      <App nombre="InicioSesion">
        <InicioSesion />
      </App>
    ),
  },
  {
    path: "/perfil",
    element: (
      <App nombre="PerfilUsuario">
        <PerfilUsuario />
      </App>
    ),
  },
  {
    path: "/contacto",
    element: (
      <App nombre="Contacto">
        <Contacto />
      </App>
    ),
  },
  {
    path: "/sobre-nosotros",
    element: (
      <App nombre="SobreNosotros">
        <SobreNosotros />
      </App>
    ),
  },
  {
    path: "/administrador",
    element: (
      <App nombre="Administrador">
        <Administrador />
      </App>
    ),
  },
  {
    path: "/checkout",
    element: (
      <App nombre="Checkout">
        <Checkout />
      </App>
    ),
  },
  {
    path: "/compra/:idPedido",
    element: (
      <App nombre="Compra">
        <Compra />
      </App>
    ),
  },
  {
    path: "/compra-fallida",
    element: (
      <App nombre="CompraFallida">
        <CompraFallida />
      </App>
    ),
  },
  {
    path: "/categorias",
    element: (
      <App nombre="Categorias">
        <Categorias />
      </App>
    ),
  },
  {
    path: "/ofertas",
    element: (
      <App nombre="Ofertas">
        <Ofertas />
      </App>
    ),
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);
