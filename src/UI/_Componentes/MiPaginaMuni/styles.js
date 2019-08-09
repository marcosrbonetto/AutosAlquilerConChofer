const botonAppWidth = 80;
const botonAppMargin = 8;
const styles = theme => {
  return {
    root: {
      opacity: 0,
      pointerEvents: "none",
      transition: "opacity 0.3s",
      "&.visible": {
        opacity: 1,
        pointerEvents: "all"
      }
    },
    paginaContent: {
      overflow: "auto"
    },
    contentClassName: {
      display: "flex",
      flexDirection: "column",
      height: "100%"
    },
    toolbar: {
      backgroundColor: "white",
      "& h2": {
        color: "black"
      },
      "& h3": {
        color: "black"
      },
      color: "black"
    },
    logoMuni: {
      marginRight: "8px",
      backgroundPosition: "center",
      minWidth: "40px",
      maxWidth: "40px",
      minHeight: "40px",
      maxHeight: "40px",
      backgroundRepeat: "no-repeat",
      backgroundSize: "contain",
      [theme.breakpoints.up("md")]: {
        marginRight: "16px",
        flexDirection: "row",
        minWidth: "126px",
        maxWidth: "126px"
      }
    },
    contenedorBotonesApp: {
      paddingLeft: 12,
      paddingRight: 12,
      maxWidth: (botonAppWidth + botonAppMargin * 2) * 3 + 24,
      minWidth: (botonAppWidth + botonAppMargin * 2) * 3 + 24,
      outline: "none",
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      alignItems: "center"
    },
    botonApp: {
      margin: botonAppMargin,
      maxWidth: botonAppWidth,
      minWidth: botonAppWidth,
      overflow: "hidden",
      "& .icono": {
        width: 50,
        height: 50
      },
      "& .nombre": {
        marginTop: 8,
        minHeight: 40,
        maxHeight: 40,
        fontSize: "12px",
        textTransform: "initial"
      }
    }
  };
};

export default styles;
