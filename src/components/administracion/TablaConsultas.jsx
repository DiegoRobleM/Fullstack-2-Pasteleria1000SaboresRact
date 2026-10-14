import estilos from "./consulta.module.css";
export default function TablaConsultas({ consultas, onCambiarEstado }) {
  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover align-middle">
        <thead>
          <tr>
            <th scope="col">Fecha</th>
            <th scope="col">Correo</th>
            <th scope="col">Consulta</th>
            <th scope="col">Estado</th>
          </tr>
        </thead>
        <tbody id="tabla-consultas">
          {consultas.map((consulta) => (
            <tr key={consulta.id}>
              <td>{new Date(consulta.fecha).toLocaleString("es-CL")}</td>
              <td>{consulta.correo}</td>
              <td className={estilos.celdaConsulta}>{consulta.mensaje}</td>
              <td>
                <select
                  className="form-select form-select-sm"
                  aria-label={
                    "Cambiar estado de la consulta de " + consulta.correo
                  }
                  value={consulta.estado || "pendiente"}
                  onChange={(evento) =>
                    onCambiarEstado(consulta.id, evento.target.value)
                  }
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="en revisión">En revisión</option>
                  <option value="resuelta">Resuelta</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
