import _ from "lodash";

const metodos = {
  esOperador: async () => {
    try {
      const url = `${window.Config.WS}/v1/MuniOnlineUsuario/EsOperador`;

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
        return;
      }

      return data.return;
    } catch (ex) {
      console.log(ex);
      let mensaje = typeof ex === "object" ? ex.message : "Error procesando la solicitud";
      throw new Error(mensaje);
    }
  },
  nuevo: async comando => {
    try {
      const url = `${window.Config.WS}/v1/Usuario`;

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
      const url = `${window.Config.WS}/v1/Usuario`;

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
      let url = `${window.Config.WS}/v1/Usuario/Favorito?id=${id}`;

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
      const url = `${window.Config.WS}/v1/Usuario?id=${id}`;

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
      const url = `${window.Config.WS}/v1/Usuario/Buscar`;

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
  buscarPaginado: async comando => {
    try {
      const url = `${window.Config.WS}/v1/Usuario/BuscarPaginado`;

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
      const url = `${window.Config.WS}/v1/Usuario/Detalle?id=${id}`;

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
      const url = `${window.Config.WS}/v1/Usuario/CantidadConError`;

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
