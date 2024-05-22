// Repository: requerimos el factory para seleccionar el tipo de persistencia

const productsFactory = require("../factories/productsFactory");
const ProductsDTO = require("../DTOs/productsDTO");

class ProductsRepository {
  constructor() {
    this.dao = productsFactory(process.env.PERSISTENCE);
    //console.log(this.dao);
  }

  async get() {
    const result = await this.dao.get();
    if (result == null) {
      return result;
    }
    return result.map((product) => new ProductsDTO(product));
  }

  async getPaginate(query,options) {
    const result = await this.dao.getPaginate(query,options);
    if (result == null) {
      return result;
    }
    const payload = await result.docs.map((p)=>p.toObject());
    result.docs = payload
    result.docs = result.docs.map((product) => new ProductsDTO(product));
    return result
  }

  async getById(id) {
    const result = await this.dao.getById(id);
    if (result == null) {
      return result;
    }
    return new ProductsDTO(result);
  }

  async post(body) {
    const result = await this.dao.post(body);
    if (result == null) {
      return result;
    }
    return new ProductsDTO(result);
  }

  async put(id, body) {
    const result = await this.dao.put(id, body);
    if (result == null) {
      return result;
    }
    return new ProductsDTO(result);
  }

  async delete(id) {
    const result = await this.dao.delete(id);
    //console.log(result)
    return result;
  }
}

module.exports = ProductsRepository;
