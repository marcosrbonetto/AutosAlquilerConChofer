import { MAIN_CONTENT_CARGANDO } from "@Redux/Constants/index";

export const mostrarCargando = cargando => ({
  type: MAIN_CONTENT_CARGANDO,
  payload: cargando
});
