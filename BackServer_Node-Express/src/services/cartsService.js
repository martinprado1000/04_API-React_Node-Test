const CartsRepository = require("../repositories/cartsRepository");
const ProductsRepository = require("../repositories/productsRepository");

const mongoose = require("mongoose");
const { sendMailBuyProductFn } = require("../utils/sendMailFn")

// Funcion para validar si los id son validos para mongo
const isValid = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

class CartsService {
  constructor() {
    this.CartsRepository = new CartsRepository();
    this.ProductsRepository = new ProductsRepository();
  }

  // Queries de carritos ------------------------------------------------------
  async get(limit) {
    try {
      const result = await this.CartsRepository.get(limit);
      if (!result || result == "") {
        return { status: 201, data: "No hay carritos cargados en el sistema" };
      }
      return { status: 200, data: result };
    } catch (e) {
      console.log(e);
      return { status: 500, data: "Error inesperado en el sistema" };
    }
  }

  async getById(id) {
    if (!isValid(id)) {
      return { status: 404, data: "ID del carrito invalido" };
    }
    try {
      const result = await this.CartsRepository.getById(id);
      if (!result) {
        return { status: 404, data: "Carrito inexistente" };
      }
      if (result == "") {
        return { status: 404, data: "Carrito sin productos" };
      }
      return { status: 200, data: result };
    } catch (e) {
      console.log(e);
      return { status: 500, data: "Error inesperado en el sistema" };
    }
  }

  async getByIdLean(id) {
    if (!isValid(id)) {
      return { status: 404, data: "ID del carrito invalido" };
    }
    try {
      const result = await this.CartsRepository.getByIdLean(id);
      if (!result) {
        return { status: 404, data: "Carrito inexistente" };
      }
      if (result == "") {
        return { status: 404, data: "Carrito sin productos" };
      }
      return { status: 200, data: result };
    } catch (e) {
      console.log(e);
      return { status: 500, data: "Error inesperado en el sistema" };
    }
  }

  async getByEmail(email) {
    try {
      const result = await this.CartsRepository.getByEmail(email);
      if (!result) {
        return { status: 404, data: "Carrito inexistente" };
      }
      if (result == "") {
        return { status: 404, data: "Carrito sin productos" };
      }
      return { status: 200, data: result };
    } catch (e) {
      console.log(e);
      return { status: 500, data: "Error inesperado en el sistema" };
    }
  }

  async post(body) {
    try {
      const cartFound = await this.getByEmail(body.email);
      if (cartFound.status === 200) {
        return { status: 404, data: "El carrito ya existe" };
      }
      const result = await this.CartsRepository.post(body.email);
      if (!result){
        throw new Error("Error al realizar la consulta POST de cartService ");
      }
      return { status: 201, data: "Carrito creado correctamente" };
    } catch (error) {
      console.log(error);
      return { status: 500, data: "Error inesperado en el sistema" };
    }
  }

  async put(id, body) {
    if (!isValid(id)) {
      return { status: 404, data: "ID del carrito invalido" };
    }
    try {
      const cartFound = await this.CartsRepository.getByEmail(body.email);
      if (cartFound != null) {
        return { status: 404, data: "El email ya existe" };
      }
      const result = await this.CartsRepository.put(id, body);
      if (!result) {
        return { status: 404, data: "Carrito inexistente" };
      }
      return { status: 201, data: "Carrito editado correctamente" };
    } catch (e) {
      console.log(e);
      return { status: 500, data: "Error inesperado en el sistema" };
    }
  }

  async delete(id) {
    if (!isValid(id)) {
      return { status: 404, data: "ID del carrito invalido" };
    }
    try {
      const result = await this.CartsRepository.delete(id);
      if (result.deletedCount == 0) {
        return { status: 404, data: "Carrito inexistente" };
      }
      return { status: 204, data: "Carrito eliminado correctamente" };
    } catch (e) {
      console.log(e);
      return { status: 500, data: "Error inesperado en el sistema" };
    }
  }

