const styles = theme => ({
  root: {
    display: "flex",
    width: "100%",
    height: "100%"
  },

  main: {
    width: "100%",
    display: "flex",
    flexDirection: "column"
  },
  separadorToolbar: {
    minHeight: 56
  },
  content: {
    flex: 1,
    width: "100%",
    overflow: "auto"
  },
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
  contenedorBreadcrumbs: {
    padding: "8px",
    paddingLeft: "16px",
    paddingRight: "16px",
    backgroundColor: "rgba(255,255,255,0.7)",
    display: "flex",
    overflow: "auto",
    maxWidth: "100%",
    "& > .breadcrumb": {
      minHeight: "40px",
      maxHeight: "40px",
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
      "& *": {
        cursor: "pointer"
      },
      "& .textos": {
        minHeight: "40px",
        maxHeight: "40px",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s",
        padding: 4,
        borderRadius: "4px",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.025)",
        border:'1px solid rgba(0,0,0,0.05)',
        "& .texto": {
          lineHeight: 1
          // overflow: "hidden",
          // textOverflow: "ellipsis",
          // display: "-webkit-box",
          // "-webkitBoxOrient": "vertical",
          // "-webkitLineClamp": 1
        }
      },
      "&:hover": {
        "& .textos": {
          backgroundColor: "rgba(0,0,0,0.05)"
        }
      }
    }
  }
});

export default styles;
