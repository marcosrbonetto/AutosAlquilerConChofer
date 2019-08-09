import React from "react";

//Styles
import styles from "./styles";
import { withStyles } from "@material-ui/core/styles";

//REDUX
import { connect } from "react-redux";
import { mostrarAlerta, mostrarAlertaNaranja, mostrarAlertaVerde } from "@Redux/Actions/alerta";

//Compontes
import _ from "lodash";

//Mis componentes
import MiDialogoForm from "@Componentes/MiDialogoForm";
import MiBaner from "@Componentes/MiBaner";

//Utils
import DateUtils from "@Componentes/Utils/Date";

//Rules
import Rules_Usuario from "@Rules/Rules_Usuario";

const mapStateToProps = state => {
  return {
    usuario: state.Usuario.usuario,
    token: state.Usuario.token
  };
};

const mapDispatchToProps = dispatch => ({
  mostrarAlerta: comando => {
    dispatch(mostrarAlerta(comando));
  },
  mostrarAlertaNaranja: comando => {
    dispatch(mostrarAlertaNaranja(comando));
  },
  mostrarAlertaVerde: comando => {
    dispatch(mostrarAlertaVerde(comando));
  }
});

class UsuarioNuevo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      usuarioRegistrado: undefined,
      cargando: false,
      errorMensaje: "",
      errorVisible: false
    };
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible != this.props.visible && nextProps.visible) {
      this.setState(
        {
          datos: undefined,
          usuarioRegistrado: undefined,
          cargando: false,
          errorVisible: false,
          errorMensaje: ""
        },
        () => {
          if (nextProps.editar == true) {
            this.buscarDatos(nextProps.id);
          }
        }
      );
    }
  }

  buscarDatos = async id => {
    this.setState({ cargando: true });
    var datosUsuario = await Rules_Usuario.getDetalle(id);
    this.setState({ datos: datosUsuario });
    if (this.callback) {
      let fechaNacimiento = null;
      if (datosUsuario.fechaNacimiento) {
        fechaNacimiento = DateUtils.toDate(datosUsuario.fechaNacimiento);
      }
      this.callback.setValores([
        {
          key: "nombre",
          value: datosUsuario.nombre || ""
        },
        {
          key: "apellido",
          value: datosUsuario.apellido || ""
        },
        {
          key: "fechaNacimiento",
          value: fechaNacimiento
        },
        {
          key: "dni",
          value: datosUsuario.dni || ""
        },
        {
          key: "sexo",
          value: datosUsuario.sexoMasculino == undefined ? "" : datosUsuario.sexoMasculino ? "1" : "0"
        },
        {
          key: "domicilioBarrio",
          value: datosUsuario.domicilioBarrio || ""
        },
        {
          key: "domicilioCalle",
          value: datosUsuario.domicilioCalle || ""
        },
        {
          key: "domicilioAltura",
          value: datosUsuario.domicilioAltura || ""
        },
        {
          key: "domicilioPiso",
          value: datosUsuario.domicilioPiso || ""
        },
        {
          key: "domicilioDepto",
          value: datosUsuario.domicilioDepto || ""
        },
        {
          key: "domicilioCodigoPostal",
          value: datosUsuario.domicilioCodigoPostal || ""
        },
        {
          key: "domicilioObservaciones",
          value: datosUsuario.domicilioObservaciones || ""
        },
        {
          key: "observaciones",
          value: datosUsuario.observaciones || ""
        }
      ]);
    }

    this.setState({ cargando: false });
  };

  onClose = () => {
    let cargando = this.state.cargando;
    if (cargando == true) return;
    this.props.onClose && this.props.onClose(this.state.usuarioRegistrado);
  };

  onBotonBanerClick = () => {
    this.setState({ errorVisible: false });
  };

  callback = callback => {
    this.callback = callback;
  };

  onBotonRegistrarClick = async data => {
    this.setState({ errorVisible: false });

    let {
      nombre,
      apellido,
      dni,
      sexo,
      fechaNacimiento,
      domicilioBarrio,
      domicilioCalle,
      domicilioAltura,
      domicilioPiso,
      domicilioDepto,
      domicilioCodigoPostal,
      observaciones
    } = data;

    this.setState({ cargando: true });

    let valorSexo = undefined;
    if (sexo == "1") valorSexo = true;
    if (sexo == "0") valorSexo = false;

    try {
      let comando = {
        nombre: nombre,
        apellido: apellido,
        dni: dni,
        fechaNacimiento: fechaNacimiento && DateUtils.toDateString(fechaNacimiento),
        sexoMasculino: valorSexo,
        domicilioBarrio: domicilioBarrio,
        domicilioCalle: domicilioCalle,
        domicilioAltura: domicilioAltura,
        domicilioPiso: domicilioPiso,
        domicilioDepto: domicilioDepto,
        domicilioCodigoPostal: domicilioCodigoPostal,
        observaciones: observaciones
      };
      if (this.props.editar == true) {
        comando.id = this.props.id;
      }

      let proceso;
      if (this.props.editar == true) {
        proceso = Rules_Usuario.actualizar(comando);
      } else {
        proceso = Rules_Usuario.nuevo(comando);
      }
      let resultado = await proceso;

      if (this.props.editar == true) {
        this.props.mostrarAlertaVerde({ texto: "Usuario modificado correctamente" });
      } else {
        this.props.mostrarAlertaVerde({ texto: "Usuario registrado correctamente" });
      }
      this.setState({ usuarioRegistrado: resultado, cargando: false }, () => {
        this.onClose();
      });
    } catch (ex) {
      console.log(ex);
      let mensaje = typeof ex == "object" ? ex.message : ex;
      this.setState({ errorVisible: true, errorMensaje: mensaje, cargando: false });
    }
  };

  onBanerBotonClick = () => {
    this.setState({ errorVisible: false });
  };

  render() {
    const { classes } = this.props;
    const inputs = [
      {
        key: "nombre",
        label: "Nombre"
      },
      {
        key: "apellido",
        label: "Apellido"
      },
      {
        key: "dni",
        label: "N° de Documento"
      },
      {
        key: "fechaNacimiento",
        label: "Fecha de nacimiento",
        type: "date"
      },
      {
        key: "sexo",
        label: "Sexo",
        inputType: "radio",
        horizontal: true,
        value: "1",
        items: [
          {
            value: "1",
            label: "Masculino"
          },
          {
            value: "0",
            label: "Femenino"
          }
        ]
      },
      {
        key: "domicilioBarrio",
        label: "Barrio"
      },
      {
        key: "domicilioCalle",
        label: "Calle"
      },
      {
        key: "domicilioAltura",
        label: "Altura"
      },
      {
        key: "domicilioPiso",
        label: "Piso"
      },
      {
        key: "domicilioDepto",
        label: "Depto"
      },
      {
        key: "domicilioCodigoPostal",
        label: "Código postal"
      },
      {
        key: "observaciones",
        label: "Observaciones",
        multiline: true,
        rows: 3
      }
    ];

    return (
      <MiDialogoForm
        titulo={this.props.editar == true ? "Modificar usuario" : "Nuevo usuario"}
        banerVisible={this.state.errorVisible || false}
        banerMensaje={this.state.errorMensaje || ""}
        banerBotonVisible={true}
        onBanerBotonClick={this.onBanerBotonClick}
        cargando={this.state.cargando || false}
        callback={this.callback}
        autoCerrarBotonSi={false}
        onBotonSiClick={this.onBotonRegistrarClick}
        inputs={inputs}
        textoSi={this.props.editar == true ? "Modificar" : "Registrar"}
        textoNo="Cancelar"
        visible={this.props.visible || false}
        onClose={this.onClose}
        childrenContentTop={
          <MiBaner
            className={classes.contenedorError}
            modo="error"
            visible={this.state.datos && this.state.datos.error}
            mensaje={this.state.datos && this.state.datos.error}
          />
        }
      />
    );
  }
}

let componente = UsuarioNuevo;
componente = withStyles(styles)(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
export default componente;
