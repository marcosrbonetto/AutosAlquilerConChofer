import { DRAWER_TOGGLE } from "@Redux/Constants/index";

const initialState = {
  open: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case DRAWER_TOGGLE: {
      return { ...state, open: !state.open };
    }
    default:
      return state;
  }
};
export default reducer;
