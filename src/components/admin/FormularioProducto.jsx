import { useState } from "react";

function Campo({ name, label, type = "text", ...atributos }) {
  return (
    <div className="mb-3">
      <label htmlFor={`producto-${name}`} className="form-label">
        {label}
      </label>
      <input
        id={`producto-${name}`}
        name={name}
        type={type}
        className="form-control"
        required
        {...atributos}
      />
    </div>
  );
}

export default function FormularioProducto({ onGuardar }) {
  const [mensaje, setMensaje] = useState(null);

  function enviar(event) {
    event.preventDefault();

    const formulario = event.currentTarget;
    const datos = Object.fromEntries(new FormData(formulario));

    try {
      onGuardar(datos);
      formulario.reset();
      setMensaje({
        tipo: "success",
        texto: "Producto creado correctamente.",
      });
    } catch (error) {
      setMensaje({
        tipo: "danger",
        texto: error.message,
      });
    }
  }

  return (
    <form onSubmit={enviar} className="border rounded p-4 mb-4">
      <h3 className="h4 mb-3">Crear producto</h3>

      {mensaje && (
        <div
          className={`alert alert-${mensaje.tipo}`}
          role={mensaje.tipo === "danger" ? "alert" : "status"}
        >
          {mensaje.texto}
        </div>
      )}

      <Campo name="titulo" label="Nombre del producto" />
      <Campo name="descripcion" label="Descripción" />
      <Campo
        name="imagen"
        label="Ruta o URL de la imagen"
        placeholder="/Pasteleria/img/pchoco.jpg"
      />
      <Campo
        name="precio"
        label="Precio en pesos"
        type="number"
        min="1"
        step="1"
      />
      <Campo
        name="descuento"
        label="Descuento (%)"
        type="number"
        min="0"
        max="100"
        defaultValue="0"
      />

      <div className="mb-3">
        <label htmlFor="producto-categoria" className="form-label">
          Categoría
        </label>
        <select
          id="producto-categoria"
          name="categoria"
          className="form-select"
          defaultValue="pasteleria"
          required
        >
          <option value="pasteleria">Pastelería</option>
          <option value="panaderia">Panadería</option>
          <option value="salados">Salados</option>
          <option value="sin-azucar">Sin azúcar</option>
        </select>
      </div>

      <button type="submit" className="btn btn-outline-dark">
        Guardar producto
      </button>
    </form>
  );
}