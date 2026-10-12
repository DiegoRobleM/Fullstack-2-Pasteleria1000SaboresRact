import { useStore } from "../../context/StoreContext.jsx";
import { price } from "../../utils/formatPrice.js";

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
