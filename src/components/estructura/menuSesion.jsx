import { Link } from "react-router-dom";
export default function MenuSesion({ usuario, cerrarSesion }) {
  return usuario ? (
    <li className="nav-item dropdown">
      <a
        className="nav-link dropdown-toggle text-white"
        href="#"
        role="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <span id="nombre-usuario-navbar">Hola, {usuario.nombre}</span>
      </a>
      <ul className="dropdown-menu">
        <li>
          <Link className="dropdown-item" to="/perfil">
            Mi perfil
          </Link>
        </li>
        {usuario.rol === "admin" && (
          <li>
            <Link className="dropdown-item" to="/administrador">
              Panel de administración
            </Link>
          </li>
        )}
        <li>
          <button
            type="button"
            className="dropdown-item"
            id="btn-cerrar-sesion-navbar"
            onClick={cerrarSesion}
          >
            Cerrar sesión
          </button>
        </li>
      </ul>
    </li>
  ) : (
    <>
      <li className="nav-item">
        <Link className="nav-link text-white" to="/inicio-sesion">
          Iniciar sesión
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link text-white" to="/registro">
          Registrarse
        </Link>
      </li>
    </>
  );
}