  // Queries de productos en un carrito ----------------------------------------

  async getProductFromCart({ cid, pid }) {
    if (!isValid(cid) || !isValid(pid)) {
      return { status: 404, data: "ID invalido" };
    }
    if (!cid || !pid) {
      return {
        status: 404,
        data: "Debe enviar un id de carrito y de producto",
      };
    }
    try {
      const cartFound = await this.CartsRepository.getById(cid);
      if (!cartFound) {
        return {
          status: 404,
          data: "Carrito inexistente",
        };
      }
      if (cartFound == "") {
        return {
          status: 404,
          data: "Carrito sin productos",
        };
      }
      const productFound = cartFound.products.find((p) => p.product == pid);
      if (!productFound) {
        return { status: 404, data: "Producto no encontrado en el carrito" };
      }
      return { status: 200, data: productFound };
    } catch (e) {
      return { status: 500, data: "Error inesperado en el sistema" };
    }
  }

  async postProductFromCart({ cid, pid, body }) {
    const quantity = parseInt(body.quantity)
    const addProduct = {
      "product": pid, // Este seria el _id de la colleccion a la que hago referencia.
      "quantity": quantity,
    };
    // Valido id de mongo
    if (!isValid(cid) || !isValid(pid)) {
      return { status: 404, data: "ID invalido" };
    }
    if (!quantity) {
      return { status: 404, data: "Debe ingresar la cantidad" };
    }
    if (quantity <= 0) {
      return { status: 404, data: "Cantidad de producto incorrecta" };
    }
    try {
      let cartFound = await this.CartsRepository.getByIdNotDto(cid);
      // Valido si existe el carrito
      if (!cartFound) {
        return {
          status: 404,
          data: "Carrito inexistente",
        };
      }

      const productFound = await this.ProductsRepository.getById(pid);
      // Valido si existe el producto
      if (!productFound) {
        return {
          status: 404,
          data: "Producto inexistente",
        };
      }
      // Valido stock disponible
      if (productFound.stock < quantity) {
        return {
          status: 404,
          data: "Stock insuficiente",
        };
      }

      // Busco el producto en el carrito
      let productFoundInCart = cartFound.products.find(
        (p) => p.product._id == pid
      );

      // Valido si el carrita esta vacio o si existe el producto en el carrito
      if (cartFound.products == "" || productFoundInCart == undefined) {
        cartFound.products.push(addProduct);
        await this.CartsRepository.save(cartFound);
        // Actualizo el stock
        const updatedStock = productFound.stock - quantity;
        this.ProductsRepository.put(pid, { stock: updatedStock });
        return {
          status: 201,
          data: "El producto no existe en el carrito. Porducto agregado",
        };
      }

      productFoundInCart.quantity = productFoundInCart.quantity + quantity;
      await this.CartsRepository.save(cartFound);
      // Actualizo el stock
      const updatedStock = productFound.stock - quantity;
      this.ProductsRepository.put(pid, { stock: updatedStock });
      return {
        status: 201,
        data: `El producto existe en el carrito, se le suma la cantidad de ${quantity}`,
      };
    } catch (e) {
      console.log(e);
      return { status: 500, data: "Error inesperado en el sistema" };
    }
  }

