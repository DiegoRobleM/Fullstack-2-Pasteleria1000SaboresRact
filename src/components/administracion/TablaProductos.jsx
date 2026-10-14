import { useState } from "react";
import { formatearPrecio } from "../../utils/formatoPrecio.js";
import { precioFinal } from "../../utils/precios.js";
import { nombreCategoria } from "../../data/categorias.js";
export default function TablaProductos({ productos, onEditar, onEliminar }) {
  const [confirmacion, establecerConfirmacion] = useState(null);
  if (!productos.length)
    return (
      <p className="alert alert-info" role="status">
        No hay productos registrados.
      </p>
    );
  return (
    <section className="mb-4">
      <h3 className="h4">Productos registrados ({productos.length})</h3>
      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              {[
                "Nombre",
                "Categoría",
                "Precio",
                "Descuento",
                "Precio final",
                "Acciones",
              ].map((titulo) => (
                <th key={titulo} scope="col">
                  {titulo}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id}>
                <td>{producto.titulo}</td>
                <td>{nombreCategoria(producto.categoria)}</td>
                <td>{formatearPrecio(producto.precio)}</td>
                <td>{producto.descuento ?? 0}%</td>
                <td>{formatearPrecio(precioFinal(producto))}</td>
                <td>
                  {confirmacion === producto.id ? (
                    <div role="alert">
                      ¿Eliminar {producto.titulo}?
                      <div className="d-flex gap-2 mt-2">
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => {
                            onEliminar(producto.id);
                            establecerConfirmacion(null);
                          }}
                        >
                          Confirmar eliminación
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => establecerConfirmacion(null)}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-outline-dark btn-sm"
                        aria-label={"Editar " + producto.titulo}
                        onClick={() => onEditar(producto)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        aria-label={"Eliminar " + producto.titulo}
                        onClick={() => establecerConfirmacion(producto.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
