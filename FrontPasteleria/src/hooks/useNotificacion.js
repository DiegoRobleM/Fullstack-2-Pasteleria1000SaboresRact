import { useEffect, useRef, useState } from "react";
export function useNotificacion() {
  const [visible, establecerVisible] = useState(null);
  const temporizador = useRef(null);
  useEffect(() => () => clearTimeout(temporizador.current), []);
  function notificar() {
    clearTimeout(temporizador.current);
    establecerVisible(true);
    temporizador.current = setTimeout(() => establecerVisible(false), 3000);
  }
  return { visible, notificar };
}
