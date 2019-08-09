import red from "@material-ui/core/colors/red";

const styles = theme => {
  return {
    contentClassName: {
      transition: "all 0.3s",
      "&.drawerVisible": {
        [theme.breakpoints.up("md")]: {
          paddingLeft: "300px"
        }
      }
    },
    drawer: {
      backgroundColor: "white",
      border: "none",
      width: "300px",
      [theme.breakpoints.up("md")]: {
        paddingTop: "70px",
        backgroundColor: "transparent",
        "& .item": {
          borderTopRightRadius: "32px",
          borderBottomRightRadius: "32px"
        }
      }
    },
    contenedorBaners: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    },
    baner: {
      width: "100%",
      maxWidth: "800px",
      backgroundColor: red["500"],
      borderRadius: "16px",
      boxShadow: "0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)",
      marginBottom: "0px !important",
      "&.visible": {
        marginBottom: "16px !important"
      }
    },
    collapseCard: {
      borderRadius: theme.spacing.unit * 2,
      opacity: 0,
      transition: "opacity 0.3s 0s, max-height 0.3s 0.3s, margin 0.3s 0.3s",
      maxHeight: 0,
      "&.visible": {
        transition: "opacity 0.3s 0.3s, max-height 0.3s 0s, margin 0.3s 0s",
        maxHeight: 1000,
        opacity: 1,
        marginBottom: theme.spacing.unit * 4,
        marginTop: theme.spacing.unit * 4
      }
    },
    cardFiltrosActivos: {
      padding: theme.spacing.unit * 2,
      display: "flex",
      "& > div": {
        flex: 1
      }
    }
  };
};

export default styles;
