"use strict";

var Producto = require("../models/productos");
var fs = require("fs");
var path = require("path");

const registro_producto_admin = async function (req, res) {
  if (req.user) {
    if (req.user.rol == "admin") {
      let data = req.body;
      var img_path = req.files.portada.path;
      var name = img_path.split("\\");
      var portada_name = name[2];

      data.slug = data.titulo
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");
      data.portada = portada_name;
      let reg = await Producto.create(data);
      res.status(200).send({ data: reg });
    } else {
      res.status(500).send({ message: "no_access_for_role" });
    }
  } else {
    res.status(500).send({ message: "no_access_for_headers" });
  }
};

const listar_productos_admin = async function (req, res) {
  if (req.user) {
    if (req.user.rol == "admin") {
      var filtro = req.params["filtro"];
      let reg = await Producto.find({ titulo: new RegExp(filtro, "i") });
      res.status(200).send({ data: reg });
    } else {
      res
        .status(500)
        .send({ message: "no_access_for_role_listar_productos_admin" });
    }
  } else {
    res
      .status(500)
      .send({ message: "no_access_for_headers_listar_productos_admin" });
  }
};

const obtener_portada = async function (req, res) {
  var img = req.params["img"];
  // console.log(img);
  fs.stat(`./uploads/productos/${img}`, function (err) {
    if (!err) {
      let path_img = `./uploads/productos/${img}`;
      res.status(200).sendFile(path.resolve(path_img));
    } else {
      let path_img = `./uploads/default.jpg`;
      res.status(200).sendFile(path.resolve(path_img));
    }
  });
};

const obtener_producto_admin = async function (req, res) {
  if (req.user) {
    if (req.user.rol == "admin") {
      var id = req.params["id"];
      try {
        var reg = await Producto.findById({ _id: id });
        res.status(200).send({ data: reg });
      } catch (error) {
        res.status(200).send({ data: undefined });
      }
    } else {
      res
        .status(500)
        .send({ message: "no_access_for_role_obtener_producto_admin" });
    }
  } else {
    res
      .status(500)
      .send({ message: "no_access_for_headers_obtener_prodcuto_admin" });
  }
};

const actualizar_prodcuto_admin = async function (req, res) {
  if (req.user) {
    if (req.user.rol == "admin") {
      let id = req.params["id"];
      let data = req.body;

      if (req.files) {
        //si hay imagen
        var img_path = req.files.portada.path;
        var name = img_path.split("\\");
        var portada_name = name[2];

        // console.log("si hay imagen");
        // console.log(`img_path: ${img_path}`);
        // console.log(`name: ${name}`);
        // console.log(`prtada_name: ${portada_name}`);

        let reg = await Producto.findByIdAndUpdate(
          { _id: id },
          {
            titulo: data.titulo,
            stock: data.stock,
            precio: data.precio,
            categoria: data.categoria,
            descripcion: data.descripcion,
            contenido: data.contenido,
            portada: portada_name,
          }
        );

        fs.stat(`./uploads/productos/${reg.portada}`, function (err) {
          if (!err) {
            fs.unlink(`./uploads/productos/${reg.portada}`, (err) => {
              if (err) throw err;
            });
          }
        });

        res.status(200).send({ data: reg });
      } else {
        // console.log("no hay imagen");
        //no hay imagen
        let reg = await Producto.findByIdAndUpdate(
          { _id: id },
          {
            titulo: data.titulo,
            stock: data.stock,
            precio: data.precio,
            categoria: data.categoria,
            descripcion: data.descripcion,
            contenido: data.contenido,
          }
        );
        res.status(200).send({ data: reg });
      }
    } else {
      res
        .status(500)
        .send({ message: "no_access_for_role_actualizar_prodcuto_admin" });
    }
  } else {
    res
      .status(500)
      .send({ message: "no_access_for_headers_actualizar_prodcuto_admin" });
  }
};

module.exports = {
  registro_producto_admin,
  listar_productos_admin,
  obtener_portada,
  obtener_producto_admin,
  actualizar_prodcuto_admin,
};
