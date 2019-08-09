import { TIPO_AUTO_SET_DATA } from "@Redux/Constants/index";

export const setData = comando => ({ type: TIPO_AUTO_SET_DATA, payload: comando });
