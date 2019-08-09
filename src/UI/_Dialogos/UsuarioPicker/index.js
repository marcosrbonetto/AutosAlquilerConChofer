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
import {
  Typography,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  withMobileDialog,
  TextField,
  IconButton,
  Icon,
  Tooltip,
  Fab,
  ListItem,
  List,
  ListItemText
} from "@material-ui/core";

//Mis componentes
import MiBaner from "@Componentes/MiBaner";
import MiDialogoUsuarioNuevo from "../UsuarioNuevo";

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

class UsuarioPicker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      yaBusque: false,
      usuarioSeleccionado: undefined,
      cargando: false,
      errorVisible: false,
      errorMensaje: false,
      dni: "",
      data: []
    };
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible != this.props.visible && nextProps.visible) {
      this.setState({
        yaBusque: false,
        usuarioSeleccionado: undefined,
        cargando: false,
        errorVisible: false,
        dni: "",
        data: []
      });
    }
  }

  onClose = () => {
    let cargando = this.state.cargando;
    if (cargando == true) return;
    this.props.onClose && this.props.onClose(this.state.usuarioSeleccionado);
  };

  onDniChange = e => {
    this.setState({ dni: e.currentTarget.value });
  };

  onBotonBuscarClick = async () => {
    let dni = this.state.dni;
    if (dni.trim() == "") {
      this.props.mostrarAlertaNaranja({ texto: "Ingrese el N° de Documento" });
      return;
    }

    dni = parseInt(dni);
    if (isNaN(dni) || dni < 0) {
      this.props.mostrarAlertaNaranja({ texto: "N° de Documento inválido" });
      return;
    }

    try {
      this.setState({ cargando: true, errorVisible: false });
      let data = await Rules_Usuario.buscar({ dni: this.state.dni });
      data = _.orderBy(data, "nombre", "apellido");
      this.setState({ data: data, cargando: false, yaBusque: true });
    } catch (ex) {
      let mensaje = typeof ex === "object" ? ex.message : ex;
      this.setState({ errorVisible: true, errorMensaje: mensaje, cargando: false });
    }
  };

  onUsuarioClick = e => {
    let id = e.currentTarget.attributes["data-id"].value;
    this.setState({ usuarioSeleccionado: id }, () => {
      this.onClose();
    });
  };

  onBotonBanerClick = () => {
    this.setState({ errorVisible: false });
  };

  onBotonCrearUsuarioClick = () => {
    this.setState({ dialogoUsuarioNuevoVisible: true });
  };

  onDialogoUsuarioNuevoClose = usuario => {
    this.setState({ dialogoUsuarioNuevoVisible: false });
    if (usuario) {
      this.setState({ usuarioSeleccionado: usuario.id }, () => {
        this.onClose();
      });
    }
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
        <DialogTitle>Buscar persona</DialogTitle>

        <DialogContent>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ flex: 1 }}>
              <TextField
                variant="outlined"
                fullWidth
                margin="dense"
                label="N° de Documento"
                value={this.state.dni || ""}
                onChange={this.onDniChange}
              />
            </div>

            <Fab style={{ marginLeft: 16 }} size="small" color="primary" onClick={this.onBotonBuscarClick}>
              <Icon>search</Icon>
            </Fab>
          </div>

          {this.state.data && this.state.data.length != 0 && (
            <List>
              {(this.state.data || []).map(item => {
                return (
                  <ListItem key={item.id + ""} button data-id={item.id} onClick={this.onUsuarioClick}>
                    <ListItemText>{item.nombre + " " + item.apellido}</ListItemText>
                  </ListItem>
                );
              })}
            </List>
          )}

          {this.state.yaBusque == true && this.state.data && this.state.data.length == 0 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: 16
              }}
            >
              <Typography variant="body1">Persona no encontrada</Typography>
              <Button variant="contained" color="primary" onClick={this.onBotonCrearUsuarioClick} style={{ marginTop: 16 }}>
                Crear
              </Button>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={this.onClose}>Cancelar</Button>
        </DialogActions>

        <div className={classNames(classes.cargando, this.state.cargando == true && "visible")}>
          <CircularProgress />
        </div>

        {/* Dialogo UsuarioNuevo */}
        <MiDialogoUsuarioNuevo visible={this.state.dialogoUsuarioNuevoVisible || false} onClose={this.onDialogoUsuarioNuevoClose} />
      </Dialog>
    );
  }
}

let componente = UsuarioPicker;
componente = withStyles(styles)(componente);
componente = withMobileDialog()(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
export default componente;
