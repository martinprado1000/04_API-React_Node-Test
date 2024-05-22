const { check, validationResult } = require("express-validator");

const upperCase = (str) => {
  return str.toUpperCase();
};

const userPostRegisterValidator = [
  check("name", "Ingrese un nombre válido") // Este es la respuesta de error en caso de no tener .withMessage
    //.exists() // No los pongo porque esto ya lo valido con el .isLength
    //.notEmpty() // No los pongo porque esto ya lo valido con el .isLength
    .trim() // Saca los espacios del princio y el final. Esto no retorna error
    .matches(/^[A-Za-zñÑ]+$/)
    .withMessage(
      "El campo nombre solo puede contener letras sin espacios ni caracteres especiales"
    ) // Expresión regular para permitir solo letras sin espacios
    .isLength({ min: 2 })
    .withMessage("El nombre debe tener mas de 2 caracteres")
    .isLength({ max: 20 })
    .withMessage("El nombre debe tener menos de 20 caracteres")
    .customSanitizer(upperCase), //Transformo en upperCase

  check("lastname", "Ingrese un apellido válido")
    .trim()
    .matches(/^[A-Za-zñÑ]+$/)
    .withMessage(
      "El campo apellido solo puede contener letras sin espacios ni caracteres especiales"
    ) // Expresión regular para permitir solo letras sin espacios
    .isLength({ min: 2 })
    .withMessage("El apellido debe tener mas de 2 caracteres")
    .isLength({ max: 20 })
    .withMessage("El apellido debe tener menos de 20 caracteres")
    .customSanitizer(upperCase),

  check("username", "Ingrese un nombre de usuario válido") // Este es la respuesta de error en caso de no tener .withMessage
    .optional()
    .trim()
    .isLength({ min: 6 })
    .withMessage("El nombre de usuario debe tener mas de 2 caracteres")
    .isLength({ max: 20 })
    .withMessage("El nombre de usuario debe tener menos de 20 caracteres"),

  check("age", "El valor edad debe ser numérico")
    .optional()
    .trim()
    .isNumeric() // Si el valor es un string lo convierte a numero, si son letras lanza el error.
    .custom((value, { req }) => {
      if (value < 1 || value > 99) {
        throw new Error("El valor edad debe ser numérico entre 1 y 99");
      }
      return true;
    }),

  check("email", "Ingrese una email válido")
    .isEmail()
    .isLength({ max: 30 })
    .withMessage("El email debe tener menos de 30 caracteres")
    .normalizeEmail(), // Sanitiza y normaliza el campo de correo electrónico

  check("password", "Ingrese una contraseña válida") // Este es la respuesta de error en caso de no tener .withMessage
    .trim()
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener mas de 6 caracteres")
    .isLength({ max: 20 })
    .withMessage("La contraseña debe tener menos de 20 caracteres"),

  check("passwordRepeat", "Ingrese una contraseña válida") // Este es la respuesta de error en caso de no tener .withMessage
    .trim()
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener mas de 6 caracteres")
    .isLength({ max: 20 })
    .withMessage("La contraseña debe tener menos de 20 caracteres")
    .custom((value, { req }) => {
      // Valido que las passwords sean igiales
      if (value != req.body.password) {
        throw new Error(`Las contraseñas no coinciden`);
      }
      return true;
    }),

  check("rol", "Ingrese un rol válido")
    .optional()
    .isIn(["superAdmin", "admin", "user", "userPremium"]) // Valida que el valor sea uno de estos
    .withMessage(
      "El campo role debe ser admin, superAdmin, user o userPremium"
    ),

  (req, res, next) => {
    try {
      validationResult(req).throw();
      return next();
    } catch (err) {
      res.json({ status: 404, data: err.array() });
    }
  },
];

module.exports = { userPostRegisterValidator };
