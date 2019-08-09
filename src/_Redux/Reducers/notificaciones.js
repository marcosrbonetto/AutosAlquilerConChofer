import { NOTIFICACIONES_SET } from "@Redux/Constants/index";

const initialState = {
  notificaciones: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case NOTIFICACIONES_SET: {
      let notificaciones = this.state.notificaciones;
      notificaciones.concat(action.payload);
      return { ...state, notificaciones: notificaciones };
    }
    default:
      return state;
  }
};
export default reducer;
