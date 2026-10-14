import estilos from "./tarjetaProducto.module.css";
import { useTienda } from "../../context/ContextoTienda.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import { rutaImagen } from "../../utils/rutaImagen.js";
import { PrecioProducto } from "./precioProducto.jsx";
export function TarjetasProductos({ productos, notificar }) {
  const { agregarProducto } = useTienda();
  const navegar = useNavigate();
  const ubicacion = useLocation();
  function verProducto(producto) {
    sessionStorage.setItem(
      "productoSeleccionado",
      JSON.stringify({ ...producto, paginaOrigen: ubicacion.pathname }),
    );
    navegar("/producto/" + encodeURIComponent(producto.id));
  }
  return productos.map((producto) => (
    <div key={producto.id} className={"card " + estilos.tarjeta}>
      <img
        src={rutaImagen(producto.imagen)}
        alt={producto.titulo}
        className="card-img-top"
      />
      <div className="card-body">
        <h5 className="card-title">{producto.titulo}</h5>
        <p className="card-text text-muted">{producto.descripcion}</p>
        <p className="card-text">
          Precio: <PrecioProducto producto={producto} />
        </p>
        <div className={estilos.acciones}>
          <button
            type="button"
            className={"btn btn-outline-info botonPasteleria " + estilos.boton}
            onClick={() => verProducto(producto)}
          >
            Ver
          </button>
          <button
            type="button"
            className={
              "btn btn-outline-success botonPasteleria " + estilos.boton
            }
            onClick={() => {
              agregarProducto(producto);
              notificar();
            }}
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  ));
}
