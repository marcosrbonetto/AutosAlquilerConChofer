import React from "react";

//Styles
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import styles from "./styles";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";

import red from "@material-ui/core/colors/red";
import orange from "@material-ui/core/colors/orange";
import green from "@material-ui/core/colors/green";
import yellow from "@material-ui/core/colors/yellow";

import Icon from "@material-ui/core/Icon";
import IconWarningOutlined from "@material-ui/icons/WarningOutlined";
// import IconAccountBoxOutlined from "@material-ui/icons/AccountBoxOutlined";
// import IconAccountBoxOutlined from "@material-ui/icons/AccountBoxOutlined";
// import IconAccountBoxOutlined from "@material-ui/icons/AccountBoxOutlined";

const MODO_INFO = "info";
const MODO_ERROR = "error";
const MODO_ALERTA = "alerta";
const MODO_EXITO = "exito";

class MiBaner extends React.PureComponent {
  render() {
    let { classes, modo, mensaje, botonVisible, botonIcono } = this.props;

    if (modo == undefined) {
      modo = MODO_INFO;
    }

    let icono, color, colorTexto, colorIcono;

    switch (modo) {
      case MODO_ALERTA:
        {
          color = orange["500"];
          colorTexto = "white";
          colorIcono = "white";
          icono = (
            <IconWarningOutlined
              className={classes.icono}
              style={{
                color: colorIcono,
                // marginTop: 12, marginBottom: 12,
                marginRight: 16
              }}
            />
          );
        }
        break;
      case MODO_EXITO:
        {
          color = green["500"];
          colorTexto = "white";
          colorIcono = "white";
          icono = (
            <IconWarningOutlined
              className={classes.icono}
              style={{
                color: colorIcono,
                // marginTop: 12, marginBottom: 12,
                marginRight: 16
              }}
            />
          );
        }
        break;
      case MODO_ERROR:
        {
          color = red["500"];
          colorTexto = "white";
          colorIcono = "white";
          icono = (
            <IconWarningOutlined
              className={classes.icono}
              style={{
                color: colorIcono,
                // marginTop: 12, marginBottom: 12,
                marginRight: 16
              }}
            />
          );
        }
        break;
      case MODO_INFO:
        {
          color = yellow["100"];
          colorTexto = "black";
          colorIcono = "black";
          icono = (
            <IconWarningOutlined
              className={classes.icono}
              style={{
                color: colorIcono,
                // marginTop: 12, marginBottom: 12,
                marginRight: 16
              }}
            />
          );
        }
        break;
    }

    botonIcono = botonIcono || <Icon style={{ color: colorIcono }}>clear</Icon>;

    return (
      <div className={classNames(classes.root, this.props.visible && "visible", this.props.className)} style={{ backgroundColor: color }}>
        <div>
          {icono}

          <Typography
            variant="body2"
            className="texto"
            style={{
              color: colorTexto
              // marginTop: 12, marginBottom: 12
            }}
          >
            {mensaje}
          </Typography>
          {botonVisible === true && <div style={{ marginLeft: 16 }} />}
          {botonVisible === true && this.props.botonTexto == undefined && (
            <IconButton onClick={this.props.onBotonClick}>{botonIcono}</IconButton>
          )}
          {botonVisible === true && this.props.botonTexto != undefined && (
            <Button onClick={this.props.onBotonClick} style={{ color: colorIcono }}>
              {this.props.botonTexto}
            </Button>
          )}
        </div>
      </div>
    );
  }
}

let componente = MiBaner;
componente = withStyles(styles)(componente);
export default componente;
