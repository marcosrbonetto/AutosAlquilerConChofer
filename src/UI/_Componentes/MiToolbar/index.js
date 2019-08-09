import React from "react";

//Styles
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import styles from "./styles";

//REDUX
import { connect } from "react-redux";
import { push } from "connected-react-router";

//Componentes
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Avatar from "@material-ui/core/Avatar";
import LinearProgress from "@material-ui/core/LinearProgress";
import Icon from "@material-ui/core/Icon";

//Mis componentes
import CordobaFilesUtils from "../Utils/CordobaFiles";
import { Button, ButtonBase } from "@material-ui/core";

// import Lottie from "react-lottie";
// import * as animNotificaciones from "@Resources/animaciones/anim_notificaciones.json";
// const opcionesLottieNotificaciones = {
//   loop: false,
//   animationData: animNotificaciones,

//   rendererSettings: {
//     preserveAspectRatio: "xMidYMid slice"
//   }
// };

const mapStateToProps = state => {
  return {
    usuario: state.Usuario.usuario
  };
};

const mapDispatchToProps = dispatch => {
  return {
    redirigir: url => {
      dispatch(push(url));
    }
  };
};

class MiToolbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      anchorPopupUsuario: undefined
      // menuNotificacionesAnchor: undefined,
      // conNotificaciones: true,
      // animacionLottiePausada: false
    };
  }

  componentDidMount() {
    // setTimeout(() => {
    //   this.setState({ conNotificaciones: true, animacionLottiePausada: false });
    //   setTimeout(() => {
    //     this.setState({ conNotificaciones: false, animacionLottiePausada: false });
    //   }, 2000);
    // }, 500);
  }

  onUsuarioPress = event => {
    if (this.props.cargando) return;
    this.setState({ anchorPopupUsuario: event.currentTarget });
  };

  onUsuarioMenuClose = () => {
    if (this.props.cargando) return;
    this.setState({ anchorPopupUsuario: null });
  };

  onBotonCerrarSesionPress = () => {
    if (this.props.cargando) return;
    this.setState({ anchorPopupUsuario: null });
    this.props.onCerrarSesionClick && this.props.onCerrarSesionClick();
  };

  onBotonNotificacionesClick = event => {
    if (this.props.cargando) return;
    this.setState({ menuNotificacionesAnchor: event.currentTarget });
  };

  onMenuNotificacionesClose = () => {
    if (this.props.cargando) return;
    this.setState({ menuNotificacionesAnchor: null });
  };

  onMiPerfilClick = () => {
    this.setState({ anchorPopupUsuario: null });
    this.props.onMiPerfilClick && this.props.onMiPerfilClick();
  };

  render() {
    let { classes, titulo, usuario, subtitulo, mostrarUsuario, breadcrumbs } = this.props;

    mostrarUsuario = mostrarUsuario == undefined || mostrarUsuario != false;

    let urlFotoPerfilMiniatura, urlFotoPerfil;
    if (usuario) {
      urlFotoPerfilMiniatura = CordobaFilesUtils.getUrlFotoMiniatura(usuario.identificadorFotoPersonal, usuario.sexoMasculino);
      urlFotoPerfil = CordobaFilesUtils.getUrlFotoMediana(usuario.identificadorFotoPersonal, usuario.sexoMasculino);
    }

    return (
      <AppBar position="absolute" className={classNames(classes.appBar)}>
        <Toolbar disableGutters={true} className={classNames(classes.toolbar, this.props.className)}>
          {this.props.renderLeftIcon !== undefined && this.props.renderLeftIcon()}

          {this.props.renderLeftIcon === undefined && this.props.leftIcon !== undefined && (
            <IconButton
              className={this.props.leftIconClassName}
              color="inherit"
              aria-label={this.props.leftIconHint || "Boton del toolbar"}
              onClick={this.props.leftIconClick}
            >
              <Icon>{this.props.leftIcon}</Icon>
            </IconButton>
          )}

          {/* Logo muni */}
          {this.props.renderLogo}

          {/* Cuerpo */}
          <div className={classes.contenedorCuerpo}>
            <div className={classes.contenedorTitulo}>
              <Typography
                variant="title"
                color="inherit"
                className={"titulo"}
                noWrap
                onClick={this.props.onTituloClick}
                style={{ cursor: "pointer" }}
              >
                {titulo}
              </Typography>
              {subtitulo && (
                <Typography className="subtitulo" variant="subheading" color="inherit" noWrap>
                  {subtitulo}
                </Typography>
              )}
            </div>

            {/* Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length != 0 && (
              <div className={classes.contenedorBreadcrumbs}>
                {breadcrumbs.map((bread, index) => {
                  return (
                    <div className="breadcrumb">
                      <Typography variant="subtitle1" className="texto" noWrap>
                        {bread.texto}
                      </Typography>
                      {index != breadcrumbs.length - 1 && <Icon className="icono">chevron_right</Icon>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {this.props.children}

          {/* Boton notificaciones */}
          {/* <IconButton onClick={this.onBotonNotificacionesClick} color="inherit" style={{ overflow: "hidden" }}>
            <Lottie
              isPaused={this.state.animacionLottiePausada == true}
              options={opcionesLottieNotificaciones}
              height={48}
              width={48}
              direction={this.state.conNotificaciones == true ? 1 : -1}
              eventListeners={[
                {
                  eventName: "enterFrame",
                  callback: a => {
                    if (a.currentTime > 50) {
                      this.setState({ animacionLottiePausada: true });
                    }
                  }
                }
              ]}
              style={{ transform: "scale(4)" }}
            />
          </IconButton> */}

          {/* Icono del usuario */}
          {mostrarUsuario && usuario && (
            <IconButton onClick={this.onUsuarioPress} className={classes.botonUsuario} color="inherit">
              <Avatar alt="Menu del usuario" src={urlFotoPerfilMiniatura} className={classNames(classes.icono)} />
            </IconButton>
          )}
        </Toolbar>

        {mostrarUsuario && usuario && (
          <Menu
            id="simple-menu"
            anchorEl={this.state.anchorPopupUsuario}
            getContentAnchorEl={null}
            className={classes.menuUsuario}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            open={Boolean(this.state.anchorPopupUsuario)}
            onClose={this.onUsuarioMenuClose}
          >
            <div className={classes.menuUsuarioInfo} style={{ display: "flex" }}>
              <Avatar alt="Menu del usuario" src={urlFotoPerfil} className={classNames(classes.icono)} />
              <Typography align="center" variant="subheading" color="inherit">
                {this.props.usuario.nombre + " " + this.props.usuario.apellido}
              </Typography>
            </div>

            <MenuItem divider onClick={this.onMiPerfilClick}>
              Mi perfil
            </MenuItem>
            <MenuItem onClick={this.onBotonCerrarSesionPress}>Cerrar sesión</MenuItem>
          </Menu>
        )}

        {/* Menu Notificaciones */}
        {/* <Menu
          id="menuNotificaciones"
          anchorEl={this.state.menuNotificacionesAnchor}
          getContentAnchorEl={null}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={Boolean(this.state.menuNotificacionesAnchor)}
          onClose={this.onMenuNotificacionesClose}
          PaperProps={{
            style: {
              maxHeight: 300,
              width: 200
            }
          }}
        >
          <MenuItem>Notificacion 1</MenuItem>
          <MenuItem>Notificacion 1</MenuItem>
          <MenuItem>Notificacion 1</MenuItem>
          <MenuItem>Notificacion 1</MenuItem>
          <MenuItem>Notificacion 1</MenuItem>
          <MenuItem>Notificacion 1</MenuItem>
          <MenuItem>Notificacion 1</MenuItem>
          <MenuItem>Notificacion 1</MenuItem>
          <MenuItem>Notificacion 1</MenuItem>
        </Menu> */}

        <div className={classNames(classes.contenedorCargando, this.props.cargando === true && classes.contenedorCargandoVisible)}>
          <LinearProgress color="secondary" />
        </div>
      </AppBar>
    );
  }
}

let componente = undefined;
componente = withStyles(styles)(MiToolbar);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
export default componente;
