import React from "react";

//Styles
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles";

//REDUX
import { connect } from "react-redux";
import { mostrarAlerta, mostrarAlertaNaranja, mostrarAlertaVerde } from "@Redux/Actions/alerta";
import { setData as setTiposInhabilitacion } from "@Redux/Actions/tipoInhabilitacion";

//Compontes
import _ from "lodash";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Icon from "@material-ui/core/Icon";
import Chip from "@material-ui/core/Chip";
import { InlineDatePicker as DatePicker } from "material-ui-pickers";
import IconFaceOutlined from "@material-ui/icons/FaceOutlined";

//Mis componentes
import MiSelect from "@Componentes/MiSelect";
import MiBaner from "@Componentes/MiBaner";
import MiDialogoUsuarioPicker from "../UsuarioPicker";
import MiDialogoUsuarioNuevo from "../../_Dialogos/UsuarioNuevo";

//Rules
import Rules_Usuario from "@Rules/Rules_Usuario";
import Rules_Inhabilitacion from "@Rules/Rules_Inhabilitacion";
import Rules_TipoInhabilitacion from "@Rules/Rules_TipoInhabilitacion";

//Utils
import DateUtils from "@Componentes/Utils/Date";

const mapStateToProps = state => {
  return {
    usuario: state.Usuario.usuario,
    token: state.Usuario.token,
    tiposInhabilitacion: state.TipoInhabilitacion.data
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
  },
  setTiposInhabilitacion: comando => {
    dispatch(setTiposInhabilitacion(comando));
  }
});

