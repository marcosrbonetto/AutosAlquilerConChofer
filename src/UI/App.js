import React from "react";

//Styles
import CssBaseline from "@material-ui/core/CssBaseline";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import "./style.css";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import styles from "./styles";

//Router
import { withRouter } from "react-router-dom";
import { Route, Redirect } from "react-router-dom";
import { AnimatedSwitch } from "react-router-transition";

//REDUX
import { connect } from "react-redux";
import { ocultarAlerta } from "@Redux/Actions/alerta";
import { login, cerrarSesion, seleccionarEntidad } from "@Redux/Actions/usuario";
import { setVisible } from "@Redux/Actions/general";
import { push, replace } from "connected-react-router";

//Componentes
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import { IconButton, Icon, Typography, CircularProgress } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import _ from "lodash";

//Mis componentes
import Pagina404 from "@UI/_Pagina404";
import Inscripciones from "@UI/Inscripciones";
import Inhabilitaciones from "@UI/Inhabilitaciones";
import Personas from "@UI/Personas";

//Mis rules
import Rules_MuniOnlineUsuario from "@Rules/Rules_MuniOnlineUsuario";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#149257"
    },
    secondary: {
      main: "#149257"
    },
    background: {
      default: "#eee"
    }
  }
});

const mapStateToProps = state => {
  return {
    usuario: state.Usuario.usuario,
    alertas: state.Alerta.alertas,
    visible: state.General.visible
  };
};

const mapDispatchToProps = dispatch => ({
  onAlertaClose: id => {
    dispatch(ocultarAlerta(id));
  },
  login: comando => {
    dispatch(login(comando));
  },
  cerrarSesion: () => {
    dispatch(cerrarSesion());
  },
  redireccionar: url => {
    dispatch(push(url));
  },
  replace: url => {
    dispatch(replace(url));
  },
  setVisible: visible => {
    dispatch(setVisible(visible));
  }
});

Promise.prototype.finally = function(callback) {
  return this.then(
    value => this.constructor.resolve(callback()).then(() => value),
    reason =>
      this.constructor.resolve(callback()).then(() => {
        throw reason;
      })
  );
};

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      validandoToken: false
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.props.setVisible(true);
      setTimeout(() => {
        this.consultarLoginInicial();
      }, 500);
    }, 100);
  }

  componentWillUnmount() {
    this.intervalo && clearInterval(this.intervalo);
  }

  consultarLoginInicial = () => {
    let token = localStorage.getItem("token");

    let search = this.props.location.search;
    if (search.startsWith("?")) {
      search = search.substring(1);
      search = new URLSearchParams(search);
      let tokenQueryString = search.get("token");
      if (tokenQueryString) {
        token = tokenQueryString;
      }
    }

    if (token == undefined || token == null || token == "undefined" || token == "") {
      console.log("Sin token");
      this.cerrarSesion();
      return;
    }

    this.setState({ validandoToken: true }, async () => {
      try {
        let datos = await Rules_MuniOnlineUsuario.procesarLogin(token);
        this.props.login({
          usuario: datos.usuario,
          token: datos.token
        });
        this.setState({ validandoToken: false });

        if (search) {
          let url = search.get("url") || "/";
          this.props.redireccionar(url);
        } else {
          // this.props.redireccionar("/");
        }

        this.onLogin();
      } catch (e) {
        console.log(e);
        this.cerrarSesion();
      }
    });
  };

  onLogin = () => {
    //Cada 5 seg valido el token
    this.intervalo = setInterval(async () => {
      let token = localStorage.getItem("token");
      if (token == undefined || token == null || token == "undefined") {
        console.log("Sin token");
        this.cerrarSesion();
        return;
      }

      try {
        let resultado = await Rules_MuniOnlineUsuario.validarToken(token);
        if (resultado == false) {
          console.log("token no valido");
          this.cerrarSesion();
          return;
        }
      } catch (e) {
        console.log(e);
        this.cerrarSesion();
      }
    }, 5000);
  };

  cerrarSesion = () => {
    this.props.setVisible(false);
    setTimeout(() => {
      this.props.cerrarSesion();
      window.location.href = window.Config.URL_LOGIN + "?url=" + this.props.location.pathname + this.props.location.search;
    }, 500);
  };

  render() {
    const { classes } = this.props;
    const login = this.state.validandoToken == false && this.props.usuario != undefined;

    return (
      <MuiThemeProvider theme={theme}>
        <div className={classNames(classes.root, this.props.visible && "visible")}>
          <CssBaseline />

          {this.renderContent()}
          {this.renderAlertas()}

          {/* Cargando */}
          <div className={classNames(classes.contenedorCargandoLogin, login != true && "visible")}>
            <CircularProgress style={{ marginBottom: 8 }} />
            <Typography variant="subheading">Cargando...</Typography>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }

  renderContent() {
    const { classes } = this.props;

    let base = "";

    const login = this.state.validandoToken == false && this.props.usuario != undefined;

    return (
      <main className={classes.content}>
        <AnimatedSwitch atEnter={{ opacity: 0 }} atLeave={{ opacity: 0 }} atActive={{ opacity: 1 }} className={"switch-wrapper"}>
          <Route exact path={`${base}/`} component={login ? Inscripciones : null} />
          {/* <Route exact path={`${base}/Inhabilitaciones`} component={login ? Inhabilitaciones : null} /> */}
          <Route exact path={`${base}/Personas`} component={login ? Personas : null} />
          <Route component={login ? Pagina404 : null} />
          {/* <Redirect exact from={`${base}/`} to={`${base}/Inscripciones`} /> */}
        </AnimatedSwitch>
      </main>
    );
  }

  renderAlertas() {
    const { classes } = this.props;

    return this.props.alertas.map((alerta, index) => {
      return (
        <Snackbar
          key={alerta.id}
          key={index}
          open={alerta.visible}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right"
          }}
          autoHideDuration={5000}
          onClose={() => {
            this.props.onAlertaClose(alerta.id);
          }}
          ContentProps={{
            "aria-describedby": "message-id" + alerta.id
          }}
        >
          <SnackbarContent
            style={{ backgroundColor: alerta.color }}
            aria-describedby="client-snackbar"
            message={
              <span id={"message-id" + alerta.id} className={classes.snackMessage}>
                {alerta.icono != undefined && <Icon className={classes.snackCustomIcon}>{alerta.icono}</Icon>}
                {alerta.texto}
              </span>
            }
            action={[
              alerta.mostrarIconoCerrar && (
                <IconButton
                  key="close"
                  aria-label="Close"
                  color="inherit"
                  onClick={() => {
                    this.props.onAlertaClose(alerta.id);
                  }}
                >
                  <CloseIcon className={classes.icon} />
                </IconButton>
              )
            ]}
          />
        </Snackbar>
      );
    });
  }
}

let componente = App;
componente = withStyles(styles)(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
componente = withRouter(componente);
export default componente;
