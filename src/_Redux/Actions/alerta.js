import { ALERTA_SHOW, ALERTA_HIDE } from "@Redux/Constants/index";
import red from "@material-ui/core/colors/red";
import orange from "@material-ui/core/colors/orange";
import green from "@material-ui/core/colors/green";
import grey from "@material-ui/core/colors/grey";

let id = 0;

const procesarAlerta = alerta => {
  id = id + 1;
  alerta.id = id;
  alerta.visible = true;

  //Icono cerrar
  if (!("mostrarIconoCerrar" in alerta)) {
    alerta.mostrarIconoCerrar = false;
  }

  return {
    type: ALERTA_SHOW,
    payload: alerta
  };
};

export const mostrarAlerta = alerta => {
  if (!("color" in alerta)) {
    alerta.color = grey["800"];
  }
  return procesarAlerta(alerta);
};

export const mostrarAlertaVerde = alerta => {
  alerta.color = green["500"];
  return procesarAlerta(alerta);
};

export const mostrarAlertaRoja = alerta => {
  alerta.color = red["500"];
  return procesarAlerta(alerta);
};

export const mostrarAlertaNaranja = alerta => {
  alerta.color = orange["500"];
  return procesarAlerta(alerta);
};

export const ocultarAlerta = id => ({
  type: ALERTA_HIDE,
  payload: { id: id }
});
