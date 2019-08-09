import React from "react";

//Styles
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles";

//REDUX
import { connect } from "react-redux";
import { mostrarAlerta, mostrarAlertaNaranja, mostrarAlertaVerde } from "@Redux/Actions/alerta";
import { setData as setTiposAuto } from "@Redux/Actions/tipoAuto";
import { setData as setTiposInscripcion } from "@Redux/Actions/tipoInscripcion";
import { setData as setTiposCondicion } from "@Redux/Actions/tipoCondicion";

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
import Rules_Inscripcion from "@Rules/Rules_Inscripcion";
import Rules_TipoInscripcion from "@Rules/Rules_TipoInscripcion";
import Rules_TipoAuto from "@Rules/Rules_TipoAuto";
import Rules_TipoCondicionInscripcion from "@Rules/Rules_TipoCondicionInscripcion";

//Utils
import DateUtils from "@Componentes/Utils/Date";

const mapStateToProps = state => {
  return {
    usuario: state.Usuario.usuario,
    token: state.Usuario.token,
    tiposAuto: state.TipoAuto.data,
    tiposInscripcion: state.TipoInscripcion.data,
    tiposCondicion: state.TipoCondicion.data
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
  setTiposAuto: comando => {
    dispatch(setTiposAuto(comando));
  },
  setTiposInscripcion: comando => {
    dispatch(setTiposInscripcion(comando));
  },
  setTiposCondicion: comando => {
    dispatch(setTiposCondicion(comando));
  }
});

