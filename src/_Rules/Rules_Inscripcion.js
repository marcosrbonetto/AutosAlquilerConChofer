import _ from "lodash";

const metodos = {
  insertar: async comando => {
    try {
      let url = `${window.Config.WS}/v1/Inscripcion`;

      let data = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "--Token": localStorage.getItem("token")
        },
        body: JSON.stringify(comando)
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
  },
  actualizar: async comando => {
    try {
      let url = `${window.Config.WS}/v1/Inscripcion`;

      let data = await fetch(url, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "--Token": localStorage.getItem("token")
        },
        body: JSON.stringify(comando)
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
  },
  toggleFavorito: async id => {
    try {
      let url = `${window.Config.WS}/v1/Inscripcion/Favorito?id=${id}`;

      let data = await fetch(url, {
        method: "PUT",
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
  },
  borrar: async id => {
    try {
      let url = `${window.Config.WS}/v1/Inscripcion?id=${id}`;

      let data = await fetch(url, {
        method: "DELETE",
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
  },
  buscar: async comando => {
    try {
      let url = `${window.Config.WS}/v1/Inscripcion/BuscarPaginado`;

      let data = await fetch(url, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "--Token": localStorage.getItem("token")
        },
        body: JSON.stringify(comando)
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
  },
  getDetalle: async id => {
    try {
      let url = `${window.Config.WS}/v1/Inscripcion/Detalle?id=${id}`;

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
  },
  getCantidadConError: async () => {
    try {
      const url = `${window.Config.WS}/v1/Inscripcion/CantidadConError`;

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
