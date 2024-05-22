const ProductsRepository = require("../repositories/productsRepository");
const CartsRepository = require("../repositories/cartsRepository")
const mongoose = require("mongoose");

// Funcion para validar si los id son validos para mongo
const isValid = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

class ProductsService {
  constructor() {
    this.ProductsRepository = new ProductsRepository();
    this.CartsRepository = new CartsRepository();
  }

  async get() {
    try {
      const result = await this.ProductsRepository.get();
      if (!result || result == "") {
        return { status: 404, data: "No existen productos" };
      }
      return { status: 200, data: result };
    } catch (e) {
      console.log(e);
      return { status: 500, data: "Error inesperado en el sistema" };
    }
  }

  async getPaginate() {
    try {
      const result = await this.ProductsRepository.getPaginate();
      if (!result || result == "") {
        return { status: 404, data: "No existen productos" };
      }
      return { status: 200, data: result };
    } catch (e) {
      console.log(e);
      return { status: 500, data: "Error inesperado en el sistema" };
    }
  }

  async getById(id) {
    if (!isValid(id)) {
      return { status: 404, data: "ID de producto inválido" };
    }
    try {
      const result = await this.ProductsRepository.getById(id);
      if (!result) {
        return { status: 404, data: "Producto no encontrado" };
      }
      //console.log(result)
      return { status: 200, data: result };
    } catch (e) {
      console.log(e);
      return { status: 500, data: "Error inesperado en el sistema" };
    }
  }

  async post(body) {
    try {
      const result = await this.ProductsRepository.post(body);
      //console.log(result)
      return { status: 201, data: "Producto ingresado correctamente" };
    } catch (e) {
      console.log(e);
      return { status: 500, data: "Error inesperado en el sistema" };
    }
  }

  async put(id, body) {
    if (!isValid(id)) {
      return { status: 404, data: "ID de producto inválido" };
    }
    try {
      const result = await this.ProductsRepository.put(id, body);
      //console.log(result)
      if (!result) {
        return { status: 404, data: "Producto no encontrado" };
      }
      return { status: 201, data: "Producto editado correctamente" };
    } catch (e) {
      console.log(e);
      return { status: 500, data: "Error inesperado en el sistema" };
    }
  }

  async delete(id) {
    if (!isValid(id)) {
      return { status: 404, data: "ID de producto inválido" };
    }
    try {
      let carts = await this.CartsRepository.get2();
      console.log(carts)
      // Elimino el producto de todos los carritos
      carts.map((cart) => {
        cart.products = cart.products.filter((prod) => prod?.product != id);
        this.CartsRepository.save(cart);
        return cart;
      });

      const result = await this.ProductsRepository.delete(id);
      // Elimino el producto
      if (result.deletedCount == 0) {
        return { status: 404, data: "Producto no encontrado" };
      }

      return { status: 204, data: "Producto eliminado correctamente" };
    } catch (e) {
      console.log(e);
      return { status: 500, data: "Error inesperado en el sistema" };
    }
  }
}

module.exports = ProductsService;
