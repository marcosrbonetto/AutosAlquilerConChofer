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
import { push } from "connected-react-router";
import { mostrarAlertaVerde, mostrarAlertaNaranja, mostrarAlertaRoja } from "@Redux/Actions/alerta";
import { toggleDrawer } from "@Redux/Actions/drawer";

//Compontes
import _ from "lodash";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Fab from "@material-ui/core/Fab";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import memoize from "memoize-one";
import IconDeleteOutlined from "@material-ui/icons/DeleteOutlined";
import IconEditOutlined from "@material-ui/icons/EditOutlined";
import IconAddOutlined from "@material-ui/icons/AddOutlined";
import IconSearchOutlined from "@material-ui/icons/SearchOutlined";
import IconErrorOutlined from "@material-ui/icons/ErrorOutlined";
import IconStarOutlined from "@material-ui/icons/StarOutlined";
import IconStartBorderOutlined from "@material-ui/icons/StarBorderOutlined";
import red from "@material-ui/core/colors/red";
import amber from "@material-ui/core/colors/amber";

//Mis Componentes
import MiPagina from "@Componentes/MiPaginaMuni";
import MiBaner from "@Componentes/MiBaner";
import MiTablaPaginada from "@Componentes/MiTablaPaginada";
import MiDialogoMensaje from "@Componentes/MiDialogoMensaje";
import MiDialogoUsuarioNuevo from "../_Dialogos/UsuarioNuevo";
import DateUtils from "@Componentes/Utils/Date";
import MiDialogoUsuarioConsulta from "../_Dialogos/UsuarioConsulta";

//Rules
import Rules_Usuario from "@Rules/Rules_Usuario";

const mapStateToProps = state => {
  return {
    usuario: state.Usuario.usuario,
    token: state.Usuario.token,
    drawerOpen: state.Drawer.open
  };
};

const mapDispatchToProps = dispatch => ({
  redireccionar: url => {
    dispatch(push(url));
  },
  mostrarAlertaVerde: comando => {
    dispatch(mostrarAlertaVerde(comando));
  },
  mostrarAlertaNaranja: comando => {
    dispatch(mostrarAlertaNaranja(comando));
  },
  mostrarAlertaRoja: comando => {
    dispatch(mostrarAlertaRoja(comando));
  },
  toggleDrawer: () => {
    dispatch(toggleDrawer());
  }
});

const TABLA_ORDER_BY_NOMBRE = 1;
const TABLA_ORDER_BY_DNI = 2;
const TABLA_ORDER_BY_FECHA_NACIMIENTO = 3;

class Personas extends React.Component {
  constructor(props) {
    super(props);

    let tam = localStorage.getItem("tablaTamañoPagina");
    if (tam) tam = parseInt(tam);
    else tam = 50;

    this.state = {
      cargando: false,
      visible: false,
      tablaCount: 0,
      tablaTamañoPagina: tam,
      tablaPaginaActual: 0,
      tablaOrderBy: TABLA_ORDER_BY_NOMBRE,
      tablaOrderByAsc: true,
      tablaData: [],
      filtros: {}
    };
  }

  componentDidMount() {
    this.init();
  }

  init = async () => {
    this.setState({ cargando: true });

    try {
      var resultado = await Rules_Usuario.esOperador();
      if (resultado != true) {
        this.setState({
          cargando: false,
          errorMensaje: "No tiene el permiso necesario para acceder a este sistema",
          errorVisible: true
        });
        return;
      }

      this.setState({ visible: true });
      this.buscar();
    } catch (ex) {
      let mensaje = typeof ex === "object" ? ex.message : ex;
      this.setState({ errorVisible: true, errorMensaje: mensaje, cargando: false });
    }
  };

  buscar = async pagina => {
    this.setState({ cargando: true });
    try {
      let comando = {
        pagina: pagina || 0,
        tamañoPagina: this.state.tablaTamañoPagina,
        orderBy: this.state.tablaOrderBy,
        orderByAsc: this.state.tablaOrderByAsc
      };
      if (this.state.filtros && this.state.filtros.dni) {
        comando.dni = this.state.filtros.dni;
      }
      if (this.state.filtros && this.state.filtros.nombre) {
        comando.nombre = this.state.filtros.nombre;
      }
      if (this.state.filtros && this.state.filtros.conError != undefined) {
        comando.conError = this.state.filtros.conError == true;
      }
      if (this.state.filtros && this.state.filtros.favorito != undefined) {
        comando.favorito = this.state.filtros.favorito == true;
      }
      let data = await Rules_Usuario.buscarPaginado(comando);
      let cantidadConError = await Rules_Usuario.getCantidadConError();
      this.setState({
        tablaData: data.data,
        tablaCount: data.count,
        tablaPaginaActual: data.paginaActual,
        cargando: false,
        cantidadConError: cantidadConError
      });
    } catch (ex) {
      console.log(ex);
      let mensaje = typeof ex === "object" ? ex.message : "Error procesando la solicitud";
      this.setState({ cargando: false, errorVisible: true, errorMensaje: mensaje });
    }
  };

