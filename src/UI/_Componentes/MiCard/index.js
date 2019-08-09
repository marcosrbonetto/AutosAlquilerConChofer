import React from "react";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";

import { Typography } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

class MiCard extends React.PureComponent {
  render() {
    let { classes, titulo } = this.props;

    let conMargin = "margin" in this.props && this.props.margin !== false;
    let conTitulo = "titulo" in this.props && this.props.titulo !== undefined;
    let sinPadding = "padding" in this.props && this.props.padding === false;

    return (
      <div className={this.props.rootClassName}>
        {conTitulo && (
          <Typography className={classNames(classes.titulo, conMargin && classes.tituloMargin)} variant="headline">
            {titulo}
          </Typography>
        )}

        <Card
          elevation={this.props.elevation}
          className={classNames(
            classes.card,
            classNames(this.props.className),
            conMargin && classes.cardMagin,
            conTitulo && conMargin && classes.cardMarginTitulo
          )}
          {...this.props.cardProps}
        >
          <CardContent className={classNames(classes.content, this.props.contentClassName, sinPadding && classes.cardSinPadding)}>
            {this.props.children != undefined && this.props.children}
          </CardContent>
        </Card>
      </div>
    );
  }
}

const styles = theme => ({
  card: {
    borderRadius: theme.spacing.unit * 2
    // transition: "all 0.3s"
  },
  cardMagin: {
    margin: theme.spacing.unit * 2
  },
  cardMarginTitulo: {
    marginTop: theme.spacing.unit * 1
  },
  titulo: {
    marginLeft: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit
  },
  tituloMargin: {
    marginTop: theme.spacing.unit * 2
  },
  content: {
    maxHeight: "100%"
  },
  cardSinPadding: {
    padding: "0 !important"
  }
});

export default withStyles(styles)(MiCard);
