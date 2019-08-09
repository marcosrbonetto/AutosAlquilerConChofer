const styles = theme => {
  return {
    contentOverlayCargando: {
      backgroundColor: "rgba(255,255,255,0.6)",
      position: "absolute",
      left: 0,
      right: 0,
      zIndex: theme.zIndex.drawer + 1,
      top: 0,
      bottom: 0,
      opacity: 0,
      pointerEvents: "none",
      transition: "opacity 0.3s"
    },
    contentOverlayCargandoVisible: {
      opacity: 1,
      pointerEvents: "auto"
    },
    contenedorCargando: {
      position: "absolute",
      top: 0,
      width: "100%",
      opacity: 0,
      transition: "all 0.3s"
      // position: "absolute"
    },
    contenedorCargandoVisible: {
      opacity: 1
    },
  };
};

export default styles;
