import { USUARIO_LOGIN, USUARIO_CERRAR_SESION } from "@Redux/Constants/index";

export const login = comando => ({ type: USUARIO_LOGIN, payload: comando });
export const cerrarSesion = () => ({ type: USUARIO_CERRAR_SESION });
