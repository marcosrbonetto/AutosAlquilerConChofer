const styles = theme => {
  return {
    toolbar: {
      paddingLeft: 12,
      minHeight: 56,
      maxHeight: 56,
      paddingRight: 12,
      backgroundColor: "white"
    },
    toolbarIcon: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: "0 8px",
      ...theme.mixins.toolbar
    },
    menuButton: {
      // marginLeft: 12,
      // marginRight: 12
    },
    appBar: {
      backgroundColor: "white",
      zIndex: theme.zIndex.drawer + 2,
      boxShadow: "0px 2px 4px -1px rgba(0,0,0,0.1), 0px 4px 5px 0px rgba(0,0,0,0.04), 0px 1px 10px 0px rgba(0,0,0,0)"
      // borderBottom: "2px solid rgba(0,0,0,0.1)"
    },
    logoMuni: {},
    contenedorTitulo: {
      overflow: "auto",
      display: "flex",

      flexGrow: 1,
      flexDirection: "column",
      alignItems: "flex-start",

      // [theme.breakpoints.up("sm")]: {
      //   alignItems: "center",
      //   flexDirection: "row"
      // },
      "& .titulo": {
        fontSize: 16
      },
      "& .subtitulo": {
        paddingLeft: 0,
        marginLeft: 0
        // [theme.breakpoints.up("sm")]: {
        //   borderLeft: "1px solid rgba(0,0,0,0.1)",
        //   paddingLeft: theme.spacing.unit * 2,
        //   marginLeft: theme.spacing.unit * 2
        // }
      }
    },

    icono: {
      width: 40,
      height: 40,
      borderRadius: 40,
      backgroundColor: "rgba(0,0,0,0.05)"
    },
    menuUsuario: {
      "& div:nth-child(2)": {
        width: "20rem",
        // minWidth: "20rem",
        maxWidth: "calc(100% - 2rem)"
      },
      "& ul": {
        paddingTop: 0
      }
    },
    menuUsuarioInfo: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: theme.spacing.unit * 2,
      "& h2": {
        marginLeft: theme.spacing.unit
      },
      "& > div": {
        width: "5rem",
        height: "5rem",
        marginBottom: "0.5rem"
      },
      "&:focus": {
        outline: "none"
      },
      backgroundColor: "rgba(0,0,0,0.025)",
      borderBottom: "1px solid rgba(0, 0, 0, 0.095);"
    },
    contenedorCargando: {
      position: "absolute",
      bottom: 0,
      width: "100%",
      opacity: 0,
      transition: "all 0.3s"
      // position: "absolute"
    },
    contenedorCargandoVisible: {
      opacity: 1
    },
    contenedorCuerpo: {
      flex: 1,
      display: "flex",
      alignItems: "start",
      flexDirection: "column",
      overflow: "hidden"
    },
    contenedorBreadcrumbs: {
      display: "flex",
      overflow: "auto",
      maxWidth: "100%",
      "& > .breadcrumb": {
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        "& *": {
          cursor: "pointer"
        },
        "& .texto": {
          transition: "all 0.3s",
          padding: 4,
          paddingTop: 0,
          paddingBottom: 0,
          borderRadius: "4px"
          // overflow: "hidden",
          // textOverflow: "ellipsis",
          // display: "-webkit-box",
          // "-webkitBoxOrient": "vertical",
          // "-webkitLineClamp": 1
        },
        "&:hover": {
          "& .texto": {
            backgroundColor: "rgba(0,0,0,0.05)"
          }
        }
      }
    },
    botonUsuario: {
      padding: 0,
      marginRight: theme.spacing.unit,
      marginLeft: theme.spacing.unit
    }
  };
};

export default styles;
