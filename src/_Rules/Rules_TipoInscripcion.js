import _ from "lodash";

const metodos = {
  get: async () => {
    try {
      let url = `${window.Config.WS}/v1/TipoInscripcion`;

      let data = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "--Token": localStorage.getItem("token")
        }
      });
      if (data.ok != true) {
        throw new Error("Error procesando la solicitud");
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
