import { Link, useNavigate } from "react-router-dom";
import estilos from "./estructura.module.css";
import { useTienda } from "../../context/ContextoTienda.jsx";
import MenuSesion from "./menuSesion.jsx";
import { categorias } from "../../data/categorias.js";
export function BarraNavegacion() {
  const { usuario, cerrarSesion, carrito } = useTienda();
  const navegar = useNavigate();
  const cantidad = carrito.reduce(
    (total, producto) => total + producto.cantidad,
    0,
  );
  function salir() {
    cerrarSesion();
    navegar("/inicio-sesion", { replace: true });
  }
  return (
    <mi-navbar>
      <header>
        <nav
          className={
            "navbar navbar-expand-lg navbar-dark " + estilos.barraNavegacion
          }
        >
          <div className="container">
            <Link className="navbar-brand fw-bold text-white" to="/">
              Pastelería 1000 Sabores
            </Link>
            <button
              className="navbar-toggler border-white"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#menu"
              aria-controls="menu"
              aria-expanded="false"
              aria-label="Mostrar u ocultar menú de navegación"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="menu">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/">
                    Inicio
                  </Link>
                </li>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle text-white"
                    href="#"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Productos
                  </a>
                  <ul className="dropdown-menu">
                    {categorias.map((categoria) => (
                      <li key={categoria.id}>
                        <Link className="dropdown-item" to={"/" + categoria.id}>
                          {categoria.nombre === "Productos salados"
                            ? "Salados"
                            : categoria.nombre === "Productos sin azúcar"
                              ? "Sin azúcar"
                              : categoria.nombre}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/categorias">
                        Todas las categorías
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/ofertas">
                        Ofertas
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/contacto">
                    Contacto
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/sobre-nosotros">
                    Sobre nosotros
                  </Link>
                </li>
              </ul>
              <div className="d-flex align-items-center ms-auto gap-3">
                <ul className="navbar-nav flex-row align-items-center gap-2">
                  <MenuSesion usuario={usuario} cerrarSesion={salir} />
                </ul>
                <Link
                  id="enlace-carrito-navbar"
                  to="/carrito"
                  className="btn btn-outline-light position-relative"
                  title="Carrito de compras"
                  aria-label={
                    cantidad
                      ? "Carrito de compras: " + cantidad + " unidades"
                      : "Carrito de compras vacío"
                  }
                >
                  <i className="bi bi-cart3"></i>
                  <span
                    id="contador-carrito"
                    className={
                      "position-absolute top-0 start-100 translate-middle badge rounded-pill text-bg-danger" +
                      (cantidad ? "" : " d-none")
                    }
                    aria-hidden="true"
                  >
                    {cantidad > 99 ? "+99" : cantidad}
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </mi-navbar>
  );
}