  async putProductFromCart({ cid, pid, body }) {
    // Valido id de mongo
    const quantity = body.quantity;
    if (!isValid(cid) || !isValid(pid)) {
      return { status: 404, data: "ID invalido" };
    }
    // Valido mayor que 0
    if (quantity <= 0) {
      return { status: 404, data: "La cantidad debe ser mayor a cero" };
    }
    try {
      let cartFound = await this.CartsRepository.getByIdNotDto(cid);
      // Valido si existe el carrito
      if (!cartFound) {
        return {
          status: 404,
          data: "Carrito inexistente",
        };
      }
      const productFound = await this.ProductsRepository.getById(pid);
      // Valido si existe el producto
      if (!productFound) {
        return {
          status: 404,
          data: "Producto inexistente",
        };
      }
      let productFoundInCart = cartFound.products.find(
        (p) => p.product._id == pid
      );
      // Valido si existe el producto en el carrito
      if (!productFoundInCart) {
        return {
          status: 404,
          data: "El producto no existe en el carrito",
        };
      }
      // Valido stock disponible
      if (productFound.stock < quantity) {
        return {
          status: 404,
          data: "Stock insuficiente",
        };
      }
      // Calculo actualizacion del stock de los productos
      const updatedQuantity = productFoundInCart.quantity - quantity;
      const updatedStock = productFound.stock + updatedQuantity;

      // Actualizo quantity del producto en el carrito
      productFoundInCart.quantity = quantity;
      await this.CartsRepository.save(cartFound);

      // Actualizo stock de los productos
      this.ProductsRepository.put(pid, { stock: updatedStock });
      return {
        status: 201,
        data: `Cantidad del producto editada correctamente`,
      };
    } catch (e) {
      console.log(e);
      return { status: 500, data: "Error inesperado en el sistema" };
    }
  }

  async deleteProductFromCart({ cid, pid }) {
    if (!isValid(cid) || !isValid(pid)) {
      return { status: 404, data: "ID invalido" };
    }
    try {
      let cartFound = await this.CartsRepository.getByIdNotDto(cid);
      if (!cartFound) {
        return {
          status: 404,
          data: "Carrito inexistente",
        };
      }
      const productFound = await this.ProductsRepository.getById(pid);
      //console.log(productFound)
      if (!productFound) {
        return {
          status: 404,
          data: "Producto inexistente",
        };
      }
      const productFoundInCart = cartFound.products.find(
        (p) => p.product.id == pid
      );

      if (!productFoundInCart) {
        return {
          status: 404,
          data: "El producto no existe en el carrito",
        };
      }
      // Actualizo el stock de los productos
      const updatedStock = productFound.stock + productFoundInCart.quantity;
      this.ProductsRepository.put(pid, { stock: updatedStock });
      cartFound.products = cartFound.products.filter((p) => p.product.id !== pid);
      
      await this.CartsRepository.save(cartFound);

      return {
        status: 204,
        data: "El producto se elimino del carrito",
      };
    } catch (e) {
      console.log(e);
      return { status: 500, data: "Error inesperado en el sistema" };
    }
  }

  async getCartsBuy({ cid }) {
    if (!isValid(cid)) {
      return { status: 404, data: "ID invalido" };
    }
    try {
      const cartFound = await this.CartsRepository.getById(cid);
      if (!cartFound) {
        return {
          status: 404,
          data: "Carrito inexistente",
        };
      }
      let producsPrice = 0;
      let totalPrice = 0;
      let result = cartFound.products.reduce((accumulator, p) => {
        producsPrice = p.product.price * p.quantity;
        totalPrice = accumulator + producsPrice;
        return totalPrice;
      }, 0);
      return { status: 200, data: `Abonar por el total de la compra: $${result}` };
    } catch (e) {
      return { status: 500, data: "Error inesperado en el sistema" };
    }
  }

  async postCartsBuyConfirm({ cid }) {
    if (!isValid(cid)) {
      return { status: 404, data: "ID invalido" };
    }
    try {
      const cartFound = await this.CartsRepository.getById(cid);
      if (!cartFound) {
        return {
          status: 404,
          data: "Carrito inexistente",
        };
      }
      const email = cartFound.email
      cartFound.products = [];
      delete cartFound.email 
      const deleteCart = await this.put(cid,cartFound)
      if (deleteCart.status == 201 ) {
        sendMailBuyProductFn(email,cid)
        return { status: 204, data: `Compra realizada satifactoriamente` };
      }
      return deleteCart;
    } catch (e) {
      return { status: 500, data: "Error inesperado en el sistema" };
    }
  }

}

module.exports = CartsService;
