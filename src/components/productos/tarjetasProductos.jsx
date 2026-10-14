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
    <article key={producto.id} className={estilos.tarjeta}>
      <img
        src={rutaImagen(producto.imagen)}
        alt={producto.titulo}
        className={estilos.imagen}
      />

      <div className={estilos.cuerpo}>
        <h5 className={estilos.titulo}>{producto.titulo}</h5>
        <p className={estilos.descripcion}>{producto.descripcion}</p>

        {/* El contenedor 'pie' tiene margin-top: auto para alinear precios y botones */}
        <div className={estilos.pie}>
          <p className={estilos.precio}>
            Precio: <PrecioProducto producto={producto} />
          </p>

          <div className={estilos.acciones}>
            <button
              type="button"
              className={estilos.botonVer}
              onClick={() => verProducto(producto)}
            >
              Ver
            </button>
            <button
              type="button"
              className={estilos.botonAgregar}
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
    </article>
  ));
}
