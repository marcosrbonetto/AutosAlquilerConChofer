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
  ListItemText,
  ButtonBase
} from "@material-ui/core";

//Mis componentes
import MiBaner from "@Componentes/MiBaner";
import MiDialogoUsuarioNuevo from "../UsuarioNuevo";

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

class DialogoPDF extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible != this.props.visible && nextProps.visible) {
    }
  }

  onClose = () => {
    let cargando = this.state.cargando;
    if (cargando == true) return;
    this.props.onClose && this.props.onClose();
  };

  onBotonDescargarClick = () => {
    let { base64 } = this.props;
    const downloadLink = document.createElement("a");
    const fileName = "archivo.pdf";

    downloadLink.href = base64;
    downloadLink.download = fileName;
    downloadLink.click();
    downloadLink.remove();
  };

  render() {
    const { classes, fullScreen } = this.props;

    return (
      <Dialog
        fullWidth={true}
        maxWidth="xl"
        fullScreen={fullScreen || false}
        open={this.props.visible || false}
        onClose={this.onClose}
        classes={{ paper: classes.paper }}
        aria-labelledby="dialogo"
        onClick={e => {
          e.stopPropagation();
        }}
      >
        <DialogContent style={{ padding: 0, width: "100%", height: "100%", overflow: "hidden" }}>
          <object width="100%" height="100%" data={this.props.base64} src={this.props.base64}>
            <Button variant="outlined" style={{ margin: 16 }} color="primary" onClick={this.onBotonDescargarClick}>
              <Icon style={{ marginRight: 8 }}>cloud_download</Icon>
              Descargar archivo
            </Button>
          </object>
          {/* <embed width="100%" height="100%" name="plugin" id="plugin" src={this.props.base64} type="application/pdf">
            <p>Oops! You don't support PDFs!</p>
            <a href="some.pdf">Download Instead</a>
          </embed> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={this.onClose}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

let componente = DialogoPDF;
componente = withStyles(styles)(componente);
componente = withMobileDialog()(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
export default componente;
