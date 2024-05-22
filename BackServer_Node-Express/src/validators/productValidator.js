const { check, validationResult } = require("express-validator");

const upperCase = (str) => {
  return str.toUpperCase();
};

const productValidator = [
  check("title", "Ingrese un título válido") // Este es la respuesta de error en caso de no tener .withMessage
    //.exists() // No los pongo porque esto ya lo valido con el .isLength
    //.notEmpty() // No los pongo porque esto ya lo valido con el .isLength
    .trim() // Saca los espacios del princio y el final. Esto no retorna error
    .matches(/^[a-zA-Z0-9 ]*$/)
    .withMessage(
      "El campo solo puede contener letras, sin espacios ni caracteres especiales"
    ) // Expresión regular para permitir solo letras sin espacios
    .isLength({ min: 2 })
    .withMessage("El título debe tener mas de 2 caracteres")
    .isLength({ max: 20 })
    .withMessage("El título debe tener menos de 20 caracteres")
    .customSanitizer(upperCase), //Transformo en upperCase

  check("description", "Ingrese una descripción válido")
    .trim()
    .matches(/^[a-zA-Z0-9 ]*$/)
    .withMessage('El descripción no debe contener caracteres especiales') // Expresión regular que NO permite caracteres especiales.
    .isLength({ min: 2 })
    .withMessage("El descripción debe tener mas de 2 caracteres")
    .isLength({ max: 500 })
    .withMessage("El descripción debe tener menos de 500 caracteres"),

  check("code", "Ingrese un código válido")
    .trim()
    .isLength({ min: 4 })
    .withMessage("El código debe tener mas de 4 caracteres")
    .isLength({ max: 20 })
    .withMessage("El código debe tener menos de 20 caracteres"),

  check("price", "El valor precio debe ser numérico")
    .trim()
    .custom((value, { req }) => {
      if (value < 1) {
        throw new Error("El valor precio debe ser numérico mayor a 0");
      }
      return true;
    })
    .isNumeric(), // Si el valor es un string lo convierte a numero, si son letras lanza el error.

    check("stock", "El valor stock debe ser numérico")
    .trim()
    .custom((value, { req }) => {
      if (value < 0) {
        throw new Error("El valor stock no puede ser menor que 0");
      }
      return true;
    })
    .isNumeric(), // Si el valor es un string lo convierte a numero, si son letras lanza el error.

  check("category", "Ingrese una categoría válida")
    .isIn(["PC", "Monitor", "Teclado"]) // Valida que el valor sea uno de estos
    .withMessage(
      "El campo categoría debe ser PC, Teclado o Monitor"
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

module.exports = { productValidator };
