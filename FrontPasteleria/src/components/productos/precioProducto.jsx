import { formatearPrecio } from "../../utils/formatoPrecio.js";
import { precioFinal } from "../../utils/precios.js";
export function PrecioProducto({ producto }) {
  return (
    <>
      {Number(producto.descuento) > 0 && (
        <>
          <del className="text-muted me-2">
            {formatearPrecio(producto.precio)}
          </del>
          <span className="badge text-bg-success me-2">
            -{producto.descuento}%
          </span>
        </>
      )}
      <span>{formatearPrecio(precioFinal(producto))}</span>
    </>
  );
}
