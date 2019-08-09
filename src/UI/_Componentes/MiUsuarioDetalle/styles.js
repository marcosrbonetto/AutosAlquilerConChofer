const styles = theme => ({
  contenedor: {
    display: "flex",
    marginBottom: "4px",
    alignItems: "center"
  },
  link: {
    cursor: "pointer",
    textDecoration: "underline",
    color: theme.palette.primary.main,
    "&:hover": {
      fontWeight: "bold"
    }
  },
  foto: {
    overflow: "hidden",
    borderRadius: "48px",
    width: "48px",
    height: "48px",
    marginRight: "8px",
    backgroundSize: "cover",
    backgroundColor:'rgba(0,0,0,0.05)'
  }
});

export default styles;
