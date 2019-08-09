import React from "react";

//Styles
import CssBaseline from "@material-ui/core/CssBaseline";
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles.js";

import ImagenDeFondo from "../../_Resources/imagenes/404.png";

class Pagina404 extends React.PureComponent {
  render() {
    const { classes } = this.props;
    return (
      <div
        className={classes.imagen}
        style={{ backgroundImage: "url(" + ImagenDeFondo + ")" }}
      />
    );
  }
}

let componente = Pagina404;
componente = withStyles(styles)(Pagina404);
export default componente;
