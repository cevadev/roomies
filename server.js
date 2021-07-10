const express = require("express");
const port = process.env.PORT || 8080;

const app = express();

// nos ubicamos en la raiz del proyecto, e indicamos donde estan los fuentes compilados
app.use(express.static(__dirname, "/dist"));

// generamos la ruta
app.get(/.*/, function(req, res) {
  res.sendFile(__dirname, "/dist/index.html");
});

app.listen(port);

console.info("server started");
