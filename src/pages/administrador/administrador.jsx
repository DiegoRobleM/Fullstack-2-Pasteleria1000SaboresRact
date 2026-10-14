import { useState } from "react";
import { Link } from "react-router-dom";
import estilos from "./administrador.module.css";
import { BarraNavegacion } from "../../components/estructura/barraNavegacion.jsx";
import { PiePagina } from "../../components/estructura/piePagina.jsx";
import FormularioProducto from "../../components/administracion/FormularioProducto.jsx";
import TablaProductos from "../../components/administracion/TablaProductos.jsx";
import TablaConsultas from "../../components/administracion/TablaConsultas.jsx";
import TablaUsuarios from "../../components/administracion/TablaUsuarios.jsx";
import { useTienda } from "../../context/ContextoTienda.jsx";
import { useTituloPagina } from "../../hooks/useTituloPagina.js";
import { formatearPrecio } from "../../utils/formatoPrecio.js";
import {
  crearProducto,
  editarProducto,
  eliminarProducto,
} from "../../services/productos.js";
import {
  obtenerConsultas,
  cambiarEstadoConsulta,
} from "../../services/consultas.js";
import { leerArreglo } from "../../utils/almacenamiento.js";
import { categorias } from "../../data/categorias.js";
import { paginas } from "../../app/pages.js";

