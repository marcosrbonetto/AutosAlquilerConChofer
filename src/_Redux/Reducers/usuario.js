import _ from "lodash";
import { USUARIO_LOGIN, USUARIO_CERRAR_SESION } from "@Redux/Constants/index";

const initialState = {
  usuario: undefined,
  token: undefined
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case USUARIO_LOGIN: {
      localStorage.setItem("token", action.payload.token);
      return { ...state, usuario: action.payload.usuario, token: action.payload.token };
    }

    case USUARIO_CERRAR_SESION: {
      localStorage.removeItem("token");
      return { ...state, usuario: undefined, token: undefined };
    }
    default:
      return state;
  }
};
export default reducer;
