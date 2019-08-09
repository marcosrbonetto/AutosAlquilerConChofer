import React from "react";

//Styles
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles";

//Compontes
import _ from "lodash";
import { Typography, Grid, Button, Icon } from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

//Mis componentes
import MiBaner from "../MiBaner";

class DialogoMensaje extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  onClose = () => {
    this.props.onClose && this.props.onClose();
  };

  onBotonNoClick = () => {
    this.props.onBotonNoClick && this.props.onBotonNoClick();
    let cerrar = !("autoCerrarBotonNo" in this.props) || this.props.autoCerrarBotonNo != false;
    cerrar && this.onClose();
  };

  onBotonSiClick = () => {
    this.props.onBotonSiClick && this.props.onBotonSiClick();
    let cerrar = !("autoCerrarBotonSi" in this.props) || this.props.autoCerrarBotonSi != false;
    cerrar && this.onClose();
  };

  render() {
    const { classes } = this.props;

    let botonNoVisible = !("botonNoVisible" in this.props) || this.props.botonNoVisible != false;
    let botonSiVisible = !("botonSiVisible" in this.props) || this.props.botonSiVisible != false;

    return (
      <React.Fragment>
        <Dialog open={this.props.visible || false} onClose={this.onClose}>
          <MiBaner
            visible={this.props.banerVisible || false}
            mensaje={this.props.banerMensaje || ""}
            botonVisible={this.props.banerBotonVisible || false}
            modo="error"
            onBotonClick={this.props.onBanerBotonClick}
          />

          <DialogTitle>{this.props.titulo || ""}</DialogTitle>
          <DialogContent>
            <Grid container spacing={16}>
              <Grid item xs={12}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {this.props.icon && (
                    <Icon style={{ color: this.props.iconColor || "black", fontSize: 40, marginBottom: 16 }}>{this.props.icon}</Icon>
                  )}
                  {this.props.mensaje && <Typography variant="body1">{this.props.mensaje}</Typography>}
                  {this.props.mensaje2 && <Typography variant="body1">{this.props.mensaje2}</Typography>}
                </div>
              </Grid>
              {this.props.children && (
                <Grid item xs={12}>
                  {this.props.children}
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            {botonNoVisible && <Button onClick={this.onBotonNoClick}>{this.props.textoNo || "No"}</Button>}
            {botonSiVisible && (
              <Button color="primary" onClick={this.onBotonSiClick}>
                {this.props.textoSi || "Si"}
              </Button>
            )}
          </DialogActions>

          <div className={classNames(classes.contentOverlayCargando, this.props.cargando && classes.contentOverlayCargandoVisible)} />

          <div className={classNames(classes.contenedorCargando, this.props.cargando === true && classes.contenedorCargandoVisible)}>
            <LinearProgress color="secondary" />
          </div>
        </Dialog>
      </React.Fragment>
    );
  }
}

let componente = DialogoMensaje;
componente = withStyles(styles)(componente);
export default componente;
