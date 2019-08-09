const styles = theme => {
  return {
    progress: {
      opacity: 1,
      zIndex: "1",
      height: "8px",
      minHeight: "8px",
      /* position: fixed; */
      left: 0,
      right: 0,
      top: "0px",
      opacity: 0,
      transition: "opacity 0.3s",
      "&.visible": {
        opacity: 1
      }
    },
    overlayCargando: {
      backgroundColor: "rgba(255,255,255,0.6)",
      position: "absolute",
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      opacity: 0,
      borderRadius: "16px",
      pointerEvents: "none",
      transition: "opacity 0.3s",
      "&.visible": {
        opacity: 1,
        pointerEvents: "auto"
      }
    },
    root: {
      display: "flex",
      width: "100%",
      flexDirection: "column",
      height: "100%",
      justifyContent: "center"
    },
    cardRoot: {
      marginLeft: "0rem",
      marginRight: "0rem",
      maxWidth: "600px",
      alignSelf: "center",
      width: "calc(100%)",
      height: "100%",
      maxHeight: "100%",
      opacity: 0,
      transform: "translateY(100px)",
      transition: "all 0.3s",
      "& > div": {
        borderRadius: "0 !important"
      },
      [theme.breakpoints.up("sm")]: {
        marginLeft: "2rem",
        marginRight: "2rem",
        width: "calc(100% - 4rem)",
        maxHeight: "550px",
        "& > div": {
          borderRadius: "16px !important"
        }
      },

      "&.visible": {
        opacity: 1,
        transform: "translateY(0)"
      }
    },
    cardContent: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      flex: 1,
      maxHeight: "100%",
      "& > div": {
        display: "flex",
        flexDirection: "column",
        flex: 1
      }
    },
    header: {
      paddingBottom: "0",
      display: "flex",
      alignItems: "center",
      minHeight: "fit-content"
    },
    contenedorTextosSistema: {
      marginLeft: "16px"
    },
    imagenLogoMuni: {
      width: "64px",
      height: "64px",
      minWidth: "64px",
      backgroundImage:
        "url(https://servicios2.cordoba.gov.ar/VecinoVirtualUtils_Internet/Resources/Imagenes/escudo_verde.png)",
      backgroundRepeat: "no-repeat",
      backgroundSize: "contain",
      backgroundPosition: "center"
    },
    content: {
      flex: 1,
      display: "flex",
      flexDirection: "column"
    },
    mainContent: {
      flex: 1,
      overflow: "auto"
    },
    footer: {
      borderTop: "1px solid rgba(0,0,0,0.1)",
      padding: "16px",
      display: "flex"
    }
  };
};
export default styles;
