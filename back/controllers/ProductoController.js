"use strict";

var Producto = require("../models/productos");
var Inventario = require("../models/inventario");

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
      let inventario = await Inventario.create({
        admin: req.user.sub,
        cantidad: data.stock,
        proveedor: "Primer registro",
        producto: reg._id,
      });
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

const eliminar_prodcuto_admin = async function (req, res) {
  if (req.user) {
    if ((req.user.rol = "admin")) {
      var id = req.params["id"];

      let reg = await Producto.findByIdAndDelete({ _id: id });

      fs.stat(`./uploads/productos/${reg.portada}`, function (err) {
        if (!err) {
          fs.unlink(`./uploads/productos/${reg.portada}`, (err) => {
            if (err) throw err;
          });
        }
      });
      res.status(200).send({ data: reg }); //linea que pinta lo eliminado
    } else {
      res
        .status(500)
        .send({ message: "no_access_for_role_eliminar_producto_admin" });
    }
  } else {
    res
      .status(500)
      .send({ message: "no_access_for_headers_eliminar_producto_admin" });
  }
};

const listar_inventario_producto_admin = async function (req, res) {
  if (req.user) {
    if ((req.user.rol = "admin")) {
      var id = req.params["id"];
      var reg = await Inventario.find({ producto: id })
        .populate("admin")
        .sort({ createdAt: -1 });

      res.status(200).send({ data: reg });
    } else {
      res
        .status(500)
        .send({ message: "no_access_for_role_eliminar_producto_admin" });
    }
  } else {
    res
      .status(500)
      .send({ message: "no_access_for_headers_eliminar_producto_admin" });
  }
};

const eliminar_inventario_producto_admin = async function (req, res) {
  if (req.user) {
    if ((req.user.rol = "admin")) {
      var id = req.params["id"];
      let reg = await Inventario.findByIdAndDelete({ _id: id });
      let prod = await Producto.findById({ _id: reg.producto });
      let nuevo_stock = parseInt(prod.stock) - parseInt(reg.cantidad);
      let producto = await Producto.findByIdAndUpdate(
        { _id: reg.producto },
        {
          stock: nuevo_stock,
        }
      );

      res.status(200).send({ data: producto });
    } else {
      res
        .status(500)
        .send({ message: "no_access_for_role_eliminar_producto_admin" });
    }
  } else {
    res
      .status(500)
      .send({ message: "no_access_for_headers_eliminar_producto_admin" });
  }
};

const registro_inventario_producto_admin = async function (req, res) {
  if (req.user) {
    if ((req.user.rol = "admin")) {
      let data = req.body;
      let reg = await Inventario.create(data);
      let prod = await Producto.findById({ _id: reg.producto });
      let nuevo_stock = parseInt(prod.stock) + parseInt(reg.cantidad);
      let producto = await Producto.findByIdAndUpdate(
        { _id: reg.producto },
        {
          stock: nuevo_stock,
        }
      );
      res.status(200).send({ data: reg });
    } else {
      res
        .status(500)
        .send({ message: "no_access_for_role_eliminar_producto_admin" });
    }
  } else {
    res
      .status(500)
      .send({ message: "no_access_for_headers_eliminar_producto_admin" });
  }
};

const actualizar_producto_variedades_admin = async function (req, res) {
  if (req.user) {
    if (req.user.rol == "admin") {
      let id = req.params["id"];
      let data = req.body;
      //console.log(data);
      //console.log(req.files);
      let reg = await Producto.findByIdAndUpdate(
        { _id: id },
        {
          titulo_variedad: data.titulo_variedad,
          variedades: data.variedades,
        }
      );
      res.status(200).send({ data: reg });
    } else {
      res.status(500).send({
        message: "no_access_for_role_actualizar_producto_variedades_admin",
      });
    }
  } else {
    res.status(500).send({
      message: "no_access_for_headers_actualizar_producto_variedades_admin",
    });
  }
};

module.exports = {
  registro_producto_admin,
  listar_productos_admin,
  obtener_portada,
  obtener_producto_admin,
  actualizar_prodcuto_admin,
  eliminar_prodcuto_admin,
  listar_inventario_producto_admin,
  eliminar_inventario_producto_admin,
  registro_inventario_producto_admin,
  actualizar_producto_variedades_admin,
};
