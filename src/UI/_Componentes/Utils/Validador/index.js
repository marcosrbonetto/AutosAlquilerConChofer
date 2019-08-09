import _ from "lodash";

const metodos = {
  requerido: (input, mensaje) => {
    if (mensaje == undefined || mensaje.trim().length == 0)
      mensaje = "Dato requerido";

    if (input == undefined || input.trim().length == 0) return mensaje;
    return undefined;
  },
  min: (input, length, mensaje) => {
    if (input == undefined || input.length == 0) return undefined;

    if (mensaje == undefined || mensaje.trim().length == 0)
      mensaje = `Al menos ${length} caracteres`;

    if (input == undefined || input.trim().length < length) return mensaje;
    return undefined;
  },
  max: (input, length, mensaje) => {
    if (input == undefined || input.length == 0) return undefined;

    if (mensaje == undefined || mensaje.trim().length == 0)
      mensaje = `Máximo ${length} caracteres`;

    if (input == undefined || input.trim().length > length) return mensaje;
    return undefined;
  },
  email: (input, mensaje) => {
    if (input == undefined || input.length == 0) return undefined;

    if (mensaje == undefined || mensaje.trim().length == 0)
      mensaje = "Dato inválido";

    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let valido = re.test(input);
    if (valido == false) return mensaje;
    return undefined;
  },
  numerico: (input, mensaje) => {
    if (input == undefined || input.length == 0) return undefined;

    if (mensaje == undefined || mensaje.trim().length == 0)
      mensaje = "Dato inválido";

    let re = /[+-]?(?=\.\d|\d)(?:\d+)?(?:\.?\d*)(?:[eE][+-]?\d+)?/;
    let valido = re.test(input);
    return valido ? undefined : mensaje;
  },
  numericoEntero: (input, mensaje) => {
    if (input == undefined || input.length == 0) return undefined;

    if (mensaje == undefined || mensaje.trim().length == 0)
      mensaje = "Dato inválido";

    let re = /^-?\d+$/;
    let valido = re.test(input);
    return valido ? undefined : mensaje;
  },
  iguales: (input, input2, mensaje) => {
    if (mensaje == undefined || mensaje.trim().length == 0)
      mensaje = "Los datos ingresados no son iguales";

    if (input != input2) return mensaje;
    return undefined;
  },
  validar(validaciones, input) {
    let mensaje = undefined;

    _.forEach(validaciones, validacion => {
      if (typeof validacion === "function") {
        let error = validacion(input);
        if (error != undefined) {
          mensaje = error;
          return false;
        }
      } else {
        let error = validacion;
        if (error != undefined) {
          mensaje = error;
          return false;
        }
      }
    });

    return mensaje;
  }
};

export default metodos;
