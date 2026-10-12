import { Fragment, useEffect, useRef, useState } from "react";
import { useStore } from "../context/StoreContext.jsx";
import { createDemoAdministrator, register, login } from "../services/auth.js";
import { readArray } from "../utils/storage.js";
import { ProductCards } from "../components/products/ProductCards.jsx";
import { CartRows } from "../components/cart/CartRows.jsx";
import { price } from "../utils/formatPrice.js";
import { contact } from "../services/contact.js";
import FormularioProducto from "../components/admin/FormularioProducto.jsx";
import { crearProducto } from "../services/productos.js";
import TablaProductos from "../components/admin/TablaProductos.jsx";

const categories = {
  Pasteleria: "pasteleria",
  Panaderia: "panaderia",
  Salados: "salados",
  SinAzucar: "sin-azucar",
};

function category(product) {
  if (product.id.startsWith("pasteleria-")) return "Pastelería";
  if (product.id.startsWith("panaderia-")) return "Panadería";
  if (product.id.startsWith("salados-")) return "Productos salados";
  if (product.id.startsWith("sin-azucar-")) return "Productos sin azúcar";
  return "Producto";
}

export function usePageBindings(name) {
  const { productos, refrescarProductos, cart, user, add, saveCart, logout } =
    useStore();
  const [message, setMessage] = useState(null);
  const [toast, setToast] = useState(null);
  const [quantity, setQuantity] = useState("1");
  const [open, setOpen] = useState({});
  const [queries, setQueries] = useState([]);
  const [users, setUsers] = useState([]);
  const [selected] = useState(() =>
    name === "DetalleProducto"
      ? JSON.parse(sessionStorage.getItem("productoSeleccionado"))
      : null,
  );
  const timers = useRef([]);
  const quantityInput = useRef(null);
  const messageElement = useRef(null);

  useEffect(() => {
    if (name === "InicioSesion") createDemoAdministrator();
    if ((name === "PerfilUsuario" || name === "Administrador") && !user)
      window.location.replace("../InicioSesion/iniciosesion.html");
    else if (name === "Administrador" && user.rol !== "admin")
      window.location.replace("../Inicio/index.html");
    if (selected)
      document.title = `${selected.titulo} | Pastelería 1000 Sabores`;
    return () => timers.current.forEach(clearTimeout);
  }, [name, selected, user]);

  useEffect(() => {
    if (message && name === "RegistroUsuario")
      messageElement.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
  }, [message, name]);

  const props = {};
  const content = {};
  function notify() {
    setToast(true);
    timers.current.push(setTimeout(() => setToast(false), 3000));
  }

  if (categories[name]) {
    const productosCategoria = productos.filter(
      (producto) => producto.categoria === categories[name],
    );

    content.catalogo = (
      <ProductCards products={productosCategoria} notify={notify} />
    );

    props["toast-notificacion"] = {
      className: toast ? "toast-visible" : "toast-oculto",
    };
  }

  if (name === "Carrito") {
    content.carrito = <CartRows />;
    content.total = price(
      cart.reduce(
        (total, product) => total + product.precio * product.cantidad,
        0,
      ),
    );
    props["btn-vaciar"] = {
      className:
        "btn btn-outline-secondary mt-3" + (!cart.length ? " d-none" : ""),
      onClick: () => saveCart([]),
    };
  }

  if (name === "DetalleProducto") {
    if (selected) {
      props["detalle-imagen"] = { src: selected.imagen, alt: selected.titulo };
      content["detalle-categoria"] = category(selected);
      content["detalle-titulo"] = selected.titulo;
      content["detalle-descripcion"] = selected.descripcion;
      content["detalle-precio"] = price(selected.precio);
      props["btn-agregar-detalle"] = {
        disabled: false,
        onClick: () => {
          const number = Number.parseInt(quantity, 10);
          if (!Number.isInteger(number) || number < 1) {
            setQuantity("1");
            quantityInput.current?.focus();
            return;
          }
          add(selected, number);
          notify();
        },
      };
    } else {
      props["detalle-producto"] = {
        className: "row g-4 align-items-center d-none",
      };
      props["mensaje-detalle"] = { className: "alert alert-warning" };
      content["mensaje-detalle"] = (
        <>
          No hay un producto seleccionado.{" "}
          <a href="../Pasteleria/pasteleria.html" className="alert-link">
            Volver al catálogo
          </a>
        </>
      );
    }
    props["detalle-cantidad"] = {
      defaultValue: undefined,
      value: quantity,
      onChange: (event) => setQuantity(event.target.value),
      ref: quantityInput,
    };
    props["btn-volver-catalogo"] = {
      onClick: () => {
        window.location.href =
          selected?.paginaOrigen || "../Pasteleria/pasteleria.html";
      },
    };
    props["mensaje-carrito"] = {
      className:
        toast === null
          ? "alert alert-success d-none mt-4"
          : toast
            ? "toast-visible"
            : "toast-oculto",
    };
    if (toast !== null)
      content["mensaje-carrito"] = "🍰 ¡PRODUCTO AGREGADO A TU CARRITO!";
  }

  const forms = {
    RegistroUsuario: {
      id: "form-registro",
      messageId: "mensaje-registro",
      submit: register,
    },
    InicioSesion: {
      id: "form-inicio-sesion",
      messageId: "mensaje-login",
      submit: login,
    },
    Contacto: {
      id: "form-contacto",
      messageId: "mensaje-contacto",
      submit: contact,
    },
  };
  if (forms[name]) {
    const form = forms[name];
    props[form.id] = {
      onSubmit: (event) => {
        event.preventDefault();
        const element = event.currentTarget;
        const result = form.submit(new FormData(element));
        setMessage(result);
        if (result.clearPassword) element.elements.password.value = "";
        if (result.focus) element.querySelector(`#${result.focus}`)?.focus();
        if (result.type === "success" && name !== "InicioSesion")
          element.reset();
        if (result.redirect)
          timers.current.push(
            setTimeout(() => {
              window.location.href = result.redirect;
            }, result.delay),
          );
      },
    };
    props[form.messageId] = {
      className: message ? `alert alert-${message.type}` : "alert d-none",
      ref: messageElement,
    };
    if (message)
      content[form.messageId] = Array.isArray(message.text)
        ? message.text.map((text, index) => (
            <Fragment key={text}>
              {index > 0 && <br />}
              {text}
            </Fragment>
          ))
        : message.text;
  }

  if (name === "PerfilUsuario" && user) {
    content["perfil-nombre"] = `${user.nombre} ${user.apellido}`;
    content["perfil-email"] = user.email;
    content["perfil-direccion"] = [
      user.direccion,
      user.tipoPropiedad,
      user.comuna,
    ]
      .filter(Boolean)
      .join(", ");
    props["btn-cerrar-sesion"] = { onClick: logout };
  }

  if (name === "Administrador" && user?.rol === "admin") {
    props["panel-admin"] = { className: "container py-5" };
    content["saludo-admin"] =
      `Sesión iniciada como ${user.nombre} ${user.apellido}.`;
    content["formulario-producto"] = (
      <FormularioProducto
        onGuardar={(datos) => {
          crearProducto(datos);
          refrescarProductos();
        }}
      />
    );

    content["tabla-productos"] = <TablaProductos productos={productos} />;

    for (const section of ["consultas", "productos", "usuarios"]) {
      props[`seccion-${section}`] = {
        className: "mt-5" + (open[section] ? "" : " d-none"),
      };
      props[`btn-ver-${section}`] = {
        onClick: () => {
          if (section === "consultas")
            setQueries(
              readArray("consultasContacto").sort(
                (a, b) => new Date(b.fecha) - new Date(a.fecha),
              ),
            );
          if (section === "usuarios")
            setUsers(readArray("usuariosRegistrados"));
          setOpen((previous) => ({ ...previous, [section]: true }));
          requestAnimationFrame(() =>
            document
              .getElementById(`seccion-${section}`)
              ?.scrollIntoView({ behavior: "smooth", block: "start" }),
          );
        },
      };
    }
    content["total-consultas"] = queries.length;
    content["total-usuarios"] = users.length;
    for (const [section, rows] of [
      ["consultas", queries],
      ["usuarios", users],
    ]) {
      props[`sin-${section}`] = {
        className: "alert alert-info" + (rows.length ? " d-none" : ""),
      };
      props[`contenedor-tabla-${section}`] = {
        className: "table-responsive" + (!rows.length ? " d-none" : ""),
      };
    }
    content["tabla-consultas"] = queries.map((query) => (
      <tr key={query.id} data-consulta-id={query.id}>
        <td>{new Date(query.fecha).toLocaleString("es-CL")}</td>
        <td>{query.correo}</td>
        <td className="celda-consulta">{query.mensaje}</td>
        <td>
          <select
            className="form-select form-select-sm"
            aria-label={`Cambiar estado de la consulta de ${query.correo}`}
            value={query.estado || "pendiente"}
            onChange={(event) => {
              const next = readArray("consultasContacto");
              const found = next.find((item) => item.id === query.id);
              if (!found) return;
              found.estado = event.target.value;
              localStorage.setItem("consultasContacto", JSON.stringify(next));
              setQueries(
                next.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)),
              );
            }}
          >
            <option value="pendiente">Pendiente</option>
            <option value="en revisión">En revisión</option>
            <option value="resuelta">Resuelta</option>
          </select>
        </td>
      </tr>
    ));
    content["tabla-usuarios"] = users.map((account, index) => (
      <tr key={index}>
        <td>
          {`${account.nombre || ""} ${account.apellido || ""}`.trim() ||
            "Sin nombre"}
        </td>
        <td>{account.email || "No indicado"}</td>
        <td>{account.region || "No indicada"}</td>
        <td>{account.comuna || "No indicada"}</td>
        <td>{account.tipoPropiedad || "No indicada"}</td>
        <td>
          <span
            className={
              account.rol === "admin"
                ? "badge text-bg-danger"
                : "badge text-bg-secondary"
            }
          >
            {account.rol === "admin" ? "Administrador" : "Cliente"}
          </span>
        </td>
      </tr>
    ));
  }
  return { props, content };
}