class InhabilitacionNuevo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      //Para editar
      data: undefined,

      //Datos del form
      tipoInhabilitacion: undefined,
      datosUsuario: undefined,
      fechaInicio: null,
      fechaFin: null,
      dtoRes: null,
      expediente: "",
      observacionesAutoChapa: "",
      observacionesTipoAuto: "",
      observaciones: "",

      //State general
      tiposInhabilitacion: [],
      selectTiposInhabilitacion: [],
      exito: false,
      cargando: false,
      errorInicial: undefined,
      errorMensaje: "",
      errorVisible: false
    };
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible != this.props.visible && nextProps.visible) {
      this.setState(
        {
          //Para editar
          data: undefined,

          //Datos del form
          tipoInhabilitacion: undefined,
          datosUsuario: undefined,
          fechaInicio: null,
          fechaFin: null,
          dtoRes: null,
          expediente: "",
          observacionesAutoChapa: "",
          observacionesTipoAuto: "",
          observaciones: "",

          //State general
          tiposInhabilitacion: [],
          selectTiposInhabilitacion: [],
          exito: false,
          cargando: false,
          errorInicial: undefined,
          errorMensaje: "",
          errorVisible: false
        },
        () => {
          this.buscarDatos();
        }
      );
    }
  }

  buscarDatos = async () => {
    this.setState({ cargando: true, errorVisible: false });
    try {
      if (this.props.editar == true) {
        let datosEditar = await Rules_Inhabilitacion.getDetalle(this.props.id);

        let fechaInicio = null;
        if (datosEditar.fechaInicio) {
          fechaInicio = DateUtils.toDate(datosEditar.fechaInicio);
        }

        let fechaFin = null;
        if (datosEditar.fechaFin) {
          fechaFin = DateUtils.toDate(datosEditar.fechaFin);
        }

        let datosUsuario;
        if (datosEditar.usuarioId) {
          datosUsuario = await Rules_Usuario.getDetalle(datosEditar.usuarioId);
        }

        let tipoInhabilitacion;
        if (datosEditar.tipoInhabilitacionKeyValue) {
          tipoInhabilitacion = datosEditar.tipoInhabilitacionKeyValue;
        }

        this.setState({
          data: datosEditar,
          tipoInhabilitacion: tipoInhabilitacion,
          fechaInicio: fechaInicio,
          fechaFin: fechaFin,
          dtoRes: datosEditar.dtoRes || "",
          expediente: datosEditar.expediente || "",
          datosUsuario: datosUsuario,
          observacionesAutoChapa: datosEditar.observacionesAutoChapa || "",
          observacionesTipoAuto: datosEditar.observacionesTipoAuto || "",
          observaciones: datosEditar.observaciones || ""
        });
      }

      let tiposInhabilitacion;
      if (this.props.tiposInhabilitacion && this.props.tiposInhabilitacion.length != 0) {
        tiposInhabilitacion = this.props.tiposInhabilitacion;
      } else {
        tiposInhabilitacion = await Rules_TipoInhabilitacion.get();
        this.props.setTiposInhabilitacion(tiposInhabilitacion);
      }
      let selectTiposInhabilitacion = tiposInhabilitacion.map(t => {
        return {
          label: t.nombre,
          value: t.keyValue + ""
        };
      });

      this.setState({
        tiposInhabilitacion: tiposInhabilitacion,
        selectTiposInhabilitacion: selectTiposInhabilitacion,
        cargando: false
      });
    } catch (ex) {
      let mensaje = typeof ex === "object" ? ex.message : ex;
      this.setState({ cargando: false, errorVisible: true, errorMensaje: mensaje });
      console.log("Error", ex);
      console.log("Mensaje", mensaje);
    }
  };

  onClose = () => {
    let cargando = this.state.cargando;
    if (cargando == true) return;
    this.props.onClose && this.props.onClose(this.state.exito == true);
  };

  onInputFechaInicioChange = fecha => {
    this.setState({ fechaInicio: fecha });
  };

  onInputFechaFinChange = fecha => {
    this.setState({ fechaFin: fecha });
  };

  onInputExpedienteChange = e => {
    this.setState({ expediente: e.currentTarget.value });
  };

  onInputDtoResChange = e => {
    this.setState({ dtoRes: e.currentTarget.value });
  };

  onInputObservacionesTipoAutoChange = e => {
    this.setState({ observacionesTipoAuto: e.currentTarget.value });
  };

  onInputObservacionesAutoChapaChange = e => {
    this.setState({ observacionesAutoChapa: e.currentTarget.value });
  };

  onInputObservacionesChange = e => {
    this.setState({ observaciones: e.currentTarget.value });
  };

  onTipoInhabilitacionChange = e => {
    if (e == undefined) {
      this.setState({ tipoInhabilitacion: undefined });
      return;
    }

    this.setState({ tipoInhabilitacion: e.value });
  };

  //Usuario
  onBotonUsuarioPickerClick = () => {
    this.setState({ dialogoUsuarioPickerVisible: true });
  };

  onDialogoUsuarioPickerClose = async usuarioSeleccionado => {
    this.setState({ dialogoUsuarioPickerVisible: false });

    if (usuarioSeleccionado) {
      try {
        this.setState({ cargando: true });
        let dataUsuario = await Rules_Usuario.getDetalle(usuarioSeleccionado);
        this.setState({ datosUsuario: dataUsuario, cargando: false });
      } catch (ex) {
        let mensaje = typeof ex === "object" ? ex.message : ex;
        this.props.mostrarAlertaNaranja({ texto: mensaje });
        this.setState({ cargando: false });
      }
    }
  };

  onBotonCancelarUsuarioClick = () => {
    this.setState({ datosUsuario: undefined });
  };

  onBotonBanerClick = () => {
    this.setState({ errorVisible: false });
  };

  onBotonRegistrarClick = async () => {
    let {
      tipoInhabilitacion,
      datosUsuario,
      fechaInicio,
      fechaFin,
      dtoRes,
      expediente,
      observacionesAutoChapa,
      observacionesTipoAuto,
      observaciones
    } = this.state;

    this.setState({ errorVisible: false });

    if (fechaInicio) {
      fechaInicio = DateUtils.toDateString(fechaInicio);
    } else {
      fechaInicio = undefined;
    }

    if (fechaFin) {
      fechaFin = DateUtils.toDateString(fechaFin);
    } else {
      fechaFin = undefined;
    }

    let idUsuario;
    if (datosUsuario) {
      idUsuario = datosUsuario.id;
    }

    this.setState({ cargando: true });
    let comando = {
      tipoInhabilitacionKeyValue: tipoInhabilitacion,
      idUsuario: idUsuario,
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
      dtoRes: dtoRes,
      expediente: expediente,
      observacionesAutoChapa: observacionesAutoChapa,
      observacionesTipoAuto: observacionesTipoAuto,
      observaciones: observaciones
    };

    if (this.props.editar == true) {
      comando.id = this.props.id;
    }

    try {
      let proceso;
      if (this.props.editar == true) {
        proceso = Rules_Inhabilitacion.actualizar(comando);
      } else {
        proceso = Rules_Inhabilitacion.insertar(comando);
      }

      await proceso;
      if (this.props.editar == true) {
        this.props.mostrarAlertaVerde({ texto: "Inhabilitación modificada correctamente" });
      } else {
        this.props.mostrarAlertaVerde({ texto: "Inhabilitación registrada correctamente" });
      }
      this.setState({ exito: true, cargando: false }, () => {
        this.onClose();
      });
    } catch (ex) {
      let mensaje = typeof ex == "object" ? ex.message : ex;
      this.setState({ errorVisible: true, errorMensaje: mensaje, cargando: false });
    }
  };

  onBotonUsuarioClick = () => {
    let id;
    if (this.state.datosUsuario) {
      id = this.state.datosUsuario.id;
    } else {
      id = this.state.data.usuarioId;
    }
    this.setState({ dialogoUsuarioVisible: true, dialogoUsuarioId: id });
  };

  onDialogoUsuarioClose = exito => {
    this.setState({ dialogoUsuarioVisible: false });
    if (exito != undefined) {
      this.buscarDatos();
    }
  };
  render() {
    const { classes, fullScreen } = this.props;

    let nombreUsuario = "";
    if (this.state.datosUsuario) {
      let conNombre = this.state.datosUsuario.nombre != undefined && this.state.datosUsuario.nombre.trim() != "";
      let conApellido = this.state.datosUsuario.apellido != undefined && this.state.datosUsuario.apellido.trim() != "";

      if (conNombre && conApellido) {
        nombreUsuario = this.state.datosUsuario.apellido.trim() + " " + this.state.datosUsuario.nombre.trim();
      } else {
        if (!conNombre && !conApellido) {
          nombreUsuario = "Sin nombre ni apellido";
        } else {
          if (conNombre) {
            nombreUsuario = this.state.datosUsuario.nombre.trim();
          } else {
            nombreUsuario = this.state.datosUsuario.apellido.trim();
          }
        }
      }
    }

    return (
      <Dialog
        fullScreen={fullScreen || false}
        open={this.props.visible || false}
        onClose={this.onClose}
        aria-labelledby="dialogo"
        onClick={e => {
          e.stopPropagation();
        }}
      >
        <MiBaner
          visible={this.state.errorVisible || false}
          mensaje={this.state.errorMensaje || ""}
          modo="error"
          onBotonClick={this.onBotonBanerClick}
          botonVisible={true}
        />
        <DialogTitle>{this.props.editar == true ? "Modificar inhabilitación" : "Nueva inhabilitación"}</DialogTitle>

        <DialogContent>
          <Grid container spacing={16}>
            {this.state.data && this.state.data.error && (
              <Grid item xs={12}>
                <MiBaner className={classes.contenedorError} visible={true} mensaje={this.state.data.error || ""} modo="error" />
              </Grid>
            )}

            {/* tipo inhabilitacion  */}
            <Grid item xs={12} sm={6}>
              <MiSelect
                label="Tipo"
                variant="outlined"
                fullWidth
                margin="dense"
                value={this.state.tipoInhabilitacion}
                onChange={this.onTipoInhabilitacionChange}
                options={this.state.selectTiposInhabilitacion || []}
              />
            </Grid>

            <Grid item xs={12} sm={6} />

            {/* fecha inicio */}
            <Grid item xs={12} sm={6}>
              <DatePicker
                keyboard
                variant="outlined"
                fullWidth
                margin="dense"
                label="Fecha de inicio"
                format="dd/MM/yyyy"
                invalidDateMessage="Fecha inválida"
                maxDateMessage="Fecha inválida"
                minDateMessage="Fecha inválida"
                mask={value => (value ? [/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/] : [])}
                value={this.state.fechaInicio || null}
                onChange={this.onInputFechaInicioChange}
                disableOpenOnEnter
                onInputChange={e => {
                  if (e.currentTarget.value == "" || e.currentTarget.value.indexOf("_") != -1) {
                    this.setState({ fechaInicio: undefined });
                  }
                }}
                animateYearScrolling={false}
              />
            </Grid>

            {/* fecha fin */}
            <Grid item xs={12} sm={6}>
              <DatePicker
                keyboard
                variant="outlined"
                fullWidth
                margin="dense"
                label="Fecha de fin"
                format="dd/MM/yyyy"
                invalidDateMessage="Fecha inválida"
                maxDateMessage="Fecha inválida"
                minDateMessage="Fecha inválida"
                onInputChange={e => {
                  if (e.currentTarget.value == "" || e.currentTarget.value.indexOf("_") != -1) {
                    this.setState({ fechaFin: undefined });
                  }
                }}
                mask={value => (value ? [/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/] : [])}
                value={this.state.fechaFin || null}
                onChange={this.onInputFechaFinChange}
                disableOpenOnEnter
                animateYearScrolling={false}
              />
            </Grid>

            {/* Expediente */}
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                fullWidth
                margin="dense"
                label="Expediente"
                value={this.state.expediente || ""}
                onChange={this.onInputExpedienteChange}
              />
            </Grid>

            {/* Dto Res */}
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                fullWidth
                margin="dense"
                label="Dto Res"
                value={this.state.dtoRes || ""}
                onChange={this.onInputDtoResChange}
              />
            </Grid>

            {/* observaciones auto chapa */}
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                fullWidth
                margin="dense"
                label="Auto chapa"
                value={this.state.observacionesAutoChapa || ""}
                onChange={this.onInputObservacionesAutoChapaChange}
              />
            </Grid>

            {/* observaciones tipo auto*/}
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                fullWidth
                margin="dense"
                label="Tipo auto"
                value={this.state.observacionesTipoAuto || ""}
                onChange={this.onInputObservacionesTipoAutoChange}
              />
            </Grid>

            {/* observaciones */}
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                margin="dense"
                label="Observaciones"
                multiline={true}
                rows={3}
                value={this.state.observaciones || ""}
                onChange={this.onInputObservacionesChange}
              />
            </Grid>

            {/* Persona asociada */}
            <Grid item xs={12}>
              <Typography variant="body2" style={{ marginLeft: 8 }}>
                Persona asociada
              </Typography>
            </Grid>

            {/* Persona no seleccionada */}
            {this.state.datosUsuario == undefined && (
              <Button variant="outlined" onClick={this.onBotonUsuarioPickerClick} style={{ marginLeft: 8 }}>
                <Icon style={{ marginRight: 8 }}>search</Icon> Buscar persona
              </Button>
            )}

            {/* Persona ya seleccionada */}
            {this.state.datosUsuario != undefined && (
              <Grid item xs={12}>
                <Chip
                  onClick={this.onBotonUsuarioClick}
                  icon={<IconFaceOutlined />}
                  label={nombreUsuario}
                  onDelete={this.onBotonCancelarUsuarioClick}
                  color="default"
                />
              </Grid>
            )}

            {this.state.data && (this.state.data.fechaInicioString || this.state.data.fechaFinString) && (
              <React.Fragment>
                <Grid item xs={12} />

                <Grid item xs={12} style={{ borderTop: "1px solid rgba(0,0,0,0.1)" }} />

                <Grid item xs={12} style={{ marginLeft: 8 }}>
                  <Typography variant="subheading">Información adicional de migración</Typography>
                </Grid>
              </React.Fragment>
            )}
            {this.state.data && this.state.data.fechaInicioString && (
              <Grid item xs={12} style={{ marginLeft: 8 }}>
                <Typography variant="body2">Fecha Inicio</Typography>
                <Typography variant="body1">{this.state.data.fechaInicioString}</Typography>
              </Grid>
            )}

            {this.state.data && this.state.data.fechaFinString && (
              <Grid item xs={12} style={{ marginLeft: 8 }}>
                <Typography variant="body2">Fecha Fin</Typography>
                <Typography variant="body1">{this.state.data.fechaFinString}</Typography>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.onClose}>Cancelar</Button>
          <Button onClick={this.onBotonRegistrarClick} color="primary">
            {this.props.editar == true ? "Modificar" : "Registrar"}
          </Button>
        </DialogActions>

        <div className={classNames(classes.cargando, this.state.cargando == true && "visible")}>
          <CircularProgress />
        </div>

        {/* Usuario picker */}
        <MiDialogoUsuarioPicker visible={this.state.dialogoUsuarioPickerVisible || false} onClose={this.onDialogoUsuarioPickerClose} />

        {/* Dialogo usuario nuevo  */}
        <MiDialogoUsuarioNuevo
          visible={this.state.dialogoUsuarioVisible || false}
          id={this.state.dialogoUsuarioId}
          editar={true}
          onClose={this.onDialogoUsuarioClose}
        />
      </Dialog>
    );
  }
}

let componente = InhabilitacionNuevo;
componente = withStyles(styles)(componente);
componente = withMobileDialog()(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
export default componente;
