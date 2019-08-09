import React from "react";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";

class MiContent extends React.PureComponent {
  render() {
    let { classes } = this.props;
    let full = "full" in this.props && this.props.full != false;

    return (
      <div className={classNames(classes.root, this.props.rootClassName)}>
        <div className={classNames(classes.content, this.props.contentClassName, full && "full")}>{this.props.children}</div>
      </div>
    );
  }
}

const styles = theme => ({
  root: {
    display: "flex",
    width: "100%",
    padding: theme.spacing.unit * 2,
    flexDirection: "column",
    [theme.breakpoints.up("md")]: {
      padding: theme.spacing.unit * 4,
    }
  },
  content: {
    alignSelf: "center",
    width: "100%",
    maxWidth: "50rem",
    "&.full": {
      maxWidth: "100%"
    }
  }
});

export default withStyles(styles)(MiContent);
