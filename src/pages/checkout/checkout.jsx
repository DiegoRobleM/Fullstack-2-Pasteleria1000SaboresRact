import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BarraNavegacion } from "../../components/estructura/barraNavegacion.jsx";
import { PiePagina } from "../../components/estructura/piePagina.jsx";
import { useTienda } from "../../context/ContextoTienda.jsx";
import { useTituloPagina } from "../../hooks/useTituloPagina.js";
import { opcionesEntrega } from "../../services/pedidos.js";
import { totalCarrito, precioFinal } from "../../utils/precios.js";
import { formatearPrecio } from "../../utils/formatoPrecio.js";
import Alerta from "../../components/alerta/alerta.jsx";
export default function Checkout() {
  const { carrito, usuario, confirmarCompra } = useTienda();
  const [datos, establecerDatos] = useState(() => ({
    nombre: [usuario?.nombre, usuario?.apellido].filter(Boolean).join(" "),
    email: usuario?.email || "",
    direccion: usuario?.direccion || "",
    comuna: usuario?.comuna || "",
    region: usuario?.region || "",
    entrega: "domicilio",
    pago: "aprobado",
  }));
  const [mensaje, establecerMensaje] = useState(null);
  const [procesando, establecerProcesando] = useState(false);
  const bloqueado = useRef(false);
  const navegar = useNavigate();
  useTituloPagina("Checkout - Pastelería 1000 Sabores");
  const entrega = opcionesEntrega.find((opcion) => opcion.id === datos.entrega);
  function cambiarDato(evento) {
    establecerDatos((actuales) => ({
      ...actuales,
      [evento.target.name]: evento.target.value,
    }));
  }
  function comprar(evento) {
    evento.preventDefault();
    if (bloqueado.current) return;
    bloqueado.current = true;
    establecerProcesando(true);
    try {
      const resultado = confirmarCompra(datos);
      navegar(
        resultado.aprobado
          ? "/compra/" + resultado.pedido.id
          : "/compra-fallida",
      );
    } catch (error) {
      establecerMensaje(error.message);
      bloqueado.current = false;
      establecerProcesando(false);
    }
  }
  return (
    <>
      <BarraNavegacion />
      <main className="container my-5">
        <h1 className="tituloFormulario">Finalizar compra</h1>
        {!carrito.length ? (
          <Alerta>
            Tu carrito está vacío.{" "}
            <Link to="/pasteleria">Volver al catálogo</Link>
          </Alerta>
        ) : (
          <div className="row g-4">
            <div className="col-12 col-lg-7">
              <form
                id="form-checkout"
                onSubmit={comprar}
                className="tarjetaFormulario mx-auto"
              >
                {mensaje && (
                  <Alerta tipo="danger" como="p">
                    {mensaje}
                  </Alerta>
                )}
                {[
                  {
                    nombre: "nombre",
                    etiqueta: "Nombre completo",
                    autocompletar: "name",
                  },
                  {
                    nombre: "email",
                    etiqueta: "Correo electrónico",
                    tipo: "email",
                    autocompletar: "email",
                  },
                  {
                    nombre: "direccion",
                    etiqueta: "Dirección",
                    autocompletar: "street-address",
                  },
                  {
                    nombre: "comuna",
                    etiqueta: "Comuna",
                    autocompletar: "address-level2",
                  },
                  {
                    nombre: "region",
                    etiqueta: "Región",
                    autocompletar: "address-level1",
                  },
                ].map((campo) => (
                  <div className="mb-3" key={campo.nombre}>
                    <label
                      className="form-label"
                      htmlFor={"checkout-" + campo.nombre}
                    >
                      {campo.etiqueta}
                    </label>
                    <input
                      id={"checkout-" + campo.nombre}
                      name={campo.nombre}
                      type={campo.tipo || "text"}
                      autoComplete={campo.autocompletar}
                      required
                      value={datos[campo.nombre]}
                      onChange={cambiarDato}
                      className="form-control"
                    />
                  </div>
                ))}
                <div className="mb-3">
                  <label className="form-label" htmlFor="checkout-entrega">
                    Opción de entrega
                  </label>
                  <select
                    id="checkout-entrega"
                    name="entrega"
                    className="form-select"
                    value={datos.entrega}
                    onChange={cambiarDato}
                  >
                    {opcionesEntrega.map((opcion) => (
                      <option key={opcion.id} value={opcion.id}>
                        {opcion.nombre} · {formatearPrecio(opcion.costo)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="checkout-pago">
                    Resultado del pago simulado
                  </label>
                  <select
                    id="checkout-pago"
                    name="pago"
                    className="form-select"
                    value={datos.pago}
                    onChange={cambiarDato}
                  >
                    <option value="aprobado">Pago aprobado</option>
                    <option value="rechazado">Pago rechazado</option>
                  </select>
                  <p className="form-text">
                    Esta compra es una demostración y no realiza cargos reales.
                  </p>
                </div>
                <button
                  type="submit"
                  className="btn botonPasteleria"
                  disabled={procesando}
                >
                  {procesando ? "Procesando…" : "Confirmar compra"}
                </button>
              </form>
            </div>
            <aside className="col-12 col-lg-5">
              <div className="card">
                <div className="card-body">
                  <h2 className="h4">Resumen de compra</h2>
                  <ul className="list-group list-group-flush">
                    {carrito.map((producto) => (
                      <li key={producto.id} className="list-group-item px-0">
                        {producto.cantidad} × {producto.titulo}:{" "}
                        {formatearPrecio(
                          precioFinal(producto) * producto.cantidad,
                        )}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3">
                    Productos: {formatearPrecio(totalCarrito(carrito))}
                  </p>
                  <p>Entrega: {formatearPrecio(entrega.costo)}</p>
                  <p className="h4">
                    Total:{" "}
                    <span id="checkout-total">
                      {formatearPrecio(totalCarrito(carrito) + entrega.costo)}
                    </span>
                  </p>
                  <Link to="/carrito">Revisar carrito</Link>
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>
      <PiePagina />
    </>
  );
}
