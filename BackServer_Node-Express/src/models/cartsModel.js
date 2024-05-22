const { Schema, model } = require("mongoose"); // de mongoose solo requier Schemay model
// Schema: es para armar el esquema de como va a ser nuestra colleccion, se escribe en mayusculo porque es una clase.
// model: es lo que interactua nuestro esquema con la colleccion

//Los tipo de datos los obtenemos d la paguina de mongoose
const cartsSchema = new Schema(
  {
    email: {
      type: String,
      trim:true // Saca los espacios al principio y al final
    },
    products: {
      // Con la siguiente estructura le indicamos a que tabla va a hacer referencia
      type: [
        {
          product: {
            // Aca es el valor que guardamos en este documento
            type: Schema.Types.ObjectId, // Aca le decimos que el tipo de dato es un objetId de mongoose, que este va a ser referencia a otra colleccion
            ref: "products", // Aca le indicamos que hace referencia a la colleccion products
          },
          quantity: Number,
        },
      ],
      default: [], // Si no le pasan nada a este carrito le asigna un arreglo vacio.
    },
  },
  { timestamps: true }
);

module.exports = model("carts", cartsSchema);
/** 
// Asi seria el tipo de objeto que le tengo que pasar a este Model.
{
    "email": mar@gmail.com,
    "products": [
        { 
          "product" : 3j4hn5mn35n3b534m,  // Este seria el _id de la colleccion a la que hago referencia.
          "quantity" : 5
        },
                { 
          "product" : 3j4hn5mn35n3b534m, 
          "quantity" : 5
        }
    ]
} 
**/
