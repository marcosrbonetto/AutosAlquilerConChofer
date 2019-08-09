const metodos = {
  toDate: fechaString => {
    try {
      let partesDia = fechaString.split("T")[0].split("-");

      let date = new Date(partesDia[0], partesDia[1] - 1, partesDia[2]);
      date.setHours(0);
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);
      return date;
    } catch (ex) {
      return undefined;
    }
  },
  toDateTime: fechaString => {
    try {
      let partesDia = fechaString.split("T")[0].split("-");
      let partesHora = fechaString.split("T")[1].split(":");

      let date = new Date(partesDia[0], partesDia[1] - 1, partesDia[2]);
      date.setHours(partesHora[0]);
      date.setMinutes(partesHora[1]);
      date.setSeconds(partesHora[2]);
      date.setMilliseconds(0);
      return date;
    } catch (ex) {
      return undefined;
    }
  },
  toDateString: fecha => {
    try {
      let dia = fecha.getDate();
      if (dia < 10) dia = "0" + dia;
      let mes = fecha.getMonth() + 1;
      if (mes < 10) mes = "0" + mes;
      let año = fecha.getFullYear();
      return dia + "/" + mes + "/" + año;
    } catch (e) {
      return "";
    }
  },
  toDateTimeString: fecha => {
    try {
      let dia = fecha.getDate();
      if (dia < 10) dia = "0" + dia;
      let mes = fecha.getMonth() + 1;
      if (mes < 10) mes = "0" + mes;
      let año = fecha.getFullYear();
      let hora = fecha.getHours();
      if (hora < 10) hora = "0" + hora;
      let min = fecha.getMinutes();
      if (min < 10) min = "0" + min;

      return dia + "/" + mes + "/" + año + " " + hora + ":" + min;
    } catch (e) {
      return "";
    }
  },
  transformarDuracion: (cantidad, intervalo) => {
    try {
      let fecha = new Date();
      fecha.setHours(0);
      fecha.setMinutes(0 + parseInt(cantidad) * (intervalo || 1));
      fecha.setSeconds(0);
      fecha.setMilliseconds(0);

      let hora = fecha.getHours();
      if (hora < 10) hora = "0" + hora;
      let minutos = fecha.getMinutes();
      if (minutos < 10) minutos = "0" + minutos;
      return hora + ":" + minutos;
    } catch (e) {
      return "";
    }
  },
  esMismoDia: (dia1, dia2) => {
    try {
      if (dia1 == undefined || dia2 == undefined) return false;

      if (dia1.getDate() != dia2.getDate()) return false;
      if (dia1.getMonth() != dia2.getMonth()) return false;
      if (dia1.getFullYear() != dia2.getFullYear()) return false;
      return true;
    } catch (ex) {
      return false;
    }
  },
  toTimeString: fecha => {
    try {
      let hora = fecha.getHours();
      if (hora < 10) hora = "0" + hora;
      let min = fecha.getMinutes();
      if (min < 10) min = "0" + min;
      return hora + ":" + min;
    } catch (ex) {
      return "";
    }
  }
};

export default metodos;
