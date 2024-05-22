//Aparte de modificar el dato id, tambien sacamos los datos createdAt y updatedAt porque son datos irrelevantes para el cliente.

class CartsDTO {
  constructor(cart) {
    this.id = cart._id || cart.id;
    this.email = cart.email;
    this.products = cart.products;
  }
}

module.exports = CartsDTO;

// {
//   "email": mar@gmail.com,
//   "products": [
//       { 
//         "product" : 3j4hn5mn35n3b534m,  // Este seria el _id de la colleccion a la que hago referencia.
//         "quantity" : 5
//       }
//   ]
// }
