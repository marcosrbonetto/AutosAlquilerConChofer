const metodos = {
  achicar: (data, w) => {
    return new Promise((callback, callbackError) => {
      var canvas = document.createElement("canvas");
      var ctx = canvas.getContext("2d");

      var image = new Image();
      image.setAttribute("crossOrigin", "anonymous");

      image.onload = () => {
        ctx.drawImage(image, 0, 0);

        var width = image.width;
        var height = image.height;

        if (width > height) {
          if (width > w) {
            height *= w / width;
            width = w;
          }
        } else {
          if (height > w) {
            width *= w / height;
            height = w;
          }
        }
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(image, 0, 0, width, height);

        callback(canvas.toDataURL("image/png", 0.7));
      };

      image.src = data;
    });
  }
};

export default metodos;
