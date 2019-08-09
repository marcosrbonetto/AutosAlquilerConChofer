import React from "react";

//Styles
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import withWidth, { isWidthUp } from "@material-ui/core/withWidth";
import styles from "./styles";

//Router
import { withRouter } from "react-router-dom";

//REDUX
import { connect } from "react-redux";
import { goBack, push } from "connected-react-router";
import { cerrarSesion } from "@Redux/Actions/usuario";
import { setVisible } from "@Redux/Actions/general";

//Mis componentes
import MiPagina from "@Componentes/MiPagina";
import MiContent from "@Componentes/MiContent";
import MenuApps from "../MenuApps";

//Recursos
import ToolbarLogo from "@Resources/imagenes/escudo_muni_texto_verde.png";
import ToolbarLogo_Chico from "@Resources/imagenes/escudo_muni_verde.png";

const mapStateToProps = state => {
  return {
    token: state.Usuario.token,
    usuario: state.Usuario.usuario
  };
};

const mapDispatchToProps = dispatch => ({
  goBack: () => {
    dispatch(goBack());
  },
  redirigir: url => {
    dispatch(push(url));
  },
  cerrarSesion: () => {
    dispatch(cerrarSesion());
  },
  setVisible: visible => {
    dispatch(setVisible(visible));
  }
});

class _MiPagina extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  onToolbarTituloClick = () => {
    this.props.redirigir("/");
  };

  onCerrarSesionClick = () => {
    this.props.setVisible(false);
    setTimeout(() => {
      this.props.cerrarSesion();
      window.location.href = window.Config.URL_LOGIN + "?url=" + this.props.location.pathname + this.props.location.search;
    }, 500);
  };

  onMiPerfilClick = () => {
    window.location.href = window.Config.URL_MI_PERFIL + "/#/?token=" + this.props.token;
  };

  onBreadcrumbClick = url => {
    this.props.redirigir(url);
  };

  render() {
    const { classes } = this.props;

    let toolbarLeftIconVisible = this.props.toolbarLeftIconVisible !== false;
    let toolbarLeftIcon = undefined;
    if (toolbarLeftIconVisible === true) {
      toolbarLeftIcon = this.props.toolbarLeftIcon || "arrow_back";
    }
    return (
      <React.Fragment>
        <MiPagina
          cargando={this.props.cargando}
          onBreadcrumbClick={this.onBreadcrumbClick}
          toolbarTitulo={this.props.toolbarTitulo || window.Config.NOMBRE_SISTEMA}
          toolbarSubtitulo={this.props.toolbarSubtitulo}
          toolbarBreadcrumbs={this.props.toolbarBreadcrumbs || []}
          breadcrumbs={this.props.breadcrumbs || []}
          toolbarClassName={classes.toolbar}
          toolbarRenderLogo={this.renderToolbarLogo()}
          toolbarChildren={this.renderApps()}
          toolbarLeftIcon={toolbarLeftIcon}
          toolbarLeftIconClick={this.props.toolbarLeftIconClick || this.props.goBack}
          onToolbarTituloClick={this.props.onToolbarTituloClick || this.onToolbarTituloClick}
          onToolbarMiPerfilClick={this.onMiPerfilClick}
          onToolbarCerrarSesionClick={this.onCerrarSesionClick}
          contentClassName={classNames(classes.paginaContent, this.props.contentClassName)}
        >
          <MiContent
            rootClassName={classNames(classes.miContentRootClassName, this.props.miContentRootClassName)}
            contentClassName={classNames(classes.miContentContentClassName, this.props.miContentContentClassName)}
            full={this.props.full || false}
          >
            {this.props.children}
          </MiContent>
        </MiPagina>
      </React.Fragment>
    );
  }
  renderToolbarLogo() {
    const { classes, width } = this.props;
    let url = isWidthUp("md", width) ? ToolbarLogo : ToolbarLogo_Chico;
    return <div className={classes.logoMuni} style={{ backgroundImage: "url(" + url + ")" }} />;
  }

  renderApps() {
    return (
      <React.Fragment>
        {this.props.toolbarChildren}
        <MenuApps token={this.props.token} />
      </React.Fragment>
    );
  }
}

let componente = _MiPagina;
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
componente = withStyles(styles)(componente);
componente = withWidth()(componente);
componente = withRouter(componente);
export default componente;
