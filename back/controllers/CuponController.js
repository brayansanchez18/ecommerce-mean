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

module.exports = {
  listar_cupones_admin,
  registro_cupon_admin,
};
