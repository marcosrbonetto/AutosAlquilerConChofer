import React from "react";

//Styles
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles";

//Compontes
import _ from "lodash";
import { Typography, Grid, Button, TextField } from "@material-ui/core";
import Radio from "@material-ui/core/Radio";
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import LinearProgress from "@material-ui/core/LinearProgress";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import { InlineTimePicker, InlineDatePicker, InlineDateTimePicker } from "material-ui-pickers";

//Mis componentes
import MiBaner from "../MiBaner";
import MiSelect from "../MiSelect";

class DialogoForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputs: this.generarInputs(props.inputs),
      banerVisible: false,
      banerMensaje: ""
    };
  }

  componentDidMount() {
    this.props.callback && this.props.callback(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible != this.props.visible && nextProps.visible) {
      this.setState({ inputs: this.generarInputs(nextProps.inputs) });
    }
  }

  setValores = data => {
    let inputs = this.state.inputs;
    if (!inputs) return;

    Object.keys(inputs || {}).forEach((key, index) => {
      var item = _.find(data, a => a.key == key);
      if (item) {
        inputs[key] = item.value || "";
      }
    });

    this.setState({
      inputs: inputs
    });
  };

  generarInputs = data => {
    let inputs = {};

    Object.keys(data || {}).forEach((e, key) => {
      inputs[data[key].key] = data[key].value || "";
    });

    return inputs;
  };

  onClose = e => {
    let cargando = this.props.cargando == true;
    if (cargando == true) return;
    this.props.onClose && this.props.onClose(e);
  };

  onCustomChange = (name, e) => {
    const inputs = this.props.inputs;
    const input = _.find(inputs, item => {
      return item.key == name;
    });

    const informar = input != undefined && input.onChange != undefined;

    if (informar) {
      input.onChange(e);
    }

    this.setState({
      inputs: {
        ...this.state.inputs,
        [name]: e
      }
    });
  };

  onChange = e => {
    const inputs = this.props.inputs;
    const input = _.find(inputs, item => {
      return item.key == e.currentTarget.name;
    });

    const informar = input != undefined && input.onChange != undefined;

    if (informar) {
      input.onChange(e);
    }

    this.setState({
      inputs: {
        ...this.state.inputs,
        [e.currentTarget.name]: e.currentTarget.value
      }
    });
  };

  onSelectChange = (e, key) => {
    const inputs = this.props.inputs;
    const input = _.find(inputs, item => {
      return item.key == key;
    });

    const informar = input != undefined && input.onChange != undefined;

    if (informar) {
      input.onChange(e);
    }

    this.setState({
      inputs: {
        ...this.state.inputs,
        [key]: e.value
      }
    });
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
    this.props.onBotonSiClick && this.props.onBotonSiClick(this.state.inputs);
    let cerrar = !("autoCerrarBotonSi" in this.props) || this.props.autoCerrarBotonSi != false;
    cerrar && this.onClose();
  };

  render() {
    const { classes, inputs, fullScreen } = this.props;

    let botonNoVisible = !("botonNoVisible" in this.props) || this.props.botonNoVisible != false;
    let botonSiVisible = !("botonSiVisible" in this.props) || this.props.botonSiVisible != false;

    return (
      <React.Fragment>
        <Dialog fullScreen={fullScreen} open={this.props.visible} onClose={this.onClose} aria-labelledby="responsive-dialog-title">
          <MiBaner
            visible={this.props.banerVisible}
            mensaje={this.props.banerMensaje}
            botonVisible={this.props.banerBotonVisible}
            modo={this.props.banerModo || "error"}
            onBotonClick={this.props.onBanerBotonClick}
          />

          {this.props.childrenBaner}
          {this.props.titulo && <DialogTitle id="responsive-dialog-title">{this.props.titulo}</DialogTitle>}
          <DialogContent>
            {this.props.childrenContentTop}
            <Grid container spacing={16}>
              <Grid item xs={12}>
                {this.props.mensaje && <Typography variant="body1">{this.props.mensaje}</Typography>}
              </Grid>
              {inputs &&
                inputs.map((input, index) => {
                  const inputType = input.inputType || "text";
                  const label = input.label || "";
                  const key = input.key;
                  const variant = input.variant || "outlined";
                  const disabled = input.disabled || false;
                  const rows = input.rows;
                  const options = input.options || [];

                  const value = this.state.inputs[key] || "";

                  switch (inputType) {
                    case "text": {
                      const type = input.type || "text";
                      const autoComplete = input.autoComplete || "off";
                      const multiline = input.multiline || false;
                      const placeholder = input.placeholder;
                      const inputProps = input.inputProps || {};

                      console.log(multiline);
                      if (type == "time") {
                        return (
                          <Grid item xs={12} key={index}>
                            <InlineTimePicker
                              keyboard
                              format="HH:mm"
                              disabled={disabled}
                              mask={value => (value ? [/\d/, /\d/, ":", /\d/, /\d/] : [])}
                              fullWidth
                              variant={variant}
                              id={key}
                              name={key}
                              label={label}
                              value={value == "" ? null : value}
                              autoComplete={autoComplete}
                              onChange={e => {
                                this.onCustomChange(key, e);
                              }}
                              onInputChange={e => {
                                let input = e.currentTarget.value;
                                if (input == "" || input.indexOf("_") != -1) {
                                  this.onCustomChange(key, null);
                                }
                              }}
                              placeholder={placeholder}
                            />
                          </Grid>
                        );
                      }

                      if (type == "date") {
                        return (
                          <Grid item xs={12} key={index}>
                            <InlineDatePicker
                              fullWidth
                              variant={variant}
                              id={key}
                              name={key}
                              keyboard
                              disabled={disabled}
                              format="dd/MM/yyyy"
                              mask={value => (value ? [/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/] : [])}
                              label={label}
                              value={value == "" ? null : value}
                              autoComplete={autoComplete}
                              onInputChange={e => {
                                let input = e.currentTarget.value;
                                if (input == "" || input.indexOf("_") != -1) {
                                  this.onCustomChange(key, null);
                                }
                              }}
                              onChange={e => {
                                this.onCustomChange(key, e);
                              }}
                              placeholder={placeholder}
                            />
                          </Grid>
                        );
                      }

                      if (type == "datetime") {
                        return (
                          <Grid item xs={12} key={index}>
                            <InlineDateTimePicker
                              fullWidth
                              disabled={disabled}
                              keyboard
                              format="dd/MM/yyyy HH:mm"
                              variant={variant}
                              id={key}
                              name={key}
                              label={label}
                              value={value == "" ? null : value}
                              autoComplete={autoComplete}
                              onChange={e => {
                                this.onCustomChange(key, e);
                              }}
                              onInputChange={e => {
                                let input = e.currentTarget.value;
                                if (input == "" || input.indexOf("_") != -1) {
                                  this.onCustomChange(key, null);
                                }
                              }}
                              placeholder={placeholder}
                            />
                          </Grid>
                        );
                      }

                      return (
                        <Grid item xs={12} key={index}>
                          <TextField
                            fullWidth
                            variant={variant}
                            disabled={disabled}
                            id={key}
                            label={label}
                            value={value}
                            name={key}
                            type={type}
                            autoComplete={autoComplete}
                            multiline={multiline}
                            rows={rows}
                            onChange={this.onChange}
                            placeholder={placeholder}
                            onKeyPress={this.onKeyPress}
                            InputProps={inputProps}
                          />
                        </Grid>
                      );
                    }

                    case "radio": {
                      const items = input.items || [];

                      const style = {};
                      if (input.horizontal == true) {
                        style.display = "flex";
                        style.flexDirection = "row";
                        style.flexWrap = "wrap";
                      }
                      return (
                        <Grid item xs={12} key={index}>
                          <React.Fragment>
                            {input.label && <FormLabel component="legend">{label}</FormLabel>}
                            <RadioGroup
                              disabled={disabled}
                              name={key}
                              value={this.state.inputs[key] || ""}
                              onChange={this.onChange}
                              style={style}
                            >
                              {items.map((item, index) => {
                                const value = item.value;
                                const label = item.label || "";

                                return (
                                  <FormControlLabel
                                    disabled={disabled}
                                    key={index}
                                    value={value}
                                    control={<Radio disabled={disabled} />}
                                    label={label}
                                  />
                                );
                              })}
                            </RadioGroup>
                          </React.Fragment>
                        </Grid>
                      );
                    }

                    case "check":
                      {
                      }
                      break;

                    case "select": {
                      return (
                        <Grid item xs={12} key={index}>
                          <MiSelect
                            onChange={e => {
                              this.onSelectChange(e, key);
                            }}
                            value={value}
                            options={options}
                            variant="outlined"
                            fullWidth
                            label={label}
                          />
                        </Grid>
                      );
                    }
                  }
                })}
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

let componente = DialogoForm;
componente = withStyles(styles)(componente);
componente = withMobileDialog()(componente);
export default componente;
