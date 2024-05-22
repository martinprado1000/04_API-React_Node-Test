const { check, validationResult } = require("express-validator");

const userRecoveryPasswordValidator = [

  check("email", "Ingrese una email válido")
    .isEmail()
    .isLength({ max: 30 })
    .withMessage("El email debe tener menos de 30 caracteres")
    .normalizeEmail(), // Sanitiza y normaliza el campo de correo electrónico

  (req, res, next) => {
    try {
      validationResult(req).throw();
      return next();
    } catch (err) {
      res.json({ status: 404, errors: err.array() });
    }
  },
];

module.exports = { userRecoveryPasswordValidator };
