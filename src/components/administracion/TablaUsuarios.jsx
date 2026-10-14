export default function TablaUsuarios({ usuarios }) {
  return (
    <div className="table-responsive">
      <table className="table table-striped align-middle">
        <thead>
          <tr>
            {[
              "Nombre",
              "Correo",
              "Región",
              "Comuna",
              "Tipo de propiedad",
              "Rol",
            ].map((titulo) => (
              <th key={titulo} scope="col">
                {titulo}
              </th>
            ))}
          </tr>
        </thead>
        <tbody id="tabla-usuarios">
          {usuarios.map((usuario, indice) => (
            <tr key={usuario.email || indice}>
              <td>
                {[usuario.nombre, usuario.apellido].filter(Boolean).join(" ") ||
                  "Sin nombre"}
              </td>
              <td>{usuario.email || "No indicado"}</td>
              <td>{usuario.region || "No indicada"}</td>
              <td>{usuario.comuna || "No indicada"}</td>
              <td>{usuario.tipoPropiedad || "No indicada"}</td>
              <td>
                <span
                  className={
                    usuario.rol === "admin"
                      ? "badge text-bg-danger"
                      : "badge text-bg-secondary"
                  }
                >
                  {usuario.rol === "admin" ? "Administrador" : "Cliente"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
