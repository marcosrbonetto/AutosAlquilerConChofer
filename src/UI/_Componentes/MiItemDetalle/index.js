import React from "react";

//Styles
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import styles from "./styles";

import Typography from "@material-ui/core/Typography";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";

class MiItemDetalle extends React.PureComponent {
  render() {
    let { classes, icono, titulo, contenido, botonVisible, botonIcono } = this.props;

    return (
      <React.Fragment>
        <div className={classes.root}>
          {icono != undefined && icono}
          {icono && <div className={classes.separadorIcono} />}
          <div className={classes.contenedorTextos}>
            {titulo && <Typography variant="body2">{titulo}</Typography>}
            {contenido && <Typography variant="body1">{contenido}</Typography>}
          </div>
          {botonVisible && <div className={classes.separadorIcono} />}
          {botonVisible === true && <IconButton onClick={this.props.onBotonClick}>{botonIcono}</IconButton>}
        </div>
      </React.Fragment>
    );
  }
}

let componente = MiItemDetalle;
componente = withStyles(styles)(componente);
export default componente;
