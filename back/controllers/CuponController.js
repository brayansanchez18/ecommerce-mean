var Cupon = require("../models/cupon");

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
  registro_cupon_admin,
};
