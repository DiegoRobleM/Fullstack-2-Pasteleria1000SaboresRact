import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./styles/global.css";
import "./styles/botones.css";
import "./styles/formularios.css";
import { RouterProvider } from "react-router-dom";
import { routes } from "./routes.jsx";
import { ProveedorTienda } from "./context/ContextoTienda.jsx";

createRoot(document.getElementById("root")).render(
  <ProveedorTienda>
    <RouterProvider router={routes} />
  </ProveedorTienda>,
);
