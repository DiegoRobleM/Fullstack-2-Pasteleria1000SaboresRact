export default function SessionMenu({ user, logout }) {
  const props = {
    "nombre-usuario-navbar": {},
    "btn-cerrar-sesion-navbar": { onClick: logout },
  };
  const content = {
    "nombre-usuario-navbar": user ? `Hola, ${user.nombre}` : "",
  };
  return user ? (
    <>
      {"\n    "}
      <li className="nav-item dropdown">
        {"\n      "}
        <a
          className="nav-link dropdown-toggle text-white"
          href="#"
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {"\n        "}
          <i></i>
          {"\n        "}
          <span id="nombre-usuario-navbar" {...props["nombre-usuario-navbar"]}>
            {content["nombre-usuario-navbar"] ?? <></>}
          </span>
          {"\n      "}
        </a>
        {"\n\n      "}
        <ul className="dropdown-menu">
          {"\n        "}
          <li>
            {"\n          "}
            <a className="dropdown-item" href="../PerfilUsuario/index.html">
              {"\n            Mi perfil\n          "}
            </a>
            {"\n        "}
          </li>
          {"\n        \n        "}
          {user.rol === "admin" && (
            <li>
              <a className="dropdown-item" href="../Administrador/index.html">
                Panel de administración
              </a>
            </li>
          )}
          {"\n\n        "}
          <li>
            {"\n          "}
            <button
              type="button"
              className="dropdown-item"
              id="btn-cerrar-sesion-navbar"
              {...props["btn-cerrar-sesion-navbar"]}
            >
              {content["btn-cerrar-sesion-navbar"] ?? (
                <>{"\n            Cerrar sesión\n          "}</>
              )}
            </button>
            {"\n        "}
          </li>
          {"\n      "}
        </ul>
        {"\n    "}
      </li>
      {"\n  "}
    </>
  ) : (
    <>
      {"\n    "}
      <li className="nav-item">
        {"\n      "}
        <a
          className="nav-link text-white"
          href="../InicioSesion/iniciosesion.html"
        >
          {"\n        Iniciar sesión\n      "}
        </a>
        {"\n    "}
      </li>
      {"\n\n    "}
      <li className="nav-item">
        {"\n      "}
        <a
          className="nav-link text-white"
          href="../RegistroUsuario/registro.html"
        >
          {"\n        Registrarse\n      "}
        </a>
        {"\n    "}
      </li>
      {"\n  "}
    </>
  );
}

