import _ from "lodash";

const metodos = {
  procesarLogin: token => {
    return new Promise(async (resolve, reject) => {
      try {
        let resultado = await metodos.validarToken(token);
        if (resultado == false) {
          reject("token_invalido");
          return;
        }

        let datos = await metodos.datos(token);
        resolve({ usuario: datos, token: token });
      } catch (ex) {
        console.log(ex);
        let mensaje = typeof ex === "object" ? ex.message : "Error procesando la solicitud";
        reject(mensaje);
      }
    });
  },

  validarToken: token => {
    const url = window.Config.WS + "/v1/MuniOnlineUsuario/ValidarToken";
    return new Promise(async (resolve, reject) => {
      try {
        let data = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "--Token": token
          }
        });
        if (data.ok != true) {
          reject("Error procesando la solicitud");
          return;
        }

        data = await data.json();
        if (data.ok != true) {
          reject(data.error);
          return;
        }

        resolve(data.return);
      } catch (ex) {
        console.log(ex);
        let mensaje = typeof ex === "object" ? ex.message : "Error procesando la solicitud";
        reject(mensaje);
      }
    });
  },
  datos: token => {
    const url = window.Config.WS + "/v1/MuniOnlineUsuario";
    return new Promise(async (resolve, reject) => {
      try {
        let data = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "--Token": token
          }
        });
        if (data.ok != true) {
          reject("Error procesando la solicitud");
          return;
        }

        data = await data.json();
        if (data.ok != true) {
          reject(data.error);
          return;
        }

        resolve(data.return);
      } catch (ex) {
        console.log(ex);
        let mensaje = typeof ex === "object" ? ex.message : "Error procesando la solicitud";
        reject(mensaje);
      }
    });
  }
};

export default metodos;
