import estilos from "./tarjetaProducto.module.css";
import { useStore } from "../../context/StoreContext.jsx";
import { price } from "../../utils/formatPrice.js";

export function ProductCards({ products, notify }) {
  const { add } = useStore();
  function view(product) {
    sessionStorage.setItem(
      "productoSeleccionado",
      JSON.stringify({ ...product, paginaOrigen: window.location.href }),
    );
    window.location.href = "../DetalleProducto/index.html";
  }
  return products.map((product) => (
    <div key={product.id} className={`card ${estilos.tarjeta}`}>
      <img src={product.imagen} alt={product.titulo} className="card-img-top" />
      <div className="card-body">
        <h5 className="card-title">{product.titulo}</h5>
        <p className="card-text text-muted">{product.descripcion}</p>
        <p className="card-text">Precio: {price(product.precio)}</p>
        <div className={estilos.acciones}>
          <button
            type="button"
            className={`btn btn-outline-info botonPasteleria ${estilos.boton}`}
            onClick={() => view(product)}
          >
            Ver
          </button>
          <button
            type="button"
            className={`btn btn-outline-success botonPasteleria ${estilos.boton}`}
            onClick={() => {
              add(product);
              notify();
            }}
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  ));
}
