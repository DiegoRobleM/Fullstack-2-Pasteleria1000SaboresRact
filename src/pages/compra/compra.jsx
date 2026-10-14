import { Link, useParams } from "react-router-dom";
import { BarraNavegacion } from "../../components/estructura/barraNavegacion.jsx";
import { PiePagina } from "../../components/estructura/piePagina.jsx";
import { useTienda } from "../../context/ContextoTienda.jsx";
import { useTituloPagina } from "../../hooks/useTituloPagina.js";
import { formatearPrecio } from "../../utils/formatoPrecio.js";
import Alerta from "../../components/alerta/alerta.jsx";
export default function Compra() {
  const { idPedido } = useParams();
  const { pedidos, usuario } = useTienda();
  const pedido = pedidos.find(
    (actual) =>
      actual.id === idPedido &&
      (!usuario || actual.correoCliente === usuario.email?.toLowerCase()),
  );
  useTituloPagina("Compra confirmada - Pastelería 1000 Sabores");
  return (
    <>
      <BarraNavegacion />
      <main className="container my-5">
        {pedido ? (
          <section id="resumen-pedido" className="card">
            <div className="card-body p-4">
              <h1>Compra confirmada</h1>
              <Alerta tipo="success" como="p">
                Tu pedido fue registrado correctamente.
              </Alerta>
              <p>
                Pedido: <strong>{pedido.id}</strong>
              </p>
              <p>
                {new Date(pedido.fecha).toLocaleString("es-CL")} · Estado:{" "}
                {pedido.estado}
              </p>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Producto</th>
                      <th scope="col">Cantidad</th>
                      <th scope="col">Precio pagado</th>
                      <th scope="col">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedido.productos.map((producto) => (
                      <tr key={producto.id}>
                        <td>{producto.titulo}</td>
                        <td>{producto.cantidad}</td>
                        <td>{formatearPrecio(producto.precioFinal)}</td>
                        <td>
                          {formatearPrecio(
                            producto.precioFinal * producto.cantidad,
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p>Productos: {formatearPrecio(pedido.subtotal)}</p>
              <p>
                {pedido.entrega.nombre}: {formatearPrecio(pedido.entrega.costo)}
              </p>
              <p className="h4">
                Total:{" "}
                <span id="pedido-total">{formatearPrecio(pedido.total)}</span>
              </p>
              <h2 className="h5 mt-4">Datos de entrega</h2>
              <p>
                {pedido.cliente.nombre} · {pedido.cliente.email}
              </p>
              <p>
                {pedido.cliente.direccion}, {pedido.cliente.comuna},{" "}
                {pedido.cliente.region}
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link className="btn botonPasteleria" to="/pasteleria">
                  Seguir comprando
                </Link>
                {usuario && (
                  <Link className="btn btn-outline-dark" to="/perfil">
                    Ver historial
                  </Link>
                )}
              </div>
            </div>
          </section>
        ) : (
          <Alerta tipo="warning">
            No hay un pedido disponible con este identificador.{" "}
            <Link to="/pasteleria">Volver al catálogo</Link>
          </Alerta>
        )}
      </main>
      <PiePagina />
    </>
  );
}
