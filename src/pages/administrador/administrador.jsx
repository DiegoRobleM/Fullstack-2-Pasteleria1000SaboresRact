import { useState } from "react";
import Alerta from "../../components/alerta/alerta.jsx";
import AlertaFormulario from "../../components/alerta/alertaFormulario.jsx";
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
  const { usuario, productos, refrescarProductos } = useTienda();
  const [secciones, establecerSecciones] = useState({});
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
  return (
    <>
      <BarraNavegacion />
      <main id="panel-admin" className="container py-5">
        <div className="mb-5">
          <h1 className={estilos.titulo}>Panel de administración</h1>
          <p id="saludo-admin" className="text-muted">
            Sesión iniciada como {usuario?.nombre} {usuario?.apellido}.
          </p>
        </div>
        <div className="row g-4">
          {[
            {
              id: "consultas",
              titulo: "Consultas",
              icono: "chat-left-text",
              texto: "Revisar las consultas enviadas por los usuarios.",
            },
            {
              id: "productos",
              titulo: "Productos",
              icono: "cake2",
              texto: "Crear, editar y eliminar los productos publicados.",
            },
            {
              id: "usuarios",
              titulo: "Usuarios",
              icono: "people",
              texto: "Ver las cuentas registradas en este navegador.",
            },
          ].map((seccion) => (
            <div key={seccion.id} className="col-12 col-md-4">
              <article className={"card h-100 " + estilos.tarjeta}>
                <div className="card-body">
                  <i
                    className={"bi bi-" + seccion.icono + " " + estilos.icono}
                  ></i>
                  <h2 className="card-title h4 mt-3">{seccion.titulo}</h2>
                  <p className="card-text">{seccion.texto}</p>
                  <button
                    type="button"
                    id={"btn-ver-" + seccion.id}
                    className="btn btn-outline-dark"
                    onClick={() => mostrarSeccion(seccion.id)}
                  >
                    Ver {seccion.id}
                  </button>
                </div>
              </article>
            </div>
          ))}
        </div>
        <AlertaFormulario mensaje={mensaje} como="p" className="mt-4" />
        {secciones.productos && (
          <section id="seccion-productos" className="mt-5">
            <h2 className="h3 mb-3">Catálogos publicados</h2>
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
            <div className="row g-3">
              {categorias.map((categoria) => (
                <div key={categoria.id} className="col-12 col-md-6">
                  <Link
                    to={"/" + categoria.id}
                    className="btn btn-outline-dark w-100 py-3"
                  >
                    {categoria.nombre}
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}
        {secciones.consultas && (
          <section
            id="seccion-consultas"
            className={"mt-5 " + estilos.seccionConsultas}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="h3 mb-0">Consultas recibidas</h2>
              <span id="total-consultas" className="badge text-bg-dark">
                {consultas.length}
              </span>
            </div>
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
              <Alerta id="sin-consultas" como="p">
                Todavía no se han recibido consultas.
              </Alerta>
            )}
          </section>
        )}
        {secciones.usuarios && (
          <section id="seccion-usuarios" className="mt-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="h3 mb-0">Usuarios registrados</h2>
              <span id="total-usuarios" className="badge text-bg-dark">
                {usuarios.length}
              </span>
            </div>
            {usuarios.length ? (
              <TablaUsuarios usuarios={usuarios} />
            ) : (
              <Alerta id="sin-usuarios" como="p">
                Todavía no existen usuarios registrados.
              </Alerta>
            )}
          </section>
        )}
      </main>
      <PiePagina />
    </>
  );
}