  onTablaPaginaChange = (e, index) => {
    if (index == this.state.tablaPaginaActual) return;

    this.setState({ data: [], tablaPaginaActual: index });
    this.buscar(index);
  };

  onTablaPaginaTamChange = (a, b) => {
    var tam = b.key;

    if (this.state.tablaTamañoPagina == tam) return;

    localStorage.setItem("tablaTamañoPagina", tam);
    this.setState({ tablaTamañoPagina: tam }, () => {
      this.buscar();
    });
  };

  onTablaColumnaNombreRender = item => {
    if (item.apellido && item.apellido.trim() != "" && item.nombre && item.nombre.trim() != "") {
      return `${item.apellido} ${item.nombre}`;
    }

    if (item.apellido && item.apellido.trim() != "") return item.apellido.trim();
    if (item.nombre && item.nombre.trim() != "") return item.nombre.trim();
    return "";
  };

  onTablaColumnaFechaNacimientoRender = item => {
    if (item.fechaNacimiento == undefined) return "";
    return DateUtils.toDateString(DateUtils.toDate(item.fechaNacimiento));
  };

  onTablaColumnaSexoRender = item => {
    if (item.sexoMasculino == undefined) return "";
    return item.sexoMasculino == true ? "Masculino" : "Femenino";
  };

  onTablaHeaderDniClick = () => {
    this.cambiarOrdenamientoTabla(TABLA_ORDER_BY_DNI);
  };

  onTablaHeaderNombreClick = () => {
    this.cambiarOrdenamientoTabla(TABLA_ORDER_BY_NOMBRE);
  };

  onTablaHeaderFechaNacimientoClick = () => {
    this.cambiarOrdenamientoTabla(TABLA_ORDER_BY_FECHA_NACIMIENTO);
  };

  cambiarOrdenamientoTabla = orderBy => {
    if (this.state.tablaOrderBy == orderBy) {
      this.setState({ tablaOrderByAsc: !this.state.tablaOrderByAsc }, () => {
        this.buscar();
      });
    } else {
      this.setState(
        {
          tablaOrderBy: orderBy,
          tablaOrderByAsc: true
        },
        () => {
          this.buscar();
        }
      );
    }
  };

  onTablaColumnaErrorRender = entity => {
    if (entity.error) {
      return (
        <Tooltip title={entity.error} disableFocusListener={true}>
          <IconErrorOutlined style={{ color: red["700"] }} />
        </Tooltip>
      );
    } else {
      return <div />;
    }
  };

