import { Link } from "react-router-dom";
import estilos from "./estructura.module.css";
export function PiePagina() {
  return (
    <mi-footer>
      {"\n        "}
      <footer className={`text-white py-3 ${estilos.piePagina}`}>
        {"\n            "}
        <div className="container d-flex justify-content-center align-items-center gap-4">
          {"\n\n                "}
          <p className="mb-0">{`
                    © ${new Date().getFullYear()} Pastelería 1000 Sabores. Todos los derechos reservados.
                `}</p>
          {"\n\n                "}
          <nav className="d-flex gap-3">
            {"\n                    "}
            <a href="#" className="text-decoration-none text-white">
              {
                "\n                        Política de Privacidad\n                    "
              }
            </a>
            {"\n\n                    "}
            <a href="#" className="text-decoration-none text-white">
              {
                "\n                        Términos de Servicio\n                    "
              }
            </a>
            {"\n\n                    "}
            <Link to="/contacto" className="text-decoration-none text-white">
              {"\n                        Contacto\n                    "}
            </Link>
            {"\n                "}
          </nav>
          {"\n\n            "}
        </div>
        {"\n        "}
      </footer>
      {"\n        "}
    </mi-footer>
  );
}
