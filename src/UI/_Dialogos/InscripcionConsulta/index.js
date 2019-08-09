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

//Compontes
import _ from "lodash";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

//Mis componentes
import MiSelect from "@Componentes/MiSelect";
import MiBaner from "@Componentes/MiBaner";
import MiDialogoUsuarioPicker from "../UsuarioPicker";
import MiDialogoUsuarioNuevo from "../../_Dialogos/UsuarioNuevo";

//Rules
import Rules_TipoInscripcion from "@Rules/Rules_TipoInscripcion";
import Rules_TipoAuto from "@Rules/Rules_TipoAuto";

const mapStateToProps = state => {
  return {
    usuario: state.Usuario.usuario,
    token: state.Usuario.token,
    tiposAuto: state.TipoAuto.data,
    tiposInscripcion: state.TipoInscripcion.data
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
  }
});

class InscripcionConsulta extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      identificador: "",
      tipoAuto: undefined,
      tipoInscripcion: undefined,
      dni: "",
      nombre: "",
      conError: undefined,
      favorito: undefined,

      //State general
      tiposInscripcion: [],
      tiposAuto: [],
      selectTiposAuto: [],
      selectTiposCondicionInscripcion: [],
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
          identificador: "",
          tipoAuto: undefined,
          tipoInscripcion: undefined,
          dni: "",
          nombre: "",
          conError: undefined,
          favorito: undefined,

          //State general
          tiposInscripcion: [],
          tiposAuto: [],
          selectTiposAuto: [],
          selectTiposCondicionInscripcion: [],
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

      this.setState({
        tiposAuto: tiposAuto,
        selectTiposAuto: selectTiposAuto,
        tiposInscripcion: tiposInscripcion,
        selectTiposInscripcion: selectTiposInscripcion,
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
    this.props.onClose && this.props.onClose();
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

  onInputDniChange = e => {
    this.setState({ dni: e.currentTarget.value });
  };

  onInputNombreChange = e => {
    this.setState({ nombre: e.currentTarget.value });
  };

  onInputConErrorChange = e => {
    if (this.state.conError == true) {
      this.setState({ conError: false });
      return;
    }

    if (this.state.conError == undefined) {
      this.setState({ conError: true });
      return;
    }

    this.setState({ conError: undefined });
  };

  onInputFavoritoChange = e => {
    if (this.state.favorito == true) {
      this.setState({ favorito: false });
      return;
    }

    if (this.state.favorito == undefined) {
      this.setState({ favorito: true });
      return;
    }

    this.setState({ favorito: undefined });
  };

  onBotonBanerClick = () => {
    this.setState({ errorVisible: false });
  };

  onBotonBuscarClick = () => {
    const { tipoAuto, tipoInscripcion, identificador, dni, nombre, conError, favorito } = this.state;
    this.props.onClose &&
      this.props.onClose({
        tipoAuto,
        tipoInscripcion,
        identificador: identificador && identificador.trim(),
        dni: dni && dni.trim(),
        nombre: nombre && nombre.trim(),
        conError: conError,
        favorito: favorito
      });
  };

  render() {
    const { classes, fullScreen } = this.props;

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
        <DialogTitle>{"Buscar licencias"}</DialogTitle>

        <DialogContent>
          <Grid container spacing={16}>
            {/* tipo inscripcion  */}
            <Grid item xs={12} md={6}>
              <MiSelect
                placeholder="Seleccione..."
                label="Tipo de licencia"
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
                placeholder="Seleccione..."
                label="Tipo de Auto"
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
                label="N° de Licencia"
                value={this.state.identificador || ""}
                onChange={this.onIdentificadorChange}
              />
            </Grid>

            {/* DNI */}
            <Grid item xs={12} md={6}>
              <TextField
                variant="outlined"
                fullWidth
                margin="dense"
                label="N° de Documento"
                value={this.state.dni || ""}
                onChange={this.onInputDniChange}
              />
            </Grid>

            {/* Nombre */}
            <Grid item xs={12} md={6}>
              <TextField
                variant="outlined"
                fullWidth
                margin="dense"
                label="Nombre"
                value={this.state.nombre || ""}
                onChange={this.onInputNombreChange}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    indeterminate={this.state.favorito == undefined}
                    checked={this.state.favorito || false}
                    onChange={this.onInputFavoritoChange}
                    color="primary"
                  />
                }
                label="Favorito"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    indeterminate={this.state.conError == undefined}
                    checked={this.state.conError || false}
                    onChange={this.onInputConErrorChange}
                    color="primary"
                  />
                }
                label="Con error"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.onClose}>Cancelar</Button>
          <Button onClick={this.onBotonBuscarClick} color="primary">
            Buscar
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

let componente = InscripcionConsulta;
componente = withStyles(styles)(componente);
componente = withMobileDialog()(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
export default componente;
