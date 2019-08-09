import { GENERAL_VISIBLE } from "@Redux/Constants/index";

const initialState = {
  visible: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GENERAL_VISIBLE: {
      return { ...state, visible: action.payload };
    }

    default:
      return state;
  }
};
export default reducer;
