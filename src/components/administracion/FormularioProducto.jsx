import { useState } from "react";
import { categorias } from "../../data/categorias.js";
import AlertaFormulario from "../alerta/alertaFormulario.jsx";
function Campo({ name, etiqueta, type = "text", ...atributos }) {
  return (
    <div className="mb-3">
      <label htmlFor={"producto-" + name} className="form-label">
        {etiqueta}
      </label>
      <input
        id={"producto-" + name}
        name={name}
        type={type}
        className="form-control"
        required
        {...atributos}
      />
    </div>
  );
}
export default function FormularioProducto({
  onGuardar,
  producto,
  onCancelar,
}) {
  const [mensaje, establecerMensaje] = useState(null);
  function enviar(evento) {
    evento.preventDefault();
    const formulario = evento.currentTarget;
    try {
      onGuardar(Object.fromEntries(new FormData(formulario)));
      if (!producto) formulario.reset();
      establecerMensaje({
        tipo: "success",
        texto: producto
          ? "Producto actualizado correctamente."
          : "Producto creado correctamente.",
      });
    } catch (error) {
      establecerMensaje({ tipo: "danger", texto: error.message });
    }
  }
  return (
    <form onSubmit={enviar} className="border rounded p-4 mb-4">
      <h3 className="h4 mb-3">
        {producto ? "Editar producto" : "Crear producto"}
      </h3>
      <AlertaFormulario mensaje={mensaje} />
      <Campo
        name="titulo"
        etiqueta="Nombre del producto"
        defaultValue={producto?.titulo ?? ""}
      />
      <Campo
        name="descripcion"
        etiqueta="Descripción"
        defaultValue={producto?.descripcion ?? ""}
      />
      <Campo
        name="imagen"
        etiqueta="Ruta o URL de la imagen"
        placeholder="/Pasteleria/img/pchoco.jpg"
        defaultValue={producto?.imagen ?? ""}
      />
      <Campo
        name="precio"
        etiqueta="Precio en pesos"
        type="number"
        min="1"
        step="1"
        defaultValue={producto?.precio ?? ""}
      />
      <Campo
        name="descuento"
        etiqueta="Descuento (%)"
        type="number"
        min="0"
        max="100"
        step="0.01"
        defaultValue={producto?.descuento ?? 0}
      />
      <div className="mb-3">
        <label htmlFor="producto-categoria" className="form-label">
          Categoría
        </label>
        <select
          id="producto-categoria"
          name="categoria"
          className="form-select"
          defaultValue={producto?.categoria ?? "pasteleria"}
          required
        >
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nombre}
            </option>
          ))}
        </select>
      </div>
      <div className="d-flex flex-wrap gap-2">
        <button type="submit" className="btn btn-outline-dark">
          {producto ? "Guardar cambios" : "Guardar producto"}
        </button>
        {producto && (
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onCancelar}
          >
            Cancelar edición
          </button>
        )}
      </div>
    </form>
  );
}
