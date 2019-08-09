import React from "react";
import { withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import classNames from "classnames";

class IndicadorCargando extends React.PureComponent {
  render() {
    let { classes, backgroundColor, opacity } = this.props;

    backgroundColor = backgroundColor || "white";
    opacity = opacity || 0.7;

    return (
      <div
        className={classNames(
          classes.root,
          this.props.visible === true && classes.visible
        )}
      >
        <div
          className={classNames(classes.background)}
          style={{ opacity: opacity, backgroundColor: backgroundColor }}
        />
        <CircularProgress color="secondary" />
      </div>
    );
  }
}

const styles = theme => ({
  root: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    opacity: 0,
    pointerEvents: "none",
    transition: "all 0.3s",
    zIndex: 1000000
  },
  background: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    right: 0
  },
  visible: {
    opacity: 1,
    pointerEvents: "auto"
  }
});

export default withStyles(styles)(IndicadorCargando);
