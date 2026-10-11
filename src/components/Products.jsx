import { useStore } from "../store.jsx";

export const price = (value) => `$${value.toLocaleString("es-CL")}`;

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
    <div className="card" key={product.id}>
      <img src={product.imagen} alt={product.titulo} className="card-img-top" />
      <div className="card-body">
        <h5 className="card-title">{product.titulo}</h5>
        <p className="card-text text-muted">{product.descripcion}</p>
        <p className="card-text">Precio: {price(product.precio)}</p>
        <div className="contenedor-btn">
          <button
            type="button"
            className="btn btn-outline-info btn-ver"
            onClick={() => view(product)}
          >
            Ver
          </button>
          <button
            type="button"
            className="btn btn-outline-success btn-agregar"
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

export function CartRows() {
  const { cart, remove, changeQuantity } = useStore();
  if (!cart.length)
    return (
      <div className="alert alert-info text-center" role="status">
        Tu carrito está vacío. Agrega productos desde el catálogo.
      </div>
    );
  return cart.map((product, index) => (
    <div className="card mb-3" key={product.id}>
      <div className="card-body d-flex align-items-center gap-4">
        <img
          src={product.imagen}
          alt={product.titulo}
          className="imagen-carrito"
        />
        <div className="flex-grow-1">
          <h5>{product.titulo}</h5>
          <p>Precio: {price(product.precio)}</p>
          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary btn-restar"
              aria-label={`Disminuir cantidad de ${product.titulo}`}
              onClick={() => changeQuantity(index, -1)}
            >
              -
            </button>
            <span>{product.cantidad}</span>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sumar"
              aria-label={`Aumentar cantidad de ${product.titulo}`}
              onClick={() => changeQuantity(index, 1)}
            >
              +
            </button>
          </div>
          <p className="mt-2">
            Subtotal: {price(product.precio * product.cantidad)}
          </p>
        </div>
        <button
          type="button"
          className="btn btn-outline-danger btn-eliminar"
          onClick={() => remove(index)}
        >
          Eliminar
        </button>
      </div>
    </div>
  ));
}