class InscripcionNuevo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      //Para editar
      data: undefined,

      //Datos del form
      identificador: "",
      fechaInicio: null,
      fechaFin: null,
      tipoAuto: undefined,
      tipoInscripcion: undefined,
      tipoCondicionInscripcion: undefined,
      fechaTelegrama: null,
      fechaVencimientoLicencia: null,
      artCompañia: "",
      artFechaVencimiento: null,
      caja: "",
      observaciones: "",
      datosUsuario: undefined,

      //State general
      tiposInscripcion: [],
      selectTiposInscripcion: [],
      tiposAuto: [],
      selectTiposAuto: [],
      tiposCondicionInscripcion: [],
      selectTiposCondicionInscripcion: [],
      exito: false,
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
          //Para editar
          data: undefined,

          //Datos del form
          identificador: "",
          fechaInicio: null,
          fechaFin: null,
          tipoAuto: undefined,
          tipoInscripcion: undefined,
          tipoCondicionInscripcion: undefined,
          fechaTelegrama: null,
          fechaVencimientoLicencia: null,
          artCompañia: "",
          artFechaVencimiento: null,
          caja: "",
          observaciones: "",
          datosUsuario: undefined,

          //State general
          tiposInscripcion: [],
          selectTiposInscripcion: [],
          tiposAuto: [],
          selectTiposAuto: [],
          tiposCondicionInscripcion: [],
          selectTiposCondicionInscripcion: [],
          exito: false,
          cargando: false,
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
        let datosEditar = await Rules_Inscripcion.getDetalle(this.props.id);

        let fechaInicio = undefined;
        if (datosEditar.fechaInicio) {
          fechaInicio = DateUtils.toDate(datosEditar.fechaInicio);
        }

        let fechaFin = undefined;
        if (datosEditar.fechaFin) {
          fechaFin = DateUtils.toDate(datosEditar.fechaFin);
        }

        let fechaTelegrama = undefined;
        if (datosEditar.fechaTelegrama) {
          fechaTelegrama = DateUtils.toDate(datosEditar.fechaTelegrama);
        }

        let fechaVencimientoLicencia = undefined;
        if (datosEditar.fechaVencimientoLicencia) {
          fechaVencimientoLicencia = DateUtils.toDate(datosEditar.fechaVencimientoLicencia);
        }

        let artVce = undefined;
        if (datosEditar.artFechaVencimiento) {
          artVce = DateUtils.toDate(datosEditar.artFechaVencimiento);
        }

        let datosUsuario = undefined;
        if (datosEditar.usuarioId) {
          datosUsuario = await Rules_Usuario.getDetalle(datosEditar.usuarioId);
        }

        let tipoAuto = undefined;
        if (datosEditar.tipoAutoKeyValue) {
          tipoAuto = datosEditar.tipoAutoKeyValue + "";
        }

        let tipoInscripcion = undefined;
        if (datosEditar.tipoInscripcionKeyValue) {
          tipoInscripcion = datosEditar.tipoInscripcionKeyValue + "";
        }

        let tipoCondicionInscripcion = undefined;
        if (datosEditar.tipoCondicionInscripcionKeyValue) {
          tipoCondicionInscripcion = datosEditar.tipoCondicionInscripcionKeyValue + "";
        }

        this.setState({
          data: datosEditar,
          identificador: datosEditar.identificador || "",
          fechaInicio: fechaInicio,
          fechaFin: fechaFin,
          tipoAuto: tipoAuto,
          tipoInscripcion: tipoInscripcion,
          tipoCondicionInscripcion: tipoCondicionInscripcion,
          fechaTelegrama: fechaTelegrama,
          fechaVencimientoLicencia: fechaVencimientoLicencia,
          artCompañia: datosEditar.artCompañia || "",
          artFechaVencimiento: artVce,
          caja: datosEditar.caja || "",
          observaciones: datosEditar.observaciones || "",
          datosUsuario: datosUsuario
        });
      }

      //Tipos inscripcion (Primro en redux, sino en el ws)
      let tiposInscripcion;
      if (this.props.tiposInscripcion && this.props.tiposInscripcion.length != 0) {
        tiposInscripcion = this.props.tiposInscripcion;
      } else {
        tiposInscripcion = await Rules_TipoInscripcion.get();
        this.props.setTiposInscripcion(tiposInscripcion);
      }
      let selectTiposInscripcion = (tiposInscripcion || []).map(t => {
        return {
          value: t.keyValue + "",
          label: t.nombre
        };
      });

      //Tipos auto (Primero busco en redux, sino en el ws)
      let tiposAuto;
      if (this.props.tiposAuto && this.props.tiposAuto.length != 0) {
        tiposAuto = this.props.tiposAuto;
      } else {
        tiposAuto = await Rules_TipoAuto.get();
        this.props.setTiposAuto(tiposAuto);
      }
      let selectTiposAuto = (tiposAuto || []).map(t => {
        return {
          value: t.keyValue + "",
          label: t.nombre
        };
      });

      //Tipos auto (Primero busco en redux, sino en el ws)
      let tiposCondicion;
      if (this.props.tiposCondicion && this.props.tiposCondicion.length != 0) {
        tiposCondicion = this.props.tiposCondicion;
      } else {
        tiposCondicion = await Rules_TipoCondicionInscripcion.get();
        this.props.setTiposCondicion(tiposCondicion);
      }
      let selectTiposCondicion = (tiposCondicion || []).map(t => {
        return {
          value: t.keyValue + "",
          label: t.nombre
        };
      });

      this.setState({
        tiposAuto: tiposAuto,
        selectTiposAuto: selectTiposAuto,
        tiposInscripcion: tiposInscripcion,
        selectTiposInscripcion: selectTiposInscripcion,
        tiposCondicionInscripcion: tiposCondicion,
        selectTiposCondicionInscripcion: selectTiposCondicion,
        cargando: false
      });
    } catch (ex) {
      let mensaje = typeof ex === "object" ? ex.message : ex;
      this.setState({ cargando: false, errorVisible: false, errorMensaje: mensaje });
    }
  };

  onClose = () => {
    let cargando = this.state.cargando;
    if (cargando == true) return;
    this.props.onClose && this.props.onClose(this.state.exito == true);
  };

  onIdentificadorChange = e => {
    this.setState({ identificador: e.currentTarget.value });
  };

  onTipoInscripcionChange = e => {
    if (e == undefined) {
      this.setState({ tipoInscripcion: undefined });
      return;
    }
    this.setState({ tipoInscripcion: e.value });
  };

  onTipoAutoChange = e => {
    if (e == undefined) {
      this.setState({ tipoAuto: undefined });
      return;
    }
    this.setState({ tipoAuto: e.value });
  };

  onTipoCondicionInscripcionChange = e => {
    if (e == undefined) {
      this.setState({ tipoCondicionInscripcion: undefined });
      return;
    }
    this.setState({ tipoCondicionInscripcion: e.value });
  };

  onInputFechaTelegramaChange = fecha => {
    this.setState({ fechaTelegrama: fecha });
  };

  onInputFechaVencimientoLicenciaChange = fecha => {
    this.setState({ fechaVencimientoLicencia: fecha });
  };

  onInputFechaArtFechaVencimientoChange = fecha => {
    this.setState({ artFechaVencimiento: fecha });
  };

  onInputCajaChange = e => {
    this.setState({ caja: e.currentTarget.value });
  };

  onInputArtCompañiaChange = e => {
    this.setState({ artCompañia: e.currentTarget.value });
  };

  onInputObservacionesChange = e => {
    this.setState({ observaciones: e.currentTarget.value });
  };

  onInputFechaInicioChange = fecha => {
    this.setState({ fechaInicio: fecha });
  };

  onInputFechaFinChange = fecha => {
    this.setState({ fechaFin: fecha });
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
      tipoInscripcion,
      tipoAuto,
      tipoCondicionInscripcion,
      identificador,
      fechaTelegrama,
      fechaVencimientoLicencia,
      caja,
      artCompañia,
      artFechaVencimiento,
      observaciones,
      fechaInicio,
      fechaFin,
      datosUsuario
    } = this.state;

    this.setState({ errorVisible: false });

    let idUsuario = undefined;
    if (datosUsuario) {
      idUsuario = datosUsuario.id;
    }

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

    if (fechaTelegrama) {
      fechaTelegrama = DateUtils.toDateString(fechaTelegrama);
    } else {
      fechaTelegrama = undefined;
    }

    if (fechaVencimientoLicencia) {
      fechaVencimientoLicencia = DateUtils.toDateString(fechaVencimientoLicencia);
    } else {
      fechaVencimientoLicencia = undefined;
    }

    if (artFechaVencimiento) {
      artFechaVencimiento = DateUtils.toDateString(artFechaVencimiento);
    } else {
      artFechaVencimiento = undefined;
    }

    this.setState({ cargando: true });
    let comando = {
      idUsuario: idUsuario,
      identificador: identificador,
      tipoAutoKeyValue: tipoAuto,
      tipoInscripcionKeyValue: tipoInscripcion,
      tipoCondicionInscripcionKeyValue: tipoCondicionInscripcion,
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
      fechaTelegrama: fechaTelegrama,
      fechaVencimientoLicencia: fechaVencimientoLicencia,
      artCompañia: artCompañia,
      artFechaVencimiento: artFechaVencimiento,
      caja: caja,
      observaciones: observaciones
    };

    if (this.props.editar == true) {
      comando.id = this.props.id;
    }

    try {
      let proceso;
      if (this.props.editar == true) {
        proceso = Rules_Inscripcion.actualizar(comando);
      } else {
        proceso = Rules_Inscripcion.insertar(comando);
      }

      await proceso;
      if (this.props.editar == true) {
        this.props.mostrarAlertaVerde({ texto: "Inscripto modificado correctamente" });
      } else {
        this.props.mostrarAlertaVerde({ texto: "Inscripto registrado correctamente" });
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
      id = this.state.datat.usuarioId;
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
        <DialogTitle>{this.props.editar == true ? "Modificar inscripción" : "Nueva inscripción"}</DialogTitle>

        <DialogContent>
          <Grid container spacing={16}>
            {this.state.data && this.state.data.error && (
              <Grid item xs={12}>
                <MiBaner className={classes.contenedorError} visible={true} mensaje={this.state.data.error || ""} modo="error" />
              </Grid>
            )}

            {/* tipo inscripcion  */}
            <Grid item xs={12} md={6}>
              <MiSelect
                label="Tipo de inscripto"
                variant="outlined"
                fullWidth
                margin="dense"
                value={this.state.tipoInscripcion}
                onChange={this.onTipoInscripcionChange}
                options={this.state.selectTiposInscripcion || []}
              />
            </Grid>

            {/* tipo auto  */}
            <Grid item xs={12} md={6}>
              <MiSelect
                label="Auto"
                variant="outlined"
                fullWidth
                margin="dense"
                value={this.state.tipoAuto}
                onChange={this.onTipoAutoChange}
                options={this.state.selectTiposAuto || []}
              />
            </Grid>

            {/* identificador */}
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                margin="dense"
                label="Identificador"
                value={this.state.identificador || ""}
                onChange={this.onIdentificadorChange}
              />
            </Grid>

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
                  icon={<IconFaceOutlined />}
                  onClick={this.onBotonUsuarioClick}
                  label={nombreUsuario}
                  onDelete={this.onBotonCancelarUsuarioClick}
                  color="default"
                />
              </Grid>
            )}

            <Grid item xs={12} />

            {/* Fecha telegrama */}
            <Grid item xs={12} sm={6}>
              <DatePicker
                keyboard
                variant="outlined"
                fullWidth
                margin="dense"
                label="Fecha de telegrama"
                format="dd/MM/yyyy"
                invalidDateMessage="Fecha inválida"
                maxDateMessage="Fecha inválida"
                minDateMessage="Fecha inválida"
                mask={value => (value ? [/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/] : [])}
                value={this.state.fechaTelegrama || null}
                onChange={this.onInputFechaTelegramaChange}
                disableOpenOnEnter
                onInputChange={e => {
                  if (e.currentTarget.value == "" || e.currentTarget.value.indexOf("_") != -1) {
                    this.setState({ fechaTelegrama: undefined });
                  }
                }}
                animateYearScrolling={false}
              />
            </Grid>

            {/* Fecha vencimiento licencia */}
            <Grid item xs={12} sm={6}>
              <DatePicker
                keyboard
                variant="outlined"
                fullWidth
                margin="dense"
                label="Fecha V Lic. Conducir"
                format="dd/MM/yyyy"
                invalidDateMessage="Fecha inválida"
                maxDateMessage="Fecha inválida"
                minDateMessage="Fecha inválida"
                mask={value => (value ? [/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/] : [])}
                value={this.state.fechaVencimientoLicencia || null}
                onChange={this.onInputFechaVencimientoLicenciaChange}
                disableOpenOnEnter
                onInputChange={e => {
                  if (e.currentTarget.value == "" || e.currentTarget.value.indexOf("_") != -1) {
                    this.setState({ fechaVencimientoLicencia: undefined });
                  }
                }}
                animateYearScrolling={false}
              />
            </Grid>

            {/* Caja */}
            <Grid item xs={12} md={6}>
              <TextField
                variant="outlined"
                fullWidth
                margin="dense"
                label="Caja"
                value={this.state.caja || ""}
                onChange={this.onInputCajaChange}
              />
            </Grid>

            {/* Art comp */}
            <Grid item xs={12} md={6}>
              <TextField
                variant="outlined"
                fullWidth
                margin="dense"
                label="Art Compañia"
                value={this.state.artCompañia || ""}
                onChange={this.onInputArtCompañiaChange}
              />
            </Grid>

            {/* Art fecha */}
            <Grid item xs={12} sm={6}>
              <DatePicker
                keyboard
                variant="outlined"
                fullWidth
                margin="dense"
                label="Art Fecha Vencimiento"
                format="dd/MM/yyyy"
                invalidDateMessage="Fecha inválida"
                maxDateMessage="Fecha inválida"
                minDateMessage="Fecha inválida"
                mask={value => (value ? [/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/] : [])}
                value={this.state.artFechaVencimiento || null}
                onChange={this.onInputFechaArtFechaVencimientoChange}
                disableOpenOnEnter
                onInputChange={e => {
                  if (e.currentTarget.value == "" || e.currentTarget.value.indexOf("_") != -1) {
                    this.setState({ artFechaVencimiento: undefined });
                  }
                }}
                animateYearScrolling={false}
              />
            </Grid>

            {/* Condicion */}
            <Grid item xs={12} md={6}>
              <MiSelect
                label="Condicion"
                variant="outlined"
                fullWidth
                margin="dense"
                value={this.state.tipoCondicionInscripcion}
                onChange={this.onTipoCondicionInscripcionChange}
                options={this.state.selectTiposCondicionInscripcion || []}
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
                rows="4"
                value={this.state.observaciones || ""}
                onChange={this.onInputObservacionesChange}
              />
            </Grid>
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

let componente = InscripcionNuevo;
componente = withStyles(styles)(componente);
componente = withMobileDialog()(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
export default componente;
