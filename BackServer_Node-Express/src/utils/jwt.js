const jwt = require("jsonwebtoken");

const PRIVATE_KEY = "LlaveSecreta";

const generateToken = (payload) => {
  //jwt.sing: Recibe un payload que son los datos que queremos meter en el jwt, tambien recibe la clave que va a usar para generar el token. y un objeto con varios parametros uno de ellos es cuando expira el token.
  const token = jwt.sign({ user: payload }, PRIVATE_KEY, { expiresIn: "24h" }); //expiresIn: "24", tiempo en que expira el token
  return token;
};
// Esta funcion genera el token con los datos que le mande mas la clave secreta.

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, PRIVATE_KEY, (err, payload) => {
      if (err) {
        return reject(err);
      }
      return resolve(payload);
    });
  });
};

module.exports = {
  generateToken,
  verifyToken,
};
