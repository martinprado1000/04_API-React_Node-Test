const { check, validationResult } = require("express-validator");

const userLoginValidator = [
  check("email", "Ingrese una email válido")
    .isEmail()
    .isLength({ max: 30 })
    .withMessage("El email debe tener menos de 30 caracteres")
    .normalizeEmail(), // Sanitiza y normaliza el campo de correo electrónico

  check("password", "Ingrese una contraseña válida")
    .trim()
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener mas de 6 caracteres")
    .isLength({ max: 20 })
    .withMessage("La contraseña debe tener manos de 20 caracteres"),

  (req, res, next) => {
    try {
      validationResult(req).throw();
      return next();
    } catch (err) {
      res.json({ status: 404, errors: err.array() });
    }
  },
];

module.exports = { userLoginValidator };
