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
import { setData as setTiposAuto } from "@Redux/Actions/tipoAuto";
import { setData as setTiposInscripcion } from "@Redux/Actions/tipoInscripcion";

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
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import memoize from "memoize-one";

//Colors
import red from "@material-ui/core/colors/red";
import amber from "@material-ui/core/colors/amber";

//Icons
import IconDeleteOutlined from "@material-ui/icons/DeleteOutlined";
import IconEditOutlined from "@material-ui/icons/EditOutlined";
import IconAddOutlined from "@material-ui/icons/AddOutlined";
import IconSearchOutlined from "@material-ui/icons/SearchOutlined";
import IconErrorOutlined from "@material-ui/icons/ErrorOutlined";
import IconStarOutlined from "@material-ui/icons/StarOutlined";
import IconStartBorderOutlined from "@material-ui/icons/StarBorderOutlined";
import IconAssignmentOutlined from "@material-ui/icons/AssignmentOutlined";

//Mis Componentes
import MiPagina from "@Componentes/MiPaginaMuni";
import MiBaner from "@Componentes/MiBaner";
import MiTablaPaginada from "@Componentes/MiTablaPaginada";
import MiDialogoForm from "@Componentes/MiDialogoForm";
import MiDialogoMensaje from "@Componentes/MiDialogoMensaje";
import MiDialogoInscripcionNuevo from "../_Dialogos/InscripcionNuevo";
import MiDialogoInscripcionConsulta from "../_Dialogos/InscripcionConsulta";
import MiDialogoPDF from "../_Dialogos/PDF";
import DateUtils from "@Componentes/Utils/Date";

//Rules
import Rules_Inscripcion from "@Rules/Rules_Inscripcion";
import Rules_Usuario from "@Rules/Rules_Usuario";
import Rules_TipoInscripcion from "@Rules/Rules_TipoInscripcion";
import Rules_TipoAuto from "@Rules/Rules_TipoAuto";
import Rules_Reporte from "@Rules/Rules_Reporte";

const mapStateToProps = state => {
  return {
    usuario: state.Usuario.usuario,
    token: state.Usuario.token,
    drawerOpen: state.Drawer.open,
    tiposAuto: state.TipoAuto.data,
    tiposInscripcion: state.TipoInscripcion.data
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
  },
  setTiposAuto: comando => {
    dispatch(setTiposAuto(comando));
  },
  setTiposInscripcion: comando => {
    dispatch(setTiposInscripcion(comando));
  }
});

const TABLA_ORDER_BY_IDENTIFICADOR = 1;
const TABLA_ORDER_BY_TIPO_INSCRIPCION = 2;
const TABLA_ORDER_BY_TIPO_AUTO = 3;
const TABLA_ORDER_BY_FECHA_INICIO = 4;
const TABLA_ORDER_BY_FECHA_FIN = 5;
const TABLA_ORDER_BY_USUARIO = 6;

class Inscripciones extends React.Component {
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
      tablaOrderBy: TABLA_ORDER_BY_IDENTIFICADOR,
      tablaOrderByAsc: true,
      tablaData: []
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

      let tiposAuto;
      if (this.props.tiposAuto && this.props.tiposAuto.length != 0) {
        tiposAuto = this.props.tiposAuto;
      } else {
        tiposAuto = await Rules_TipoAuto.get();
        this.props.setTiposAuto(tiposAuto);
      }

      let tiposInscripcion;
      if (this.props.tiposInscripcion && this.props.tiposInscripcion.length != 0) {
        tiposInscripcion = this.props.tiposInscripcion;
      } else {
        tiposInscripcion = await Rules_TipoInscripcion.get();
        this.props.setTiposInscripcion(tiposInscripcion);
      }

