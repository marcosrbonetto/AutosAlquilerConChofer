const metodos = {
  getUrlFotoMiniatura: (identificadorFotoPersonal, sexoMasculino) => {
    let urlFotoUsuario;
    if (identificadorFotoPersonal) {
      urlFotoUsuario = window.Config.URL_CORDOBA_FILES + "/Archivo/" + identificadorFotoPersonal + "/3";
    } else {
      if (sexoMasculino == undefined || sexoMasculino == true) {
        urlFotoUsuario = window.Config.URL_CORDOBA_FILES + "/Archivo/" + window.Config.IDENTIFICADOR_FOTO_DEFAULT_MALE + "/3";
      } else {
        urlFotoUsuario = window.Config.URL_CORDOBA_FILES + "/Archivo/" + window.Config.IDENTIFICADOR_FOTO_DEFAULT_FEMALE + "/3";
      }
    }

    return urlFotoUsuario;
  },
  getUrlFotoMediana: (identificadorFotoPersonal, sexoMasculino) => {
    let urlFotoUsuario;
    if (identificadorFotoPersonal) {
      urlFotoUsuario = window.Config.URL_CORDOBA_FILES + "/Archivo/" + identificadorFotoPersonal + "/2";
    } else {
      if (sexoMasculino == undefined || sexoMasculino == true) {
        urlFotoUsuario = window.Config.URL_CORDOBA_FILES + "/Archivo/" + window.Config.IDENTIFICADOR_FOTO_DEFAULT_MALE + "/3";
      } else {
        urlFotoUsuario = window.Config.URL_CORDOBA_FILES + "/Archivo/" + window.Config.IDENTIFICADOR_FOTO_DEFAULT_FEMALE + "/3";
      }
    }

    return urlFotoUsuario;
  },
  getUrlFotoGrande: (identificadorFotoPersonal, sexoMasculino) => {
    let urlFotoUsuario;
    if (identificadorFotoPersonal) {
      urlFotoUsuario = window.Config.URL_CORDOBA_FILES + "/Archivo/" + identificadorFotoPersonal + "/1";
    } else {
      if (sexoMasculino == undefined || sexoMasculino == true) {
        urlFotoUsuario = window.Config.URL_CORDOBA_FILES + "/Archivo/" + window.Config.IDENTIFICADOR_FOTO_DEFAULT_MALE + "/3";
      } else {
        urlFotoUsuario = window.Config.URL_CORDOBA_FILES + "/Archivo/" + window.Config.IDENTIFICADOR_FOTO_DEFAULT_FEMALE + "/3";
      }
    }

    return urlFotoUsuario;
  }
};

export default metodos;
