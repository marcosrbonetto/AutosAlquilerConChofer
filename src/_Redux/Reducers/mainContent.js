import { MAIN_CONTENT_CARGANDO } from "@Redux/Constants/index";

const initialState = {
  cargando: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case MAIN_CONTENT_CARGANDO: {
      return { ...state, cargando: action.payload };
    }
    default:
      return state;
  }
};
export default reducer;
