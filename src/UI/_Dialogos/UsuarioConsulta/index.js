import React from "react";

//Styles
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles";

//REDUX
import { connect } from "react-redux";
import { mostrarAlerta, mostrarAlertaNaranja, mostrarAlertaVerde } from "@Redux/Actions/alerta";

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
import MiBaner from "@Componentes/MiBaner";

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

class UsuarioConsulta extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dni: "",
      nombre: "",
      conError: undefined,
      favorito: undefined,

      //State general
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
          dni: "",
          nombre: "",
          conError: undefined,
          favorito: undefined,

          //State general
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
      this.setState({
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
    const { dni, nombre, conError, favorito } = this.state;
    this.props.onClose &&
      this.props.onClose({
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
        <DialogTitle>{"Buscar personas"}</DialogTitle>

        <DialogContent>
          <Grid container spacing={16}>
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
      </Dialog>
    );
  }
}

let componente = UsuarioConsulta;
componente = withStyles(styles)(componente);
componente = withMobileDialog()(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
export default componente;
