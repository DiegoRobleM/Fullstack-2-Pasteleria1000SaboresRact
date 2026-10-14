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
  const navegar = useNavigate();
  useTituloPagina(paginas.PerfilUsuario.title);

  const propios = pedidos
    .filter((pedido) => pedido.correoCliente === usuario?.email?.toLowerCase())
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  function salir() {
    cerrarSesion();
    navegar("/inicio-sesion", { replace: true });
  }

  const nombreCompleto =
    [usuario?.nombre, usuario?.apellido].filter(Boolean).join(" ") ||
    "Cliente Frecuente";

  const direccionCompleta =
    [usuario?.direccion, usuario?.tipoPropiedad, usuario?.comuna]
      .filter(Boolean)
      .join(", ") || "Dirección no registrada";

  return (
    <>
      <BarraNavegacion />

      <main className={estilos.pagina}>
        {/* BANNER HERO MI CUENTA */}
        <section className={estilos.heroPerfil}>
          <div className={estilos.heroContenido}>
            <span className={estilos.subtituloBadge}>{"Área de Cliente"}</span>
            <h1 className={estilos.tituloHero}>{"Mi Perfil"}</h1>
            <p className={estilos.bajadaHero}>
              {
                "Gestiona tu información personal y revisa el historial de tus pedidos de repostería."
              }
            </p>
          </div>
        </section>

        <div className="container py-5">
          <div className="row g-4">
            {/* COLUMNA IZQUIERDA: TARJETA DE DATOS DEL USUARIO */}
            <div className="col-12 col-lg-5">
              <aside className={estilos.tarjetaUsuario}>
                <div className={estilos.headerUsuario}>
                  <div className={estilos.contenedorAvatar}>
                    <img
                      src="/PerfilUsuario/img/perfil.JPG"
                      alt={nombreCompleto}
                      className={estilos.imagenPerfil}
                    />
                  </div>
                  <h2 className={estilos.nombreUsuario} id="perfil-nombre">
                    {nombreCompleto}
                  </h2>
                  <span className={estilos.badgeCliente}>
                    {"Cliente Registrado"}
                  </span>
                </div>

                <ul className={estilos.listaDatos}>
                  <li className={estilos.itemDato}>
                    <div className={estilos.iconoDato}>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </div>
                    <div className={estilos.contenidoDato}>
                      <span className={estilos.etiquetaDato}>{"Correo electrónico"}</span>
                      <span className={estilos.valorDato} id="perfil-email">
                        {usuario?.email || "No registrado"}
                      </span>
                    </div>
                  </li>

                  <li className={estilos.itemDato}>
                    <div className={estilos.iconoDato}>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <div className={estilos.contenidoDato}>
                      <span className={estilos.etiquetaDato}>{"Dirección habitual"}</span>
                      <span className={estilos.valorDato} id="perfil-direccion">
                        {direccionCompleta}
                      </span>
                    </div>
                  </li>

                  <li className={estilos.itemDato}>
                    <div className={estilos.iconoDato}>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    </div>
                    <div className={estilos.contenidoDato}>
                      <span className={estilos.etiquetaDato}>{"Último pedido"}</span>
                      <span className={estilos.valorDato}>
                        {propios.length
                          ? new Date(propios[0].fecha).toLocaleDateString(
                              "es-CL"
                            )
                          : "Sin pedidos registrados"}
                      </span>
                    </div>
                  </li>
                </ul>

                <div className={estilos.pieUsuario}>
                  <button
                    type="button"
                    id="btn-cerrar-sesion"
                    className={estilos.btnCerrarSesion}
                    onClick={salir}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    <span>{"Cerrar sesión"}</span>
                  </button>
                </div>
              </aside>
            </div>

            {/* COLUMNA DERECHA: SECCIÓN HISTORIAL DE PEDIDOS */}
            <div className="col-12 col-lg-7">
              <section id="historial-pedidos" className={estilos.bloqueHistorialCafe}>
                <div className={estilos.headerHistorial}>
                  <h2 className={estilos.tituloHistorial}>
                    {"Historial de Pedidos"}
                  </h2>
                </div>

                {propios.length ? (
                  <div className={estilos.contenedorListaPedidos}>
                    {propios.map((pedido) => (
                      <article key={pedido.id} className={estilos.tarjetaPedidoBlanca}>
                        <div className={estilos.encabezadoPedido}>
                          <div>
                            <span className={estilos.badgeIdPedido}>
                              {`Pedido #${pedido.id.slice(-6).toUpperCase()}`}
                            </span>
                            <h3 className={estilos.fechaPedido}>
                              {new Date(pedido.fecha).toLocaleString("es-CL", {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })}
                            </h3>
                          </div>
                          <span className={estilos.montoTotalPedido}>
                            {formatearPrecio(pedido.total)}
                          </span>
                        </div>

                        <div className={estilos.cuerpoPedido}>
                          <div className={estilos.resumenProductos}>
                            <span className={estilos.etiquetaSub}>{"Productos:"}</span>
                            <p className={estilos.textoProductos}>
                              {pedido.productos
                                .map(
                                  (producto) =>
                                    `${producto.cantidad} × ${producto.titulo}`
                                )
                                .join(", ")}
                            </p>
                          </div>

                          <div className={estilos.detallesEntrega}>
                            <span className={estilos.badgeEntrega}>
                              {pedido.entrega?.nombre || "Despacho"}
                            </span>
                          </div>
                        </div>

                        <div className={estilos.piePedido}>
                          <Link
                            className={estilos.btnVerPedido}
                            to={"/compra/" + pedido.id}
                          >
                            <span>{"Ver detalle completo"}</span>
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <line x1="5" y1="12" x2="19" y2="12" />
                              <polyline points="12 5 19 12 12 19" />
                            </svg>
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className={estilos.tarjetaSinPedidos}>
                    <div className={estilos.iconoSinPedidos}>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="9" cy="21" r="1" />
                        <circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                      </svg>
                    </div>
                    <h3>{"Aún no has realizado pedidos"}</h3>
                    <p>
                      {"Tus compras aparecerán registradas aquí con todo su desglose y estado."}
                    </p>
                    <Link to="/pasteleria" className={estilos.btnExplorar}>
                      {"Explorar Productos"}
                    </Link>
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      </main>

      <PiePagina />
    </>
  );
}