const styles = theme => {
  return {
    root: {
      display: "flex",
      height: "100%",
      overflow: "hidden",
      pointerEvents: "none",
      opacity: 0,
      transition: "opacity 0.3s",
      "&.visible": {
        opacity: 1,
        pointerEvents: "all"
      }
    },
    content: {
      display: "flex",
      flexGrow: 1,
      overflow: "auto",
      overflow: "hidden"
    },
    icon: {
      fontSize: 20
    },
    snackCustomIcon: {
      marginRight: theme.spacing.unit
    },
    snackMessage: {
      display: "flex",
      alignItems: "center"
    },
    contenedorCargandoLogin: {
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      right: 0,
      opacity: 0,
      pointerEvents: "none",
      backgroundColor: "white",
      transition: "all 0.5s",
      zIndex: 2000,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      "&.visible": {
        opacity: 1
      }
    }
  };
};

export default styles;
