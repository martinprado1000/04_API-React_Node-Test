// Repository: requerimos el factory para seleccionar el tipo de persistencia

const cartsFactory = require("../factories/cartsFactory");
const CartsDTO = require("../DTOs/cartsDTO");
const ProductsDTO = require("../DTOs/productsDTO");

class CartsRepository {
  constructor() {
    this.dao = cartsFactory(process.env.PERSISTENCE);
  }

  async get(limit) {
    const result = await this.dao.get(limit);
    if (result == null) {
      return result;
    }
    return result.map((cart) => new CartsDTO(cart));
  }

  async get2() {
    const result = await this.dao.get2();
      return result;
  }

  async getLean() {
    const result = await this.dao.getLean();
      return result;
  }

  async getById(id) {
    let result = await this.dao.getById(id);
    if (result == null) {
      return result;
    }
    return new CartsDTO(result);
  }

  async getByIdLean(id) {
    let result = await this.dao.getByIdLean(id);
    if (result == null) {
      return result;
    }
    return new CartsDTO(result);
  }
  async getByIdNotDto(id) {
    const result = await this.dao.getById(id);
    return result
  }

  async getByEmail(email) {
    const result = await this.dao.getByEmail(email);
    if (result == null) {
      return result;
    }
    return new CartsDTO(result);
    //return result
  }

  async post(body) {
    const result = await this.dao.post(body);
    if (result == null) {
      return result;
    }
    return new CartsDTO(result);
    //return result
  }

  async put(id, body) {
    const result = await this.dao.put(id, body);
    if (result == null) {
      return result;
    }
    return new CartsDTO(result);
    //return result
  }

  async delete(id) {
    const result = await this.dao.delete(id);
    return result;
  }

  async save(ob) {
    const result = await this.dao.save(ob);
    return result;
  }

}

module.exports = CartsRepository;
