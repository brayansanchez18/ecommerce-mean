"use strict";

var express = require("express");
var app = express();
var bodyparser = require("body-parser");
var mongoose = require("mongoose");
var port = process.env.PORT || 4200;

mongoose
  .connect("mongodb://127.0.0.1:27017/ecommerce")
  .then(() => {
    app.listen(port, function () {
      console.log("Servidor Corriendo en el puerto " + port);
    });
  })
  .catch((err) => {
    console.error("Error de conexión a la base de datos:", err);
  });

module.exports = app;
