"use strict";

var Cliente = require("../models/cliente");
var bcrypt = require("bcrypt-nodejs");
var jwt = require("../helpers/jwt");

const registro_cliente = async function (req, res) {
  var data = req.body;
  var clientes_arr = [];

  clientes_arr = await Cliente.find({ email: data.email });

  if (clientes_arr.length == 0) {
    if (data.password) {
      bcrypt.hash(data.password, null, null, async function (err, hash) {
        if (hash) {
          data.password = hash;
          var reg = await Cliente.create(data);
          res.status(200).send({ data: reg });
        } else {
          res.status(200).send({ message: "error_server", data: undefined });
        }
      });
    } else {
      res
        .status(200)
        .send({ message: "no_hay_una_contrasena", data: undefined });
    }
  } else {
    res.status(200).send({ message: "el_correo_ya_existe", data: undefined });
  }
};

const login_cliente = async function (req, res) {
  var data = req.body;
  var cliente_arr = [];

  cliente_arr = await Cliente.find({ email: data.email });

  if (cliente_arr.length == 0) {
    res
      .status(200)
      .send({ message: "no_se_encontro_el_correo", data: undefined });
  } else {
    let user = cliente_arr[0];
    bcrypt.compare(data.password, user.password, async function (error, check) {
      if (check) {
        res.status(200).send({
          data: user,
          token: jwt.createToken(user),
        });
      } else {
        res
          .status(200)
          .send({ message: "la_contrasena_no_coincide", data: undefined });
      }
    });
  }
};

const listar_clientes_filtro_admin = async function (req, res) {
  // console.log(req.user);
  if (req.user) {
    if (req.user.rol == "admin") {
      let tipo = req.params["tipo"];
      let filtro = req.params["filtro"];

      // console.log(tipo);

      if ((tipo == null) | (tipo == "null")) {
        let reg = await Cliente.find();
        res.status(200).send({ data: reg });
      } else {
        if (tipo == "apellidos") {
          let reg = await Cliente.find({ apellidos: new RegExp(filtro, "i") });
          res.status(200).send({ data: reg });
        } else if (tipo == "correo") {
          let reg = await Cliente.find({ email: new RegExp(filtro, "i") });
          res.status(200).send({ data: reg });
        }
      }
    } else {
      res.status(500).send({ message: "No_Access" });
    }
  } else {
    res.status(500).send({ message: "no_access" });
  }
};

const regitro_cliente_admin = async function (req, res) {
  if (req.user) {
    if (req.user.rol == "admin") {
      var data = req.body;

      bcrypt.hash("123456", null, null, async function (err, hash) {
        if (hash) {
          data.password = hash;
          let reg = await Cliente.create(data);
          // console.log(reg);
          res.status(200).send({ data: reg });
        } else {
          res
            .status(200)
            .send({ message: "hubo_un_error_en_el_servidor", data: undefined });
        }
      });
    } else {
      res.status(200).send({ message: "No_Access" });
    }
  } else {
    res.status(200).send({ message: "No_Access" });
  }
};

const obtener_cliente_admin = async function (req, res) {
  if (req.user) {
    if (req.user.rol == "admin") {
      var id = req.params["id"];
      try {
        var reg = await Cliente.findById({ _id: id });
        res.status(200).send({ data: reg }); //con el res se envia la data al frontend
      } catch (error) {
        res.status(200).send({ data: undefined });
      }
    } else {
      res.status(500).send({ message: "No_Access" });
    }
  } else {
    res.status(500).send({ message: "No_Access" });
  }
};

const actualizar_cliente_admin = async function (req, res) {
  if (req.user) {
    if (req.user.rol == "admin") {
      var id = req.params["id"];
      var data = req.body; //esta linea captura los datos del formulario y las pone en la variable data
      var reg = await Cliente.findByIdAndUpdate(
        { _id: id },
        {
          nombres: data.nombres,
          apellidos: data.apellidos,
          email: data.email,
          telefono: data.telefono,
          f_nacimiento: data.f_nacimiento,
          dni: data.dni,
          genero: data.genero,
        }
      );
      res.status(200).send({ daat: reg });
    } else {
      res.status(500).send({ message: "No_Access" });
    }
  } else {
    res.status(500).send({ message: "No_Access" });
  }
};

const eliminar_cliente_admin = async (req, res) => {
  if (req.user) {
    if ((req.user.rol = "admin")) {
      var id = req.params["id"];

      let reg = await Cliente.findByIdAndDelete({ _id: id });
      res.status(200).send({ data: reg }); //linea que pinta lo eliminado
    } else {
      res.status(500).send({ message: "No_Access" });
    }
  } else {
    res.status(500).send({ message: "No_Access" });
  }
};

const obtener_cliente_guest = async function (req, res) {
  if (req.user) {
    var id = req.params["id"];
    try {
      var reg = await Cliente.findById({ _id: id });
      res.status(200).send({ data: reg }); //con el res se envia la data al frontend
    } catch (error) {
      res.status(200).send({ data: undefined });
    }
  } else {
    res
      .status(500)
      .send({ message: "No_Access_for_headers_obtener_cliente_guest" });
  }
};

const actualizar_cliente_guest = async function (req, res) {
  if (req.user) {
    var id = req.params["id"];
    var data = req.body;

    if (data.password) {
      bcrypt.hash(data.password, null, null, async function (err, hash) {
        var reg = await Cliente.findByIdAndUpdate(
          { _id: id },
          {
            nombres: data.nombres,
            apellidos: hash.apellidos,
            // email: data.email,
            telefono: data.telefono,
            f_nacimiento: data.f_nacimiento,
            genero: data.genero,
            pais: data.pais,
            password: data.password,
          }
        );
        res.status(200).send({ data: reg });
      });
    } else {
      var reg = await Cliente.findByIdAndUpdate(
        { _id: id },
        {
          nombres: data.nombres,
          apellidos: data.apellidos,
          // email: data.email,
          telefono: data.telefono,
          f_nacimiento: data.f_nacimiento,
          genero: data.genero,
          pais: data.pais,
        }
      );
      res.status(200).send({ data: reg });
    }
  } else {
    res
      .status(500)
      .send({ message: "No_Access_for_headers_actualizar_cliente_guest" });
  }
};

module.exports = {
  registro_cliente,
  login_cliente,
  listar_clientes_filtro_admin,
  regitro_cliente_admin,
  obtener_cliente_admin,
  actualizar_cliente_admin,
  eliminar_cliente_admin,
  obtener_cliente_guest,
  actualizar_cliente_guest,
};
