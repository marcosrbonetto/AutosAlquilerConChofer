import _ from "lodash";

const metodos = {
  getInscripcionesPorDni: async dni => {
    try {
      let url = `${window.Config.WS}/v1/Reporte/GetInscripcionesPorDni?dni=${dni}`;

      let data = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "--Token": localStorage.getItem("token")
        }
      });
      if (data.ok != true) {
        throw new Error(data.statusText || "Error procesando la solicitud");
      }

      data = await data.json();
      if (data.ok != true) {
        throw new Error(data.error);
      }

      return data.return;
    } catch (ex) {
      console.log(ex);
      let mensaje = typeof ex === "object" ? ex.message : "Error procesando la solicitud";
      throw new Error(mensaje);
    }
  },
  getInscripcionesPorChapa: async (tipo, licencia) => {
    try {
      let url = `${window.Config.WS}/v1/Reporte/GetInscripcionesPorChapa?tipoAuto=${tipo}&numero=${licencia}`;

      let data = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "--Token": localStorage.getItem("token")
        }
      });
      if (data.ok != true) {
        throw new Error(data.statusText || "Error procesando la solicitud");
      }

      data = await data.json();
      if (data.ok != true) {
        throw new Error(data.error);
      }

      return data.return;
    } catch (ex) {
      console.log(ex);
      let mensaje = typeof ex === "object" ? ex.message : "Error procesando la solicitud";
      throw new Error(mensaje);
    }
  }
};

export default metodos;
