import React from "react";

import classNames from "classnames";
import styles from "./styles";
import { withStyles } from "@material-ui/core/styles";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import withMobileDialog from "@material-ui/core/withMobileDialog";
// import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import InputAdornment from "@material-ui/core/InputAdornment";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import List from "react-virtualized/dist/commonjs/List";

import _ from "lodash";
import { Icon, Typography } from "@material-ui/core";

import memoize from "memoize-one";

class MiSelect extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      busqueda: "",
      listHeight: 300,
      listRowHeight: 50,
      overscanRowCount: 10,
      rowCount: 0
    };
  }

  onBotonClick = () => {
    if (this.props.disabled === true) return;
    this.setState({ open: true, busqueda: "" });
  };

  onClose = () => {
    this.setState({ open: false });
  };

  onClick = value => {
    if (value == -1) {
      this.props.onChange && this.props.onChange(undefined);
      this.onClose();
      return;
    }

    let item = _.find(this.props.options, opcion => {
      return opcion.value === value;
    });
    if (item === undefined) return;

    this.props.onChange && this.props.onChange(item);
    this.onClose();
  };

  onBusquedaChange = e => {
    this.setState({ busqueda: e.currentTarget.value });
  };

  onInputRef = ref => {
    ref && ref.focus();
  };

  onInputKeyPress = e => {
    if (e.key === "Enter") {
      let opcionesFiltradas = _.filter(this.props.options, opcion => {
        let busqueda = this.transformarTexto(this.state.busqueda);
        let label = this.transformarTexto(opcion.label);
        return label.indexOf(busqueda) !== -1;
      });

      if (opcionesFiltradas.length === 1) {
        this.onClick(opcionesFiltradas[0].value);
      }
    }
  };

  generarOpciones = memoize((opciones, placeholder) => {
    if (placeholder) {
      opciones = [
        {
          label: placeholder,
          value: -1
        },
        ...opciones
      ];
    }

    return [...opciones];
  });

  findOpcionSeleccionada = memoize((data, id) => {
    if (id == undefined || id == -1) return undefined;

    return _.find(data, item => {
      return item.value == id;
    });
  });

  filtrarOpciones = memoize((opciones, filtro) => {
    return _.filter(opciones, opcion => {
      let busqueda = this.transformarTexto(filtro);
      let label = this.transformarTexto(opcion.label);
      return label.indexOf(busqueda) !== -1;
    });
  });

  onTextFieldRef = ref => {
    this.ref = ref;
  };

  transformarTexto = txt => {
    if (txt === undefined) return "";
    txt = txt.toLowerCase();
    txt = txt.replace(/á/g, "a");
    txt = txt.replace(/é/g, "e");
    txt = txt.replace(/í/g, "i");
    txt = txt.replace(/ó/g, "o");
    txt = txt.replace(/ú/g, "u");
    return txt;
  };

  render() {
    const { options, fullScreen, value, placeholder } = this.props;
    const { busqueda } = this.state;

    const opciones = this.generarOpciones(options || [], placeholder);
    const opcionSeleccionada = this.findOpcionSeleccionada(opciones, value);
    const opcionesFiltradas = this.filtrarOpciones(opciones, busqueda);

    return (
      <React.Fragment>
        <TextField
          value={opcionSeleccionada ? opcionSeleccionada.label : "Seleccione..."}
          ref={this.onTextFieldRef}
          variant={this.props.variant}
          label={this.props.label}
          margin={this.props.margin || "dense"}
          fullWidth={this.props.fullWidth}
          error={this.props.error}
          helperText={this.props.helperText}
          onClick={this.onBotonClick}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Icon>keyboard_arrow_down</Icon>
              </InputAdornment>
            )
          }}
        />

        <Dialog fullScreen={fullScreen} open={this.state.open} onClose={this.onClose}>
          <DialogContent style={{ padding: 0, display: "flex", flexDirection: "column" }}>
            <div style={{ minHeight: "fit-content", padding: "16px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <TextField
                  variant="outlined"
                  inputRef={this.onInputRef}
                  name="busqueda"
                  autoComplete="off"
                  margin={this.props.margin || "dense"}
                  onKeyPress={this.onInputKeyPress}
                  style={{ flex: 1 }}
                  placeholder={this.props.placeholderBusqueda || "Buscar..."}
                  value={this.state.busqueda}
                  onChange={this.onBusquedaChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Icon style={{ marginLeft: "16px" }}>search</Icon>
                      </InputAdornment>
                    )
                  }}
                />
              </div>
            </div>

            {/* <List> */}
            <div style={{ width: "100%", flex: 1, minHeight: 300 }}>
              <AutoSizer>
                {({ width, height }) => (
                  <List
                    height={height}
                    overscanRowCount={this.state.overscanRowCount}
                    noRowsRenderer={this._noRowsRenderer}
                    rowCount={opcionesFiltradas.length}
                    rowHeight={this.state.listRowHeight}
                    rowRenderer={this._rowRenderer}
                    width={width}
                  />
                )}
              </AutoSizer>
            </div>
          </DialogContent>

          <DialogActions>
            <Button color="primary" onClick={this.onClose}>
              Volver
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }

  _rowRenderer = ({ index, isScrolling, key, style }) => {
    const { options, value, placeholder, listRowHeight } = this.props;
    const { busqueda } = this.state;

    const opciones = this.generarOpciones(options || [], placeholder);
    const opcionSeleccionada = this.findOpcionSeleccionada(opciones, value);
    const opcionesFiltradas = this.filtrarOpciones(opciones, busqueda);

    const data = opcionesFiltradas[index];

    return <Item style={style} label={data.label} value={data.value} onClick={this.onClick} key={key} height={listRowHeight} />;
  };
}

class Item extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  onClick = () => {
    this.props.onClick && this.props.onClick(this.props.value);
  };

  render() {
    return (
      <ListItem button onClick={this.onClick} selected={this.props.selected} style={{ height: this.props.height }} style={this.props.style}>
        <ListItemText primary={this.props.label} />
      </ListItem>
    );
  }
}

let componente = MiSelect;
componente = withStyles(styles)(componente);
componente = withMobileDialog()(componente);
export default componente;
