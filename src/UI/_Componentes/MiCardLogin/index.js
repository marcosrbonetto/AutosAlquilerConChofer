import React from "react";

//Styles
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import styles from "./styles";

//Compontentes
import LinearProgress from "@material-ui/core/LinearProgress";
import { Typography } from "@material-ui/core";

//Mis componentes
import MiCard from "../MiCard";

const PADDING = "32px";

class MiCardLogin extends React.PureComponent {
  render() {
    const { classes } = this.props;

    return (
      <MiCard
        padding={false}
        rootClassName={classNames(
          classes.cardRoot,
          this.props.rootClassName,
          this.props.visible && "visible"
        )}
        className={classNames(classes.cardContent)}
      >
        <LinearProgress
          className={classNames(
            classes.progress,
            this.props.cargando && "visible"
          )}
        />

        <div
          className={classes.header}
          style={{
            padding: PADDING,
            paddingBottom: "1rem",
            paddingTop: "calc(" + PADDING + " - 8px)"
          }}
        >
          <div className={classes.imagenLogoMuni} />
          <div className={classes.contenedorTextosSistema}>
            <Typography variant="headline" noWrap style={{ fontWeight: 200 }}>
              {this.props.titulo}
            </Typography>
            {this.props.subtitulo !== undefined && (
              <Typography variant="title" noWrap>
                {this.props.subtitulo}
              </Typography>
            )}
          </div>
        </div>

        {this.renderContent()}

        <div
          className={classNames(
            classes.overlayCargando,
            this.props.cargando && "visible"
          )}
        />
      </MiCard>
    );
  }

  renderContent() {
    const { classes } = this.props;

    return <div className={classNames(classes.root, this.props.className)}>{this.props.children}</div>;
  }
}

let componente = MiCardLogin;
componente = withStyles(styles)(componente);
export default componente;
