var Cupon = require("../models/cupon");

const listar_cupones_admin = async function (req, res) {
  if (req.user) {
    if ((req.user.rol = "admin")) {
      var filtro = req.params["filtro"];
      let reg = await Cupon.find({ codigo: new RegExp(filtro, "i") }).sort({
        createdAt: -1,
      });
      res.status(200).send({ data: reg });
    } else {
      res
        .status(500)
        .send({ message: "no_access_for_role_listar_cupones_admin" });
    }
  } else {
    res
      .status(500)
      .send({ message: "no_access_for_headers_listar_cupones_admin" });
  }
};

const registro_cupon_admin = async function (req, res) {
  if (req.user) {
    if ((req.user.rol = "admin")) {
      let data = req.body;
      let reg = await Cupon.create(data);
      res.status(200).send({ data: reg });
    } else {
      res
        .status(500)
        .send({ message: "no_access_for_role_registro_cupon_admin" });
    }
  } else {
    res
      .status(500)
      .send({ message: "no_access_for_headers_registro_cupon_admin" });
  }
};

const obtener_cupon_admin = async function (req, res) {
  if (req.user) {
    if ((req.user.rol = "admin")) {
      var id = req.params["id"];

      try {
        var reg = await Cupon.findById({ _id: id });
        res.status(200).send({ data: reg });
      } catch (error) {
        res.status(200).send({ message: undefined });
      }
    } else {
      res
        .status(500)
        .send({ message: "no_access_for_role_obtener_cupon_admin" });
    }
  } else {
    res
      .status(500)
      .send({ message: "no_access_for_headers_obtener_cupon_admin" });
  }
};

const actualizar_cupon_admin = async function (req, res) {
  if (req.user) {
    if ((req.user.rol = "admin")) {
      var data = req.body;
      var id = req.params["id"];

      let reg = await Cupon.findByIdAndUpdate(
        { _id: id },
        {
          codigo: data.codigo,
          tipo: data.tipo,
          valor: data.valor,
          limite: data.limite,
        }
      );

      res.status(200).send({ data: reg });
    } else {
      res
        .status(500)
        .send({ message: "no_access_for_role_actualizar_cupon_admin" });
    }
  } else {
    res
      .status(500)
      .send({ message: "no_access_for_headers_actualizar_cupon_admin" });
  }
};

const eliminar_cupon_admin = async function (req, res) {
  if (req.user) {
    if ((req.user.rol = "admin")) {
      var id = req.params["id"];
      let reg = await Cupon.findByIdAndDelete({ _id: id });
      res.status(200).send({ data: reg });
    } else {
      res
        .status(500)
        .send({ message: "no_access_for_role_eliminar_cupon_admin" });
    }
  } else {
    res
      .status(500)
      .send({ message: "no_access_for_headers_eliminar_cupon_admin" });
  }
};

module.exports = {
  listar_cupones_admin,
  registro_cupon_admin,
  obtener_cupon_admin,
  actualizar_cupon_admin,
  eliminar_cupon_admin,
};