  onTablaCellBotonesRender = item => {
    return (
      <React.Fragment>
        <div style={{ minWidth: 40 * 2 }}>
          <Tooltip title="Editar" disableFocusListener={true}>
            <IconButton data-id={item.id} onClick={this.onTablaBotonEditarClick}>
              <IconEditOutlined style={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>

          {item.favorito == true && (
            <Tooltip title="Quitar de favoritos" disableFocusListener={true}>
              <IconButton data-id={item.id} onClick={this.onTablaBotonFavoritoClick}>
                <IconStarOutlined style={{ fontSize: 16, color: amber["600"] }} />
              </IconButton>
            </Tooltip>
          )}

          {item.favorito == false && (
            <Tooltip title="Agregar a favoritos" disableFocusListener={true}>
              <IconButton data-id={item.id} onClick={this.onTablaBotonFavoritoClick}>
                <IconStartBorderOutlined style={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title="Borrar" disableFocusListener={true}>
            <IconButton data-id={item.id} onClick={this.onTablaBotonBorrarClick}>
              <IconDeleteOutlined style={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </div>
      </React.Fragment>
    );
  };

  onTablaBotonEditarClick = e => {
    let id = e.currentTarget.attributes["data-id"].value;
    this.mostrarDialogoEditar(id);
  };

  onTablaBotonBorrarClick = e => {
    let id = e.currentTarget.attributes["data-id"].value;
    this.mostrarDialogoConfirmarBorrar(id);
  };

  onTablaBotonFavoritoClick = async e => {
    let id = e.currentTarget.attributes["data-id"].value;

    try {
      this.setState({ cargando: true });
      await Rules_Usuario.toggleFavorito(id);
      this.buscar(this.state.tablaPaginaActual);
    } catch (ex) {
      this.setState({ cargando: false });
      let mensaje = typeof ex === "object" ? ex.message : ex;
      this.props.mostrarAlertaRoja({ texto: mensaje });
    }
  };

  //Dialogo confirmar borrar

  mostrarDialogoConfirmarBorrar = id => {
    this.setState({ dialogoConfirmarBorrarVisible: true, dialogoConfirmarBorrarId: id });
  };

  onDialogoConfirmarBorrarClose = () => {
    this.setState({ dialogoConfirmarBorrarVisible: false });
  };

  onDialogoConfirmarBorrarBotonSiClick = async () => {
    let id = this.state.dialogoConfirmarBorrarId;
    let item = _.find(this.state.tablaData, x => {
      return x.id == id;
    });
    if (item == undefined) return;
    this.setState({ cargando: true });
    try {
      let resultado = await Rules_Usuario.borrar(id);
      if (resultado != true) {
        this.props.mostrarAlertaRoja({ texto: "Error procesando la solicitud" });
        this.setState({ cargando: false });
        return;
      }
      this.buscar(this.state.tablaPaginaActual);
    } catch (ex) {
      let mensaje = typeof ex === "object" ? ex.message : "Error procesando la solicitud";
      this.props.mostrarAlertaRoja({ texto: mensaje });
      this.setState({ cargando: false });
    }
  };

  //Dialogo nuevo
  onBotonNuevoClick = () => {
    this.mostrarDialogoNuevo();
  };

  mostrarDialogoNuevo = () => {
    this.setState({ dialogoNuevoVisible: true });
  };

  onDialogoNuevoClose = exito => {
    this.setState({ dialogoNuevoVisible: false });
    if (exito != undefined) {
      this.buscar();
    }
  };

  //Dialogo editar
  mostrarDialogoEditar = (id, titular) => {
    this.setState({ dialogoEditarVisible: true, dialogoEditarId: id, dialogoEditarTitular: titular });
  };

  onDialogoEditarClose = exito => {
    this.setState({ dialogoEditarVisible: false });
    if (exito != undefined) {
      this.buscar(this.state.tablaPaginaActual);
    }
  };

  //Filtros
  onBotonBuscarClick = () => {
    this.setState({ dialogoBuscarVisible: true });
  };

  onBotonCancelarFiltrosClick = () => {
    this.setState({ filtros: {} }, () => {
      this.buscar();
    });
  };

  onDialogoBuscarClose = busqueda => {
    if (busqueda == undefined) {
      this.setState({ dialogoBuscarVisible: false });
      return;
    }

    let conFiltro = false;
    if (busqueda.dni && busqueda.dni != "") conFiltro = true;
    if (busqueda.nombre && busqueda.nombre != "") conFiltro = true;
    if (busqueda.conError != undefined) conFiltro = true;
    if (busqueda.favorito != undefined) conFiltro = true;

    if (!conFiltro) {
      this.props.mostrarAlertaNaranja({ texto: "Ingrese algun filtro" });
      return;
    }

    this.setState(
      {
        dialogoBuscarVisible: false,
        filtros: {
          tipoInhabilitacion: busqueda.tipoInhabilitacion,
          dni: busqueda.dni,
          nombre: busqueda.nombre,
          conError: busqueda.conError,
          favorito: busqueda.favorito
        }
      },
      () => {
        this.buscar();
      }
    );
  };

  isConFiltros = memoize(filtros => {
    let conFiltro = false;
    for (var property in filtros) {
      if (filtros.hasOwnProperty(property)) {
        if (filtros[property] != undefined) {
          conFiltro = true;
        }
      }
    }

    return conFiltro;
  });

  getTextoFiltros = memoize(filtros => {
    if (!this.isConFiltros(filtros)) return <div />;

    let f = [];

    if (filtros.dni && filtros.dni.trim() != "") {
      f.push({ key: "N° de Documento", value: filtros.dni.trim() });
    }

    if (filtros.nombre && filtros.nombre.trim() != "") {
      f.push({ key: "Nombre", value: filtros.nombre.trim() });
    }

    if (filtros.conError != undefined) {
      f.push({ key: "Con error", value: filtros.conError == true ? "Si" : "No" });
    }

    if (filtros.favorito != undefined) {
      f.push({ key: "Favorito", value: filtros.favorito == true ? "Si" : "No" });
    }
    return (
      <div>
        {f.map((item, index) => {
          return (
            <Typography key={index}>
              <b>{item.key}:</b> {item.value}
            </Typography>
          );
        })}
      </div>
    );
  });

  onBotonRegistrosConErrorClick = () => {
    this.setState({ filtros: { conError: true } }, () => {
      this.buscar();
    });
  };

  //Menu
  onBotonInscripcionesClick = e => {
    this.props.toggleDrawer();
    setTimeout(() => {
      this.props.redireccionar("/");
    }, 300);
  };

  onBotonInhabilitacionesClick = e => {
    this.props.toggleDrawer();
    setTimeout(() => {
      this.props.redireccionar("/Inhabilitaciones");
    }, 300);
  };

  onBotonPersonasClick = () => {
    this.props.toggleDrawer();
    this.onBotonCancelarFiltrosClick();
  };

  render() {
    const { classes, usuario, width } = this.props;
    if (usuario == undefined) return null;
    const isMobile = !isWidthUp("md", width);

    return (
      <React.Fragment>
        <MiPagina
          full
          toolbarSubtitulo="Personas"
          toolbarLeftIcon="menu"
          toolbarLeftIconClick={this.props.toggleDrawer}
          cargando={this.state.cargando}
          onToolbarTituloClick={this.onToolbarTituloClick}
          contentClassName={classNames(classes.contentClassName, this.props.drawerOpen && "drawerVisible")}
        >
          <React.Fragment>
            {this.renderDrawer()}

            <div className={classes.contenedorBaners}>
              {/* Error */}
              <MiBaner
                modo="error"
                botonVisible={true}
                onBotonClick={() => {
                  this.setState({ errorVisible: false });
                }}
                mensaje={this.state.errorMensaje || ""}
                visible={this.state.errorVisible || false}
                className={classes.baner}
                onClose={this.onBanerErrorClose}
              />
            </div>

            {this.state.visible == true && (
              <React.Fragment>
                <div style={{ display: "flex", margin: 8, marginBottom: 16, alignItems: "center" }}>
                  <Fab variant="extended" style={{ backgroundColor: "white" }} onClick={this.onBotonNuevoClick}>
                    <IconAddOutlined style={{ marginRight: 8 }} />
                    Nuevo
                  </Fab>

                  <div style={{ flex: 1 }} />

                  {/* Boton registros con error  */}
                  {this.state.cantidadConError && this.state.cantidadConError > 0 && isMobile == false && (
                    <Tooltip title={`Ver ${this.state.cantidadConError} registros con errror`}>
                      <Button variant="outlined" style={{ marginRight: 16 }} onClick={this.onBotonRegistrosConErrorClick}>
                        <IconErrorOutlined style={{ marginRight: 8, color: red["600"] }} />
                        {this.state.cantidadConError} errores
                      </Button>
                    </Tooltip>
                  )}
                  {this.state.cantidadConError && this.state.cantidadConError > 0 && isMobile == true && (
                    <Tooltip title={`Ver ${this.state.cantidadConError} registros con errror`}>
                      <IconButton onClick={this.onBotonRegistrosConErrorClick}>
                        <IconErrorOutlined style={{ color: red["600"] }} />
                      </IconButton>
                    </Tooltip>
                  )}

                  {/* Buscar  */}
                  {isMobile == false && (
                    <Button onClick={this.onBotonBuscarClick}>
                      <IconSearchOutlined style={{ marginRight: 8 }} />
                      Buscar
                    </Button>
                  )}

                  {isMobile == true && (
                    <IconButton onClick={this.onBotonBuscarClick}>
                      <IconSearchOutlined />
                    </IconButton>
                  )}
                </div>

                <Card className={classNames(classes.collapseCard, this.isConFiltros(this.state.filtros) && "visible")}>
                  <div className={classes.cardFiltrosActivos}>
                    <div>
                      <Typography variant="body2">Filtros activos: </Typography>
                      {this.getTextoFiltros(this.state.filtros)}
                    </div>

                    <Button variant="outlined" onClick={this.onBotonCancelarFiltrosClick}>
                      Cancelar filtros
                    </Button>
                  </div>
                </Card>

                <Card style={{ borderRadius: 16, overflowX: "auto" }}>
                  <MiTablaPaginada
                    cols={[
                      {
                        id: "error",
                        label: "",
                        render: this.onTablaColumnaErrorRender
                      },
                      {
                        id: "dni",
                        label: "N° de Documento",
                        onHeaderClick: this.onTablaHeaderDniClick,
                        orderBy: this.state.tablaOrderBy == TABLA_ORDER_BY_DNI ? this.state.tablaOrderByAsc : undefined
                      },
                      {
                        id: "nombre",
                        label: "Apellido y Nombre",
                        render: this.onTablaColumnaNombreRender,
                        onHeaderClick: this.onTablaHeaderNombreClick,
                        orderBy: this.state.tablaOrderBy == TABLA_ORDER_BY_NOMBRE ? this.state.tablaOrderByAsc : undefined
                      },
                      {
                        id: "sexo",
                        label: "Sexo",
                        render: this.onTablaColumnaSexoRender
                      },
                      {
                        id: "fechaNacimiento",
                        label: "Fecha de Nacimiento",
                        render: this.onTablaColumnaFechaNacimientoRender,
                        onHeaderClick: this.onTablaHeaderFechaNacimientoClick,
                        orderBy: this.state.tablaOrderBy == TABLA_ORDER_BY_FECHA_NACIMIENTO ? this.state.tablaOrderByAsc : undefined
                      },

                      {
                        id: "botones",
                        label: "",
                        render: this.onTablaCellBotonesRender
                      }
                    ]}
                    rows={this.state.tablaData}
                    rowsPerPage={this.state.tablaTamañoPagina}
                    count={this.state.tablaCount}
                    page={this.state.tablaPaginaActual}
                    onChangePage={this.onTablaPaginaChange}
                    onChangeRowsPerPage={this.onTablaPaginaTamChange}
                  />
                </Card>
              </React.Fragment>
            )}
          </React.Fragment>
        </MiPagina>

        {this.renderDialogos()}
      </React.Fragment>
    );
  }

  renderDialogos() {
    return (
      <React.Fragment>
        {/* Dialogo confirmar borrar */}
        <MiDialogoMensaje
          onClose={this.onDialogoConfirmarBorrarClose}
          onBotonSiClick={this.onDialogoConfirmarBorrarBotonSiClick}
          titulo="Confirmar acción"
          textoSi="Borrar"
          textoNo="Cancelar"
          mensaje="¿Esta seguro que desea borrar el registro seleccionado?"
          visible={this.state.dialogoConfirmarBorrarVisible || false}
        />

        {/* Nuevo  */}
        <MiDialogoUsuarioNuevo visible={this.state.dialogoNuevoVisible || false} onClose={this.onDialogoNuevoClose} />

        {/* Editar  */}
        <MiDialogoUsuarioNuevo
          visible={this.state.dialogoEditarVisible || false}
          onClose={this.onDialogoEditarClose}
          editar={true}
          id={this.state.dialogoEditarId || 0}
        />

        {/* Buscar */}
        <MiDialogoUsuarioConsulta visible={this.state.dialogoBuscarVisible || false} onClose={this.onDialogoBuscarClose} />
      </React.Fragment>
    );
  }

  renderDrawer() {
    const { classes, width } = this.props;
    let isMobile = !isWidthUp("md", width);

    return (
      <SwipeableDrawer
        classes={{ paper: classes.drawer }}
        variant={isMobile ? "temporary" : "persistent"}
        open={this.props.drawerOpen}
        onClose={this.props.toggleDrawer}
        onOpen={this.props.toggleDrawer}
      >
        <List>
          <ListItem button className="item" onClick={this.onBotonInscripcionesClick}>
            <ListItemText primary="Licencias" />
          </ListItem>
          {/* <ListItem button className="item" onClick={this.onBotonInhabilitacionesClick} style={{ marginTop: 8 }}>
            <ListItemText primary="Inhabilitaciones" />
          </ListItem> */}
          <ListItem
            button
            className="item"
            style={{ backgroundColor: "rgba(0,0,0,0.1)", marginTop: 8 }}
            onClick={this.onBotonPersonasClick}
          >
            <ListItemText primary="Personas" />
          </ListItem>
        </List>
      </SwipeableDrawer>
    );
  }
}

let componente = Personas;
componente = withStyles(styles)(componente);
componente = withWidth()(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
componente = withRouter(componente);
export default componente;
