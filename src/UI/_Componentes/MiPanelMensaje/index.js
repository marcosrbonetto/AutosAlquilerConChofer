import React from "react";

//Componentes
import { Icon, Typography, Button } from "@material-ui/core";
import Lottie from "react-lottie";
import * as animExito from '../_Resources/animaciones/anim_success.json';

//Colores
import red from "@material-ui/core/colors/red";
import orange from "@material-ui/core/colors/orange";
import green from "@material-ui/core/colors/green";
import grey from "@material-ui/core/colors/grey";

const lottieExito = {
  loop: false,
  autoplay: true,
  animationData: animExito,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice"
  }
};

class MiPanelMensaje extends React.PureComponent {
  render() {
    let conLottieExito = "lottieExito" in this.props;
    let esError = "error" in this.props;
    let esAlerta = "alerta" in this.props;
    let esExito = "exito" in this.props;

    let tieneIcono =
      esError || esAlerta || esExito || this.props.icono !== undefined;

    let icono = undefined;
    let iconoColor = undefined;

    if (tieneIcono) {
      if (esError) {
        icono = "error";
        iconoColor = red["500"];
      }
      if (esAlerta) {
        icono = "warning";
        iconoColor = orange["500"];
      }

      if (esExito) {
        icono = "check_circle";
        iconoColor = green["500"];
      }

      if (icono === undefined) {
        icono = this.props.icono;
        iconoColor = this.props.iconoColor || grey["500"];
      }
    }

    let tieneBoton = this.props.boton !== undefined;

    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        {/* Icono */}
        {conLottieExito === true
          ? this.renderLottie(lottieExito)
          : this.renderIcono(icono, iconoColor)}

        {/* Texto */}
        <Typography
          variant="headline"
          style={{ marginTop: "16px", maxWidth: "30rem", textAlign: "center" }}
        >
          {this.props.mensaje}
        </Typography>

        {this.props.detalle != undefined && (
          <Typography
            variant="body2"
            style={{
              marginTop: "0px",
              maxWidth: "30rem",
              textAlign: "center"
            }}
          >
            {this.props.detalle}
          </Typography>
        )}

        {tieneBoton && (
          <Button
            color={this.props.botonColor || "default"}
            variant={this.props.botonVariant || "outlined"}
            onClick={this.props.onBotonClick}
            style={{ marginTop: "16px" }}
          >
            {this.props.boton}
          </Button>
        )}
      </div>
    );
  }

  renderLottie(lottie) {
    return (
      <Lottie
        options={lottie}
        height={150}
        width={150}
        style={{ minHeight: "150px" }}
      />
    );
  }
  renderIcono(icono, iconoColor) {
    if (icono == undefined) return null;

    return (
      <Icon
        style={{
          fontSize: 104,
          color: iconoColor
        }}
      >
        {icono}
      </Icon>
    );
  }
}

export default MiPanelMensaje;
