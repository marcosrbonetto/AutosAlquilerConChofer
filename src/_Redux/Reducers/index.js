import Usuario from "./usuario";
import Alerta from "./alerta";
import MainContent from "./mainContent";
import Notificaciones from "./notificaciones";
import General from "./general";
import Drawer from "./drawer";
import TipoAuto from "./tipoAuto";
import TipoInscripcion from "./tipoInscripcion";
import TipoCondicion from "./tipoCondicion";
import TipoInhabilitacion from "./tipoInhabilitacion";

import { combineReducers } from "redux";

const rootReducer = combineReducers({
  Usuario,
  Alerta,
  MainContent,
  Notificaciones,
  General,
  Drawer,
  TipoAuto,
  TipoInscripcion,
  TipoCondicion,
  TipoInhabilitacion
});

export default rootReducer;
