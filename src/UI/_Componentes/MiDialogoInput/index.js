import React from "react";

//Styles
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles";

//Compontes
import _ from "lodash";
import { Typography, Grid, Button, TextField } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import LinearProgress from "@material-ui/core/LinearProgress";

//Mis componentes
import MiBaner from "../MiBaner";

class DialogoInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      input: "",
      banerVisible: false,
      banerMensaje: ""
    };
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible != this.props.visible && nextProps.visible) {
      this.setState({ input: nextProps.value || "" });
    }
  }

  onClose = () => {
    this.props.onClose && this.props.onClose();
  };

  onChange = e => {
    this.setState({ [e.currentTarget.name]: e.currentTarget.value });
  };

  onKeyPress = ev => {
    if (this.props.multiline == true) return;
    if (ev.key === "Enter") {
      ev.preventDefault();
      this.onBotonSiClick();
    }
  };

  onBotonNoClick = () => {
    this.props.onBotonNoClick && this.props.onBotonNoClick();
    let cerrar = !("autoCerrarBotonNo" in this.props) || this.props.autoCerrarBotonNo != false;
    cerrar && this.onClose();
  };

  onBotonSiClick = () => {
    this.props.onBotonSiClick && this.props.onBotonSiClick(this.state.input);
    let cerrar = !("autoCerrarBotonSi" in this.props) || this.props.autoCerrarBotonSi != false;
    cerrar && this.onClose();
  };

  render() {
    const { classes } = this.props;

    let botonNoVisible = !("botonNoVisible" in this.props) || this.props.botonNoVisible != false;
    let botonSiVisible = !("botonSiVisible" in this.props) || this.props.botonSiVisible != false;

    return (
      <React.Fragment>
        <Dialog open={this.props.visible} onClose={this.onClose} aria-labelledby="responsive-dialog-title">
          <MiBaner
            visible={this.props.banerVisible || false}
            mensaje={this.props.banerMensaje || ""}
            botonVisible={this.props.banerBotonVisible||false}
            modo="error"
            onBotonClick={this.props.onBotonBanerClick}
          />

          {this.props.titulo && <DialogTitle id="responsive-dialog-title">{this.props.titulo}</DialogTitle>}
          <DialogContent>
            <Grid container>
              <Grid item xs={12}>
                {this.props.mensaje && <Typography variant="body1">{this.props.mensaje}</Typography>}
                <div style={{ height: 16 }} />
                <TextField
                  fullWidth
                  label={this.props.label}
                  placeholder={this.props.placeholder}
                  autoFocus
                  variant="outlined"
                  id="input"
                  value={this.state.input}
                  name="input"
                  type={this.props.inputType || "text"}
                  autoComplete={this.props.inputAutoComplete}
                  multiline={this.props.multiline}
                  onChange={this.onChange}
                  placeholder={this.props.placeholder}
                  onKeyPress={this.onKeyPress}
                />
              </Grid>
            </Grid>
            {this.props.children}
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

let componente = DialogoInput;
componente = withStyles(styles)(componente);
export default componente;
