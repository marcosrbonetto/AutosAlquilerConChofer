const botonAppWidth = 80;
const botonAppMargin = 8;

const styles = theme => {
  return {
    boton: {
      color: "white",
      maxWidth: 36,
      minWidth: 36,
      maxHeight: 36,
      minHeight: 36,
      padding: 0,
      marginRight: theme.spacing.unit,
      marginLeft: theme.spacing.unit,
      [theme.breakpoints.up("sm")]: {
        maxWidth: 300,
        padding: theme.spacing.unit
      },
      "& .textoServicios": {
        display: "none",
        [theme.breakpoints.up("sm")]: {
          display: "inherit"
        }
      },
      "& .icon": {
        marginRight: 0,
        [theme.breakpoints.up("sm")]: {
          marginRight: 4
        }
      }
    },
    menu: {
      paddingLeft: 12,
      paddingRight: 12,
      maxWidth: (botonAppWidth + botonAppMargin * 2) * 3 + 24,
      minWidth: (botonAppWidth + botonAppMargin * 2) * 3 + 24,
      outline: "none",
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      alignItems: "center",
      "& .app": {
        margin: botonAppMargin,
        maxWidth: botonAppWidth,
        minWidth: botonAppWidth,
        overflow: "hidden",
        "& .icono": {
          width: 50,
          height: 50
        },
        "& .nombre": {
          marginTop: 4,
          minHeight: 32,
          maxHeight: 32,
          overflow: "hidden",
          fontSize: "12px",
          textAlign: "center",
          textTransform: "initial",
          lineClamp: 2,
          overflow: "hidden",
          display: "-webkit-box",
          boxOrient: "vertical"
        }
      }
    }
  };
};
export default styles;
