import estilos from "./layout.module.css";
import { useStore } from "../../context/StoreContext.jsx";
import SessionMenu from "./SessionMenu.jsx";

export function Navbar() {
  const { user, logout, cart } = useStore();
  const quantity = cart.reduce(
    (total, product) => total + Number(product.cantidad || 0),
    0,
  );
  const props = {
    "enlace-carrito-navbar": {
      "aria-label":
        quantity > 0
          ? `Carrito de compras: ${quantity} unidades`
          : "Carrito de compras vacío",
    },
    "contador-carrito": {
      className:
        "position-absolute top-0 start-100 translate-middle badge rounded-pill text-bg-danger" +
        (quantity <= 0 ? " d-none" : ""),
    },
  };
  const content = { "contador-carrito": quantity > 99 ? "+99" : quantity };
  return (
    <mi-navbar>
      {"\n        "}
      <header>
        {"\n          "}
        <nav
          className={`navbar navbar-expand-lg navbar-dark ${estilos.barraNavegacion}`}
        >
          {"\n            "}
          <div className="container">
            {"\n              "}
            <a
              className="navbar-brand fw-bold text-white"
              href="../Inicio/index.html"
            >
              {"Pastelería 1000 Sabores"}
            </a>
            {"\n\n              "}
            <button
              className="navbar-toggler border-white"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#menu"
              aria-controls="menu"
              aria-expanded="false"
              aria-label="Mostrar u ocultar menú de navegación"
            >
              {"\n                "}
              <span className="navbar-toggler-icon"></span>
              {"\n              "}
            </button>
            {"\n\n              "}
            <div
              className="collapse navbar-collapse"
              id="menu"
              {...props["menu"]}
            >
              {content["menu"] ?? (
                <>
                  {"\n                "}
                  <ul className="navbar-nav me-auto">
                    {"\n                  "}
                    <li className="nav-item">
                      {"\n                    "}
                      <a
                        className="nav-link active text-white"
                        href="../Inicio/index.html"
                      >
                        {"Inicio"}
                      </a>
                      {"\n                  "}
                    </li>
                    {"\n\n                  "}
                    <li className="nav-item dropdown">
                      {"\n                    "}
                      <a
                        className="nav-link dropdown-toggle text-white"
                        href="#"
                        data-bs-toggle="dropdown"
                      >
                        {"Productos"}
                      </a>
                      {"\n\n                    "}
                      <ul className="dropdown-menu">
                        {"\n                      "}
                        <li>
                          <a
                            className="dropdown-item"
                            href="../Pasteleria/pasteleria.html"
                          >
                            {"Pastelería"}
                          </a>
                        </li>
                        {"\n                      "}
                        <li>
                          <a
                            className="dropdown-item"
                            href="../SinAzucar/sugar.html"
                          >
                            {"Sin azúcar"}
                          </a>
                        </li>
                        {"\n                      "}
                        <li>
                          <a
                            className="dropdown-item"
                            href="../Panaderia/index.html"
                          >
                            {"Panadería"}
                          </a>
                        </li>
                        {"\n                      "}
                        <li>
                          <a
                            className="dropdown-item"
                            href="../Salados/index.html"
                          >
                            {"Salados"}
                          </a>
                        </li>
                        {"\n                    "}
                      </ul>
                      {"\n                  "}
                    </li>
                    {"\n                  \n                  "}
                    <li className="nav-item">
                      {"\n                    "}
                      <a
                        className="nav-link text-white"
                        href="../Contacto/contacto.html"
                      >
                        {"Contacto "}
                      </a>
                      {"\n                  "}
                    </li>
                    {"\n\n                  "}
                    <li className="nav-item">
                      {"\n                    "}
                      <a
                        className="nav-link text-white"
                        href="../SobreNosotros/sobrenosotros.html"
                      >
                        {"Sobre nosotros "}
                      </a>
                      {"\n                  "}
                    </li>
                    {"\n \n                "}
                  </ul>
                  {"\n                \n\n                "}
                  <div className="d-flex align-items-center ms-auto gap-3">
                    {"\n\n                  "}
                    <ul className="navbar-nav flex-row align-items-center gap-2">
                      {"\n                    "}
                      <SessionMenu user={user} logout={logout} />
                      {"\n                  "}
                    </ul>
                    {"\n\n                  "}
                    <a
                      id="enlace-carrito-navbar"
                      href="../Carrito/carrito.html"
                      className="btn btn-outline-light position-relative"
                      title="Carrito de compras"
                      aria-label="Carrito de compras"
                      {...props["enlace-carrito-navbar"]}
                    >
                      {content["enlace-carrito-navbar"] ?? (
                        <>
                          {"\n                    "}
                          <i className="bi bi-cart3"></i>
                          {"\n\n                    "}
                          <span
                            id="contador-carrito"
                            className="position-absolute top-0 start-100 translate-middle badge rounded-pill text-bg-danger d-none"
                            aria-hidden="true"
                            {...props["contador-carrito"]}
                          >
                            {content["contador-carrito"] ?? (
                              <>
                                {
                                  "\n                      0\n                    "
                                }
                              </>
                            )}
                          </span>
                          {"\n                  "}
                        </>
                      )}
                    </a>
                    {"\n                  \n\n                "}
                  </div>
                  {"\n              "}
                </>
              )}
            </div>
            {"\n            "}
          </div>
          {"\n          "}
        </nav>
        {"\n        "}
      </header>
      {"\n        "}
    </mi-navbar>
  );
}
