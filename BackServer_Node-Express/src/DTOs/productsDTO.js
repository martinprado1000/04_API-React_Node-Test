//Aparte de modificar el dato id, tambien sacamos los datos createdAt y updatedAt porque son datos irrelevantes para el cliente.

class ProductsDTO {
  constructor(product) {
    this.id = product._id || product.id; // Esto lo que hace es que si el dato vine distinto segun la persistencia estemos usando no importa porque lo vamos retornar siempre igual.
    this.code = product.code;
    this.title = product.title;
    this.description = product.description;
    this.price = product.price;
    this.thumbnail = product.thumbnail;
    this.category = product.category;
    this.stock = product.stock;
  }
}

module.exports = ProductsDTO;
