const metodos = {
  toTitleCase: val => {
    return val.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  },
  isEmpty: val => {
    if (val == undefined || val == null) return true;
    return val.trim() == "";
  }
};

export default metodos;
