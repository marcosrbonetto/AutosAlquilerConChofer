import { ALERTA_SHOW, ALERTA_HIDE } from "@Redux/Constants/index";
import _ from "lodash";

const initialState = {
  alertas: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ALERTA_SHOW: {
      return { ...state, alertas: [...state.alertas, action.payload] };
    }

    case ALERTA_HIDE: {

      //Busco la alerta y la pongo NO visible
      let alerta = _.find(state.alertas, alerta => {
        return alerta.id === action.payload.id;
      });
      alerta.visible = false;

      //Busco el resto de las alertas
      let alertas = _.filter(state.alertas, alerta => {
        return alerta.id !== action.payload.id;
      });

      return { ...state, alertas: [...alertas, alerta] };
    }
    default:
      return state;
  }
};
export default reducer;
