import React from "react";

//Styles
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import styles from "./styles";

//Componentes
import { Typography, ButtonBase } from "@material-ui/core";

//Mis compontentes
import CordobaFileUtils from "../Utils/CordobaFiles";

import MiDialogoDetalle from "../../_Dialogos/UsuarioDetalle";

class MiDetalleUsuario extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dialogoDetalleVisible: false
    };
  }
  onDetalleClick = e => {
    e.stopPropagation();
    this.mostrarDialogoDetalle();
  };

  mostrarDialogoDetalle = () => {
    this.setState({ dialogoDetalleVisible: true });
  };

  onDialogoDetalleClose = () => {
    this.setState({ dialogoDetalleVisible: false });
  };

  render() {
    let { classes, data } = this.props;
    if (data == undefined) return null;
    let { identificadorFotoPersonal, sexoMasculino, nombre, apellido } = data;

    let foto = CordobaFileUtils.getUrlFotoMiniatura(identificadorFotoPersonal, sexoMasculino);

    return (
      <div className={classes.contenedor} onClick={this.props.onClick}>
        <div className={classes.foto} style={{ backgroundImage: `url(${foto})` }} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "start" }}>
          <Typography variant="body1">
            {nombre} {apellido}
          </Typography>
          <Typography variant="body1" className={classes.link} onClick={this.onDetalleClick}>
            Ver detalle
          </Typography>
        </div>
        <MiDialogoDetalle visible={this.state.dialogoDetalleVisible} id={data.id} onClose={this.onDialogoDetalleClose} />
      </div>
    );
  }
}

let componente = MiDetalleUsuario;
componente = withStyles(styles)(componente);
export default componente;
