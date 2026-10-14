import estilos from "./filaCarrito.module.css";
import { useTienda } from "../../context/ContextoTienda.jsx";
import { formatearPrecio } from "../../utils/formatoPrecio.js";
import { precioFinal } from "../../utils/precios.js";
import { rutaImagen } from "../../utils/rutaImagen.js";
import { PrecioProducto } from "../productos/precioProducto.jsx";
export function FilasCarrito() {
  const { carrito, quitarProducto, cambiarCantidad } = useTienda();
  if (!carrito.length)
    return (
      <div className="alert alert-info text-center" role="status">
        Tu carrito está vacío. Agrega productos desde el catálogo.
      </div>
    );
  return carrito.map((producto) => (
    <div className="card mb-3" key={producto.id}>
      <div
        className={"card-body d-flex align-items-center gap-4 " + estilos.fila}
      >
        <img
          src={rutaImagen(producto.imagen)}
          alt={producto.titulo}
          className={estilos.imagenCarrito}
        />
        <div className={"flex-grow-1 " + estilos.contenido}>
          <h5>{producto.titulo}</h5>
          <p>
            Precio: <PrecioProducto producto={producto} />
          </p>
          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary"
              aria-label={"Disminuir cantidad de " + producto.titulo}
              onClick={() => cambiarCantidad(producto.id, -1)}
            >
              -
            </button>
            <span>{producto.cantidad}</span>
            <button
              type="button"
              className="btn btn-outline-secondary"
              aria-label={"Aumentar cantidad de " + producto.titulo}
              onClick={() => cambiarCantidad(producto.id, 1)}
            >
              +
            </button>
          </div>
          <p className="mt-2">
            Subtotal:{" "}
            {formatearPrecio(precioFinal(producto) * producto.cantidad)}
          </p>
        </div>
        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={() => quitarProducto(producto.id)}
        >
          Eliminar
        </button>
      </div>
    </div>
  ));
}
