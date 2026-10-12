import { price } from "./Products.jsx";

const nombresCategoria = {
  pasteleria: "Pastelería",
  panaderia: "Panadería",
  salados: "Salados",
  "sin-azucar": "Sin azúcar",
};

export default function TablaProductos({ productos }) {
  if (productos.length === 0) {
    return (
      <p className="alert alert-info" role="status">
        No hay productos registrados.
      </p>
    );
  }

  return (
    <section className="mb-4">
      <h3 className="h4">Productos registrados ({productos.length})</h3>

      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th scope="col">Nombre</th>
              <th scope="col">Categoría</th>
              <th scope="col">Precio</th>
              <th scope="col">Descuento</th>
            </tr>
          </thead>

          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id}>
                <td>{producto.titulo}</td>
                <td>{nombresCategoria[producto.categoria]}</td>
                <td>{price(producto.precio)}</td>
                <td>{producto.descuento ?? 0}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}