import React from "react";

//Styles
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import withWidth from "@material-ui/core/withWidth";
import "@UI/transitions.css";

import styles from "./styles";

//REDUX
import { connect } from "react-redux";

//Componentes
import Typography from "@material-ui/core/Typography";
import Icon from "@material-ui/core/Icon";
import Button from "@material-ui/core/Button";
import IconAppsOutlined from "@material-ui/icons/AppsOutlined";
import _ from "lodash";

import { Avatar, Menu, CircularProgress, Dialog, DialogContent, DialogTitle, DialogActions } from "@material-ui/core";

const mapDispatchToProps = dispatch => ({});

const mapStateToProps = state => {
  return { usuario: state.Usuario.usuario };
};

class MenuApps extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      anchor: undefined
    };
  }

  componentDidMount() {
    this.buscarApps();
  }

  onBotonClick = e => {
    this.setState({ anchor: e.currentTarget });
  };

  buscarApps = () => {
    if (this.state.apps) return;
    const url = `https://servicios2.cordoba.gov.ar/WSVecinoVirtual_Bridge/v3/AplicacionPanel`;

    this.setState({ cargando: true });
    fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(data => {
        if (data.ok !== true) {
          this.setState({ errorVisible: true, errorMensaje: "Error buscando las apps" });
          return;
        }
        return data.json();
      })
      .then(info => {
        if (info.ok != true) {
          this.setState({ errorVisible: true, errorMensaje: "Error buscando las apps" });
          return;
        }

        this.setState({ apps: info.return });
      })
      .catch(error => {
        this.setState({ errorVisible: true, errorMensaje: "Error buscando las apps" });
      })
      .finally(() => {
        this.setState({ cargando: false });
      });
  };

  onClose = () => {
    this.setState({ anchor: null });
  };

  render() {
    const { classes, token } = this.props;

    var urlPanel = "";
    if (token) {
      urlPanel = "https://servicios2.cordoba.gov.ar/MuniOnlinePanel/#/?token=" + token;
    } else {
      urlPanel = "https://servicios2.cordoba.gov.ar/MuniOnlinePanel";
    }

    return (
      <React.Fragment>
        <Button
          variant="text"
          className={classes.boton}
          onClick={this.onBotonClick}
          style={{ color: this.props.color || "rgba(0,0,0,0.7)" }}
        >
          <IconAppsOutlined className={"icon"} style={{ color: this.props.color || "rgba(0,0,0,0.7)" }} />
          <Typography className="textoServicios">Servicios</Typography>
        </Button>

        <Menu
          id="simple-menu"
          anchorEl={this.state.anchor}
          getContentAnchorEl={null}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right"
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right"
          }}
          open={Boolean(this.state.anchor)}
          onClose={this.onClose}
        >
          <div className={classes.menu}>
            {this.state.cargando == true && <CircularProgress />}
            {this.state.apps && (
              <div className={classes.apps}>
                {this.state.apps.map((app, index) => {
                  return <BotonApp app={app} key={index} classes={classes} token={token} />;
                })}
              </div>
            )}
            {this.state.cargando == false && (
              <Button variant="outlined" color="primary" href={urlPanel}>
                Ir al panel
              </Button>
            )}
          </div>
        </Menu>
      </React.Fragment>
    );
  }
}
class BotonApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  onClick = () => {
    let { app, token } = this.props;
    let { impedirAcceso, mostrarMensaje, mensaje } = app;

    let nombre = app.nombre || "";
    if (nombre.indexOf(".") != -1) {
      nombre = nombre.split(".")[1].trim();
    }

    let url = "";
    if (token && app.urlToken) {
      url = app.urlToken.replace("{token}", token);
    } else {
      url = app.url;
    }

    if (mostrarMensaje == true) {
      this.setState({
        dialogoMensajeVisible: true,
        dialogoMensajeTitulo: nombre,
        dialogoMensajeMensaje: mensaje
      });
      return;
    }

    window.location.href = url;
  };

  onDialogoMensajeClose = () => {
    this.setState({
      dialogoMensajeVisible: false
    });
  };

  onDialogoBotonClick = () => {
    this.setState({ dialogoMensajeVisible: false });

    let { app, token } = this.props;
    let { impedirAcceso } = app;
    if (impedirAcceso == true) return;

    let url = "";
    if (token && app.urlToken) {
      url = app.urlToken.replace("{token}", token);
    } else {
      url = app.url;
    }

    window.location.href = url;
  };

  render() {
    let { classes, app, token } = this.props;

    var nombre = app.nombre || "";
    if (nombre.indexOf(".") != -1) {
      nombre = nombre.split(".")[1].trim();
    }

    return (
      <React.Fragment>
        <Button className={"app"} onClick={this.onClick}>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <Avatar src={app.urlIcono} className="icono" />
            <Typography className="nombre">{nombre}</Typography>
          </div>
        </Button>

        <Dialog open={this.state.dialogoMensajeVisible || false} onClose={this.onDialogoMensajeClose}>
          <DialogTitle>{this.state.dialogoMensajeTitulo || ""}</DialogTitle>
          <DialogContent>
            <Typography variant="body1">{this.state.dialogoMensajeMensaje || ""}</Typography>
          </DialogContent>
          <DialogActions>
            <Button>Cancelar</Button>
            <Button color="primary" onClick={this.onDialogoBotonClick}>
              Aceptar
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}

let componente = MenuApps;
componente = withStyles(styles)(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);

export default componente;