export default function Administrador() {
  const { usuario, productos, pedidos, refrescarProductos } = useTienda();
  const [secciones, establecerSecciones] = useState({ ventas: true }); // Ventas activo por defecto
  const [consultas, establecerConsultas] = useState([]);
  const [usuarios, establecerUsuarios] = useState([]);
  const [productoEnEdicion, establecerProductoEnEdicion] = useState(null);
  const [mensaje, establecerMensaje] = useState(null);

  useTituloPagina(paginas.Administrador.title);

  function mostrarSeccion(seccion) {
    if (seccion === "consultas") establecerConsultas(obtenerConsultas());
    if (seccion === "usuarios")
      establecerUsuarios(leerArreglo("usuariosRegistrados"));
    establecerSecciones((actuales) => ({ ...actuales, [seccion]: true }));
  }

  function guardarProducto(datos) {
    if (productoEnEdicion) {
      editarProducto(productoEnEdicion.id, datos);
      establecerProductoEnEdicion(null);
      establecerMensaje({
        tipo: "success",
        texto: "Producto actualizado correctamente.",
      });
    } else {
      crearProducto(datos);
      establecerMensaje(null);
    }
    refrescarProductos();
  }

  function borrarProducto(id) {
    try {
      eliminarProducto(id);
      refrescarProductos();
      if (productoEnEdicion?.id === id) establecerProductoEnEdicion(null);
      establecerMensaje({
        tipo: "success",
        texto: "Producto eliminado correctamente.",
      });
    } catch (error) {
      establecerMensaje({ tipo: "danger", texto: error.message });
    }
  }

  function actualizarConsulta(id, estado) {
    try {
      establecerConsultas(cambiarEstadoConsulta(id, estado));
    } catch (error) {
      establecerMensaje({ tipo: "danger", texto: error.message });
    }
  }

  // CÁLCULOS KPI DEL DASHBOARD DE VENTAS
  const listaPedidos = pedidos || [];
  const totalIngresos = listaPedidos.reduce(
    (acc, p) => acc + (Number(p.total) || 0),
    0
  );
  const cantidadPedidos = listaPedidos.length;
  const ticketPromedio =
    cantidadPedidos > 0 ? Math.round(totalIngresos / cantidadPedidos) : 0;
  const totalUnidades = listaPedidos.reduce((acc, p) => {
    const unidades =
      p.productos?.reduce(
        (sum, item) => sum + (Number(item.cantidad) || 0),
        0
      ) || 0;
    return acc + unidades;
  }, 0);

  // CÁLCULO DE PRODUCTOS MÁS VENDIDOS
  const mapaProductosVendidos = {};
  listaPedidos.forEach((p) => {
    p.productos?.forEach((item) => {
      const titulo = item.titulo || "Producto";
      mapaProductosVendidos[titulo] =
        (mapaProductosVendidos[titulo] || 0) + (Number(item.cantidad) || 0);
    });
  });

  const rankingProductos = Object.entries(mapaProductosVendidos)
    .map(([titulo, cantidad]) => ({ titulo, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 5);

  const SECCIONES_INFO = [
    {
      id: "ventas",
      titulo: "Dashboard Ventas",
      texto: "Métricas de ingresos, ticket promedio e historial financiero.",
      icono: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={estilos.iconoSvg}
        >
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
    },
    {
      id: "consultas",
      titulo: "Consultas",
      texto: "Revisar las consultas enviadas por los usuarios.",
      icono: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={estilos.iconoSvg}
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
    {
      id: "productos",
      titulo: "Productos",
      texto: "Crear, editar y eliminar los productos publicados.",
      icono: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={estilos.iconoSvg}
        >
          <path d="M20 21H4v-7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7z" />
          <path d="M4 14h16" />
          <path d="M12 4v4" />
          <circle cx="12" cy="3" r="1" />
        </svg>
      ),
    },
    {
      id: "usuarios",
      titulo: "Usuarios",
      texto: "Ver las cuentas registradas en este navegador.",
      icono: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={estilos.iconoSvg}
        >
          <path d="M17 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M7 23v-2a4 4 0 0 1 3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          <circle cx="9" cy="7" r="4" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <BarraNavegacion />

      <main className={estilos.pagina}>
        {/* BANNER HERO DE ADMINISTRACIÓN */}
        <section className={estilos.heroAdmin}>
          <div className={estilos.heroContenido}>
            <span className={estilos.subtituloBadge}>
              {"Gestión & Control"}
            </span>
            <h1 className={estilos.tituloHero}>{"Panel de Administración"}</h1>
            <p id="saludo-admin" className={estilos.bajadaHero}>
              {`Sesión iniciada como ${usuario?.nombre || "Administrador"} ${
                usuario?.apellido || ""
              }.`}
            </p>
          </div>
        </section>

        <div id="panel-admin" className="container py-5">
          {/* TARJETAS DE ACCESO A SECCIONES */}
          <div className="row g-4 mb-4">
            {SECCIONES_INFO.map((seccion) => (
              <div key={seccion.id} className="col-12 col-sm-6 col-lg-3">
                <article className={estilos.tarjetaAcceso}>
                  <div className={estilos.contenedorIcono}>
                    {seccion.icono}
                  </div>
                  <h2 className={estilos.tituloTarjeta}>{seccion.titulo}</h2>
                  <p className={estilos.textoTarjeta}>{seccion.texto}</p>
                  <button
                    type="button"
                    id={"btn-ver-" + seccion.id}
                    className={estilos.btnVerSeccion}
                    onClick={() => mostrarSeccion(seccion.id)}
                  >
                    {`Ver ${seccion.id}`}
                  </button>
                </article>
              </div>
            ))}
          </div>

          {/* MENSAJE DE NOTIFICACIÓN */}
          {mensaje && (
            <p
              className={`alert alert-${mensaje.tipo} mt-4 ${estilos.alertaAdmin}`}
              role={mensaje.tipo === "danger" ? "alert" : "status"}
            >
              {mensaje.texto}
            </p>
          )}

          {/* DASHBOARD DE VENTAS Y MÉTRICAS */}
          {secciones.ventas && (
            <section id="seccion-ventas" className={estilos.bloqueSeccionCafe}>
              <div className={estilos.headerSeccionConBadge}>
                <h2 className={estilos.tituloSeccion}>
                  {"Dashboard de Ventas"}
                </h2>
                <span id="total-ventas-kpi" className={estilos.badgeConteo}>
                  {formatearPrecio(totalIngresos)}
                </span>
              </div>

              {/* TARJETAS DE MÉTRICAS KPI */}
              <div className="row g-3 mb-4">
                <div className="col-12 col-sm-6 col-md-3">
                  <div className={estilos.kpiCard}>
                    <span className={estilos.kpiTitulo}>{"Ingresos Totales"}</span>
                    <span className={estilos.kpiValor}>
                      {formatearPrecio(totalIngresos)}
                    </span>
                    <span className={estilos.kpiSub}>{"Ventas acumuladas"}</span>
                  </div>
                </div>

                <div className="col-12 col-sm-6 col-md-3">
                  <div className={estilos.kpiCard}>
                    <span className={estilos.kpiTitulo}>{"Total Pedidos"}</span>
                    <span className={estilos.kpiValor}>{cantidadPedidos}</span>
                    <span className={estilos.kpiSub}>{"Órdenes procesadas"}</span>
                  </div>
                </div>

                <div className="col-12 col-sm-6 col-md-3">
                  <div className={estilos.kpiCard}>
                    <span className={estilos.kpiTitulo}>{"Ticket Promedio"}</span>
                    <span className={estilos.kpiValor}>
                      {formatearPrecio(ticketPromedio)}
                    </span>
                    <span className={estilos.kpiSub}>{"Por cada compra"}</span>
                  </div>
                </div>

                <div className="col-12 col-sm-6 col-md-3">
                  <div className={estilos.kpiCard}>
                    <span className={estilos.kpiTitulo}>{"Unidades Despachadas"}</span>
                    <span className={estilos.kpiValor}>{totalUnidades}</span>
                    <span className={estilos.kpiSub}>{"Productos vendidos"}</span>
                  </div>
                </div>
              </div>

              {/* TABLAS DE TOP PRODUCTOS Y ÚLTIMAS TRANSACCIONES */}
              <div className="row g-4">
                {/* Ranking de productos */}
                <div className="col-12 col-lg-5">
                  <div className={estilos.contenidoSeccionBlanco}>
                    <h3 className={estilos.subtituloInterno}>
                      {"Más Vendidos"}
                    </h3>

                    {rankingProductos.length ? (
                      <ul className={estilos.listaRanking}>
                        {rankingProductos.map((prod, index) => (
                          <li key={prod.titulo} className={estilos.itemRanking}>
                            <div className={estilos.infoRanking}>
                              <span className={estilos.posicionRanking}>
                                {`#${index + 1}`}
                              </span>
                              <span className={estilos.nombreRanking}>
                                {prod.titulo}
                              </span>
                            </div>
                            <span className={estilos.badgeCantidadRanking}>
                              {`${prod.cantidad} uds.`}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className={estilos.mensajeVacio}>
                        {"No hay datos de productos vendidos."}
                      </p>
                    )}
                  </div>
                </div>

                {/* Historial de Ventas */}
                <div className="col-12 col-lg-7">
                  <div className={estilos.contenidoSeccionBlanco}>
                    <h3 className={estilos.subtituloInterno}>
                      {"Últimas Ventas Registradas"}
                    </h3>

                    {listaPedidos.length ? (
                      <div className="table-responsive">
                        <table className={estilos.tablaVentas}>
                          <thead>
                            <tr>
                              <th>{"ID"}</th>
                              <th>{"Fecha"}</th>
                              <th>{"Cliente"}</th>
                              <th>{"Total"}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {listaPedidos.slice(0, 6).map((ped) => (
                              <tr key={ped.id}>
                                <td>
                                  <span className={estilos.badgeIdTabla}>
                                    {`#${ped.id.slice(-5).toUpperCase()}`}
                                  </span>
                                </td>
                                <td>
                                  {new Date(ped.fecha).toLocaleDateString(
                                    "es-CL"
                                  )}
                                </td>
                                <td>{ped.correoCliente || "Invitado"}</td>
                                <td className={estilos.montoTabla}>
                                  {formatearPrecio(ped.total)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className={estilos.mensajeVacio}>
                        {"Sin registros de pedidos aún."}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* SECCIÓN PRODUCTOS */}
          {secciones.productos && (
            <section id="seccion-productos" className={estilos.bloqueSeccionCafe}>
              <div className={estilos.headerSeccion}>
                <h2 className={estilos.tituloSeccion}>{"Catálogos Publicados"}</h2>
              </div>

              <div className={estilos.contenidoSeccionBlanco}>
                <FormularioProducto
                  key={productoEnEdicion?.id || "nuevo"}
                  producto={productoEnEdicion}
                  onGuardar={guardarProducto}
                  onCancelar={() => establecerProductoEnEdicion(null)}
                />
                <TablaProductos
                  productos={productos}
                  onEditar={establecerProductoEnEdicion}
                  onEliminar={borrarProducto}
                />

                <div className="row g-3 mt-4">
                  {categorias.map((categoria) => (
                    <div key={categoria.id} className="col-12 col-md-6">
                      <Link
                        to={"/" + categoria.id}
                        className={estilos.btnCategoriaAcceso}
                      >
                        {categoria.nombre}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* SECCIÓN CONSULTAS */}
          {secciones.consultas && (
            <section
              id="seccion-consultas"
              className={`${estilos.bloqueSeccionCafe} ${estilos.seccionConsultas}`}
            >
              <div className={estilos.headerSeccionConBadge}>
                <h2 className={estilos.tituloSeccion}>{"Consultas Recibidas"}</h2>
                <span id="total-consultas" className={estilos.badgeConteo}>
                  {consultas.length}
                </span>
              </div>

              <div className={estilos.contenidoSeccionBlanco}>
                {consultas.length ? (
                  <div
                    id="contenedor-tabla-consultas"
                    className={estilos.tablaConsultas}
                  >
                    <TablaConsultas
                      consultas={consultas}
                      onCambiarEstado={actualizarConsulta}
                    />
                  </div>
                ) : (
                  <p id="sin-consultas" className={estilos.mensajeVacio} role="status">
                    {"Todavía no se han recibido consultas."}
                  </p>
                )}
              </div>
            </section>
          )}

          {/* SECCIÓN USUARIOS */}
          {secciones.usuarios && (
            <section id="seccion-usuarios" className={estilos.bloqueSeccionCafe}>
              <div className={estilos.headerSeccionConBadge}>
                <h2 className={estilos.tituloSeccion}>{"Usuarios Registrados"}</h2>
                <span id="total-usuarios" className={estilos.badgeConteo}>
                  {usuarios.length}
                </span>
              </div>

              <div className={estilos.contenidoSeccionBlanco}>
                {usuarios.length ? (
                  <TablaUsuarios usuarios={usuarios} />
                ) : (
                  <p id="sin-usuarios" className={estilos.mensajeVacio} role="status">
                    {"Todavía no existen usuarios registrados."}
                  </p>
                )}
              </div>
            </section>
          )}
        </div>
      </main>

      <PiePagina />
    </>
  );
}