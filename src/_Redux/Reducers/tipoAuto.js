import _ from "lodash";
import { TIPO_AUTO_SET_DATA } from "@Redux/Constants/index";

const initialState = {
  data: undefined
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case TIPO_AUTO_SET_DATA: {
      return { ...state, data: action.payload };
    }

    default:
      return state;
  }
};
export default reducer;
