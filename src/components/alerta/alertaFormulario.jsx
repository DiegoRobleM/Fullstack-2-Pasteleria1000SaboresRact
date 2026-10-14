import { Fragment } from "react";
import Alerta from "./alerta.jsx";

export default function AlertaFormulario({ mensaje, ...atributos }) {
  return (
    <Alerta {...atributos} tipo={mensaje?.tipo} visible={Boolean(mensaje)}>
      {Array.isArray(mensaje?.texto)
        ? mensaje.texto.map((texto, indice) => (
            <Fragment key={indice}>
              {indice > 0 && <br />}
              {texto}
            </Fragment>
          ))
        : mensaje?.texto}
    </Alerta>
  );
}
