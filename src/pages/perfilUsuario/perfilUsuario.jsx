import { Link, useNavigate } from "react-router-dom";
import estilos from "./perfilUsuario.module.css";
import { BarraNavegacion } from "../../components/estructura/barraNavegacion.jsx";
import { PiePagina } from "../../components/estructura/piePagina.jsx";
import { useTienda } from "../../context/ContextoTienda.jsx";
import { useTituloPagina } from "../../hooks/useTituloPagina.js";
import { paginas } from "../../app/pages.js";
import { formatearPrecio } from "../../utils/formatoPrecio.js";
export default function PerfilUsuario() {
  const { usuario, pedidos, cerrarSesion } = useTienda();
  const navigate = useNavigate();
  useTituloPagina(paginas.PerfilUsuario.title);
  const propios = pedidos
    .filter((pedido) => pedido.correoCliente === usuario?.email?.toLowerCase())
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  function salir() {
    cerrarSesion();
    navigate("/inicio-sesion", { replace: true });
  }
  return (
    <>
      <BarraNavegacion />
      <main className={estilos.contenedorPerfil}>
        <div className={estilos.tarjetaPerfil + " text-center"}>
          <h1 className={estilos.tituloPerfil}>
            Perfil de usuario <i className="bi bi-cup-hot-fill"></i>
          </h1>
          <div className={estilos.contenidoPerfil}>
            <div className="mt-4">
              <img
                src="/PerfilUsuario/img/perfil.JPG"
                alt="Imagen de usuario"
                className={estilos.imagenPerfil}
              />
            </div>
            <div className={"card " + estilos.tarjetaDatos}>
              <div className="card-header" id="perfil-nombre">
                {[usuario?.nombre, usuario?.apellido].filter(Boolean).join(" ")}
              </div>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <strong>Correo: </strong>
                  <span id="perfil-email">{usuario?.email}</span>
                </li>
                <li className="list-group-item">
                  <strong>Dirección: </strong>
                  <span id="perfil-direccion">
                    {[
                      usuario?.direccion,
                      usuario?.tipoPropiedad,
                      usuario?.comuna,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                </li>
                <li className="list-group-item">
                  <strong>Último pedido: </strong>
                  {propios.length
                    ? new Date(propios[0].fecha).toLocaleDateString("es-CL")
                    : "Sin pedidos registrados"}
                </li>
              </ul>
              <div className="card-body">
                <button
                  type="button"
                  id="btn-cerrar-sesion"
                  className="btn btn-outline-danger w-100"
                  onClick={salir}
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
          <section id="historial-pedidos" className="mt-4 text-start">
            <h2 className="h4">Historial de pedidos</h2>
            {propios.length ? (
              propios.map((pedido) => (
                <article key={pedido.id} className="card mb-3">
                  <div className="card-body">
                    <h3 className="h5">
                      Pedido del{" "}
                      {new Date(pedido.fecha).toLocaleString("es-CL")}
                    </h3>
                    <p>
                      {pedido.productos
                        .map(
                          (producto) =>
                            producto.cantidad + " × " + producto.titulo,
                        )
                        .join(", ")}
                    </p>
                    <p>
                      {pedido.entrega.nombre} · Total:{" "}
                      {formatearPrecio(pedido.total)}
                    </p>
                    <Link
                      className="btn btn-outline-dark"
                      to={"/compra/" + pedido.id}
                    >
                      Ver pedido
                    </Link>
                  </div>
                </article>
              ))
            ) : (
              <p>Sin pedidos registrados.</p>
            )}
          </section>
        </div>
      </main>
      <PiePagina />
    </>
  );
}