      this.setState({ visible: true, tiposAuto, tiposInscripcion });
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
      if (this.state.filtros && this.state.filtros.tipoAuto) {
        comando.tipoAuto = this.state.filtros.tipoAuto;
      }
      if (this.state.filtros && this.state.filtros.tipoInscripcion) {
        comando.tipoInscripcion = this.state.filtros.tipoInscripcion;
      }
      if (this.state.filtros && this.state.filtros.identificador) {
        comando.identificador = this.state.filtros.identificador;
      }
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
      let data = await Rules_Inscripcion.buscar(comando);
      let cantidadConError = await Rules_Inscripcion.getCantidadConError();
      this.setState({
        tablaData: data.data,
        tablaCount: data.count,
        tablaPaginaActual: data.paginaActual,
        cargando: false,
        cantidadConError
      });
    } catch (ex) {
      console.log(ex);
      let mensaje = typeof ex === "object" ? ex.message : ex;
      this.setState({ cargando: false, errorVisible: true, errorMensaje: mensaje });
    }
  };

  onTablaPaginaChange = (e, index) => {
    if (index == this.state.tablaPaginaActual) return;

    this.setState({ data: [], tablaPaginaActual: index }, () => {
      this.buscar(index);
    });
  };

  onTablaPaginaTamChange = (a, b) => {
    var tam = b.key;

    if (this.state.tablaTamañoPagina == tam) return;

    localStorage.setItem("tablaTamañoPagina", tam);
    this.setState({ tablaTamañoPagina: tam }, () => {
      this.buscar();
    });
  };

  onTablaColumnaFechaInicioRender = item => {
    if (item.fechaInicio == undefined) return "";
    return DateUtils.toDateString(DateUtils.toDate(item.fechaInicio));
  };

  onTablaColumnaFechaFinRender = item => {
    if (item.fechaFin == undefined) return "";
    return DateUtils.toDateString(DateUtils.toDate(item.fechaFin));
  };

  onTablaHeaderIdentificadorClick = () => {
    this.cambiarOrdenamientoTabla(TABLA_ORDER_BY_IDENTIFICADOR);
  };

  onTablaHeaderUsuarioClick = () => {
    this.cambiarOrdenamientoTabla(TABLA_ORDER_BY_USUARIO);
  };

  onTablaHeaderTipoInscripcionClick = () => {
    this.cambiarOrdenamientoTabla(TABLA_ORDER_BY_TIPO_INSCRIPCION);
  };

  onTablaHeaderTipoAutoClick = () => {
    this.cambiarOrdenamientoTabla(TABLA_ORDER_BY_TIPO_AUTO);
  };

  onTablaHeaderFechaInicioClick = () => {
    this.cambiarOrdenamientoTabla(TABLA_ORDER_BY_FECHA_INICIO);
  };

  onTablaHeaderFechaFinClick = () => {
    this.cambiarOrdenamientoTabla(TABLA_ORDER_BY_FECHA_FIN);
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

  onTablaBotonFavoritoClick = async e => {
    let id = e.currentTarget.attributes["data-id"].value;

    try {
      this.setState({ cargando: true });
      await Rules_Inscripcion.toggleFavorito(id);

      this.buscar(this.state.tablaPaginaActual);
    } catch (ex) {
      this.setState({ cargando: false });
      let mensaje = typeof ex === "object" ? ex.message : ex;
      this.props.mostrarAlertaRoja({ texto: mensaje });
    }
  };

  onTablaBotonBorrarClick = e => {
    let id = e.currentTarget.attributes["data-id"].value;
    this.mostrarDialogoConfirmarBorrar(id);
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
      let resultado = await Rules_Inscripcion.borrar(id);
      if (resultado != true) {
        this.props.mostrarAlertaRoja({ texto: "Error procesando la solicitud" });
        this.setState({ cargando: false });
        return;
      }
      this.buscar(this.state.paginaActual);
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
    7;
    if (exito == true) {
      this.buscar();
    }
  };

  //Dialogo editar
  mostrarDialogoEditar = (id, titular) => {
    this.setState({ dialogoEditarVisible: true, dialogoEditarId: id, dialogoEditarTitular: titular });
  };

  onDialogoEditarClose = exito => {
    this.setState({ dialogoEditarVisible: false });
    if (exito == true) {
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
    if (busqueda.tipoAuto) conFiltro = true;
    if (busqueda.tipoInscripcion) conFiltro = true;
    if (busqueda.identificador && busqueda.identificador != "") conFiltro = true;
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
          tipoAuto: busqueda.tipoAuto,
          tipoInscripcion: busqueda.tipoInscripcion,
          identificador: busqueda.identificador,
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

  onBotonLicenciasClick = () => {
    this.props.toggleDrawer();
    this.onBotonCancelarFiltrosClick();
  };

  onBotonPersonasClick = e => {
    this.props.toggleDrawer();

    setTimeout(() => {
      this.props.redireccionar("/Personas");
    }, 300);
  };

  onBotonInhabilitacionesClick = e => {
    this.props.toggleDrawer();

    setTimeout(() => {
      this.props.redireccionar("/Inhabilitaciones");
    }, 300);
  };

  onTablaColumnaErrorRender = entity => {
    if (entity.error) {
      return (
        <Tooltip title={entity.error}>
          <IconErrorOutlined style={{ color: red["700"] }} />
        </Tooltip>
      );
    } else {
      return <div />;
    }
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

    if (filtros.tipoAuto) {
      let tipoAuto = _.find(this.state.tiposAuto, tipoAuto => {
        return tipoAuto.keyValue == filtros.tipoAuto;
      });
      f.push({ key: "Tipo de auto", value: tipoAuto.nombre });
    }

    if (filtros.tipoInscripcion) {
      let tipoInscripcion = _.find(this.state.tiposInscripcion, tipoInscripcion => {
        return tipoInscripcion.keyValue == filtros.tipoInscripcion;
      });
      f.push({ key: "Tipo de licencia", value: tipoInscripcion.nombre });
    }

    if (filtros.identificador && filtros.identificador.trim() != "") {
      f.push({ key: "N° de Licencia", value: filtros.identificador.trim() });
    }

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

  //Reportes
  onBotonReportesClick = e => {
    this.setState({ menuReportesAnchor: e.currentTarget });
  };

  onMenuReportesClose = () => {
    this.setState({ menuReportesAnchor: undefined });
  };

  onDialogoPDFClose = () => {
    this.setState({ dialogoPDFVisible: false });
  };

  // Reporte DNI
  onBotonReporteDniClick = () => {
    this.setState({
      menuReportesAnchor: undefined,
      dialogoReporteDniVisible: true,
      dialogoReporteDniCargando: false
    });
  };

  onDialogoReporteDniBotonSiClick = async data => {
    let { dni } = data;
    if (dni == undefined || dni.trim() == "") {
      this.props.mostrarAlertaRoja({ texto: "Ingrese el N° de Documento" });
      return;
    }

    this.setState({ dialogoReporteDniCargando: true });

    try {
      let pdf = await Rules_Reporte.getInscripcionesPorDni(dni);
      this.setState({ dialogoReporteDniVisible: false, dialogoPDFVisible: true, dialogoPDFBase64: pdf });
    } catch (ex) {
      let mensaje = typeof ex === "object" ? ex.message : ex;
      this.props.mostrarAlertaRoja({ texto: mensaje });
      this.setState({ dialogoReporteDniCargando: false });
    }
  };

  onDialogoReporteDniClose = () => {
    this.setState({ dialogoReporteDniVisible: false });
  };

  // Reporte licencia
  onBotonReporteLicenciaClick = () => {
    this.setState({
      menuReportesAnchor: undefined,
      dialogoReporteLicenciaVisible: true,
      dialogoReporteLicenciaCargando: false
    });
  };

  onDialogoReporteLicenciaBotonSiClick = async data => {
    let { tipo, licencia } = data;

    if (tipo == undefined) {
      this.props.mostrarAlertaRoja({ texto: "Ingrese el tipo de licencia" });
      return;
    }

    if (licencia == undefined || licencia.trim() == "") {
      this.props.mostrarAlertaRoja({ texto: "Ingrese el N° de Licencia" });
      return;
    }

    this.setState({ dialogoReporteLicenciaCargando: true });

    try {
      let pdf = await Rules_Reporte.getInscripcionesPorChapa(tipo, licencia);
      this.setState({ dialogoReporteLicenciaVisible: false, dialogoPDFVisible: true, dialogoPDFBase64: pdf });
    } catch (ex) {
      let mensaje = typeof ex === "object" ? ex.message : ex;
      this.props.mostrarAlertaRoja({ texto: mensaje });
      this.setState({ dialogoReporteLicenciaCargando: false });
    }
  };

  onDialogoReporteLicenciaClose = () => {
    this.setState({ dialogoReporteLicenciaVisible: false });
  };

  render() {
    const { classes, usuario, width } = this.props;
    if (usuario == undefined) return null;
    const isMobile = !isWidthUp("md", width);

    return (
      <React.Fragment>
        <MiPagina
          full
          toolbarLeftIcon="menu"
          toolbarLeftIconClick={this.props.toggleDrawer}
          toolbarSubtitulo="Licencias"
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
                  {/* Nuevo  */}
                  <Fab variant="extended" style={{ backgroundColor: "white" }} onClick={this.onBotonNuevoClick}>
                    <IconAddOutlined style={{ marginRight: 8 }} />
                    Nuevo
                  </Fab>

                  <div style={{ flex: 1 }} />

                  {/* Reporte  */}
                  {isMobile == true && (
                    <Tooltip title="Reportes" disableFocusListener={true}>
                      <IconButton onClick={this.onBotonReportesClick}>
                        <IconAssignmentOutlined />
                      </IconButton>
                    </Tooltip>
                  )}

                  {isMobile == false && (
                    <Button style={{ marginRight: 16 }} onClick={this.onBotonReportesClick}>
                      <IconAssignmentOutlined style={{ marginRight: 8 }} />
                      Reportes
                    </Button>
                  )}

                  {/* Menu reportes */}
                  <Menu
                    anchorEl={this.state.menuReportesAnchor}
                    open={Boolean(this.state.menuReportesAnchor)}
                    onClose={this.onMenuReportesClose}
                  >
                    <MenuItem onClick={this.onBotonReporteDniClick}>Por N° de Documento</MenuItem>
                    <MenuItem onClick={this.onBotonReporteLicenciaClick}>Por N° de Licencia</MenuItem>
                  </Menu>

                  {/* Boton registros con error  */}
                  {this.state.cantidadConError && this.state.cantidadConError > 0 && isMobile == false && (
                    <Tooltip title={`Ver ${this.state.cantidadConError} registros con errror`} disableFocusListener={true}>
                      <Button variant="outlined" style={{ marginRight: 16 }} onClick={this.onBotonRegistrosConErrorClick}>
                        <IconErrorOutlined style={{ marginRight: 8, color: red["600"] }} />
                        {this.state.cantidadConError} errores
                      </Button>
                    </Tooltip>
                  )}
                  {this.state.cantidadConError && this.state.cantidadConError > 0 && isMobile == true && (
                    <Tooltip title={`Ver ${this.state.cantidadConError} registros con errror`} disableFocusListener={true}>
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
                    <div>{this.getTextoFiltros(this.state.filtros)}</div>

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
                        id: "identificador",
                        label: "N° de Licencia",
                        onHeaderClick: this.onTablaHeaderIdentificadorClick,
                        orderBy: this.state.tablaOrderBy == TABLA_ORDER_BY_IDENTIFICADOR ? this.state.tablaOrderByAsc : undefined
                      },
                      {
                        id: "usuarioApellidoNombre",
                        label: "Apellido y Nombre",
                        onHeaderClick: this.onTablaHeaderUsuarioClick,
                        orderBy: this.state.tablaOrderBy == TABLA_ORDER_BY_USUARIO ? this.state.tablaOrderByAsc : undefined
                      },
                      {
                        id: "tipoInscripcionNombre",
                        label: "Tipo",
                        onHeaderClick: this.onTablaHeaderTipoInscripcionClick,
                        orderBy: this.state.tablaOrderBy == TABLA_ORDER_BY_TIPO_INSCRIPCION ? this.state.tablaOrderByAsc : undefined
                      },
                      {
                        id: "tipoAutoNombre",
                        label: "Auto",
                        onHeaderClick: this.onTablaHeaderTipoAutoClick,
                        orderBy: this.state.tablaOrderBy == TABLA_ORDER_BY_TIPO_AUTO ? this.state.tablaOrderByAsc : undefined
                      },
                      {
                        id: "fechaInicio",
                        label: "Fecha de Inicio",
                        render: this.onTablaColumnaFechaInicioRender,
                        onHeaderClick: this.onTablaHeaderFechaInicioClick,
                        orderBy: this.state.tablaOrderBy == TABLA_ORDER_BY_FECHA_INICIO ? this.state.tablaOrderByAsc : undefined
                      },
                      {
                        id: "fechaFin",
                        label: "Fecha de Fin",
                        render: this.onTablaColumnaFechaFinRender,
                        onHeaderClick: this.onTablaHeaderFechaFinClick,
                        orderBy: this.state.tablaOrderBy == TABLA_ORDER_BY_FECHA_FIN ? this.state.tablaOrderByAsc : undefined
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

  getSelectOptionsTipoAuto = memoize(data => {
    return (data || []).map(item => {
      return {
        value: item.keyValue + "",
        label: item.nombre
      };
    });
  });

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

        {/* Inscripcion Nuevo  */}
        <MiDialogoInscripcionNuevo visible={this.state.dialogoNuevoVisible || false} onClose={this.onDialogoNuevoClose} />

        {/* Inscripcion Editar  */}
        <MiDialogoInscripcionNuevo
          visible={this.state.dialogoEditarVisible || false}
          onClose={this.onDialogoEditarClose}
          editar={true}
          id={this.state.dialogoEditarId || 0}
        />

        {/* Buscar */}
        <MiDialogoInscripcionConsulta visible={this.state.dialogoBuscarVisible || false} onClose={this.onDialogoBuscarClose} />

        {/* PDF */}
        <MiDialogoPDF
          visible={this.state.dialogoPDFVisible || false}
          base64={this.state.dialogoPDFBase64}
          onClose={this.onDialogoPDFClose}
        />

        {/* Reporte por N° DNI */}
        <MiDialogoForm
          visible={this.state.dialogoReporteDniVisible || false}
          onClose={this.onDialogoReporteDniClose}
          inputs={[
            {
              key: "dni",
              label: "N° de Documento"
            }
          ]}
          textoSi="Generar reporte"
          botonNoVisible={false}
          autoCerrarBotonSi={false}
          cargando={this.state.dialogoReporteDniCargando || false}
          onBotonSiClick={this.onDialogoReporteDniBotonSiClick}
        />

        {/* Reporte por N° de Licencia */}
        <MiDialogoForm
          visible={this.state.dialogoReporteLicenciaVisible || false}
          onClose={this.onDialogoReporteLicenciaClose}
          inputs={[
            {
              key: "tipo",
              inputType: "select",
              label: "Tipo",
              options: this.getSelectOptionsTipoAuto(this.props.tiposAuto)
            },
            {
              key: "licencia",
              label: "N° de Licencia"
            }
          ]}
          textoSi="Generar reporte"
          botonNoVisible={false}
          autoCerrarBotonSi={false}
          cargando={this.state.dialogoReporteLicenciaCargando || false}
          onBotonSiClick={this.onDialogoReporteLicenciaBotonSiClick}
        />
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
          <ListItem button className="item" style={{ backgroundColor: "rgba(0,0,0,0.1)" }} onClick={this.onBotonLicenciasClick}>
            <ListItemText primary="Licencias" />
          </ListItem>
          {/* <ListItem button className="item" onClick={this.onBotonInhabilitacionesClick} style={{ marginTop: 8 }}>
            <ListItemText primary="Inhabilitaciones" />
          </ListItem> */}
          <ListItem button className="item" onClick={this.onBotonPersonasClick} style={{ marginTop: 8 }}>
            <ListItemText primary="Personas" />
          </ListItem>
        </List>
      </SwipeableDrawer>
    );
  }
}

let componente = Inscripciones;
componente = withStyles(styles)(componente);
componente = withWidth()(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
componente = withRouter(componente);
export default componente;
