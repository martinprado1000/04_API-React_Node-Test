const cartsModel = require("../models/cartsModel");

class CartsDAOMongo {
  constructor() {
    this.cartsModel = cartsModel;
  }

  async get(limit) {
    try {
      return await this.cartsModel.find().limit(limit).populate("products.product");
    } catch (e) {
      console.log(e)
      throw new Error("Error inesperado al realizar la consulta get");
    }
  }

  async get2() {
    try {
      return await this.cartsModel.find();
    } catch (e) {
      console.log(e)
      throw new Error("Error inesperado al realizar la consulta get");
    }
  }

  async getLean() {
    try {
      return await this.cartsModel.find().populate("products.product").lean();
    } catch (e) {
      console.log(e)
      throw new Error("Error inesperado al realizar la consulta get");
    }
  }

  async getById(id) {
    try {
      const result = await this.cartsModel.findById(id).populate("products.product");
      return result
    } catch (e) {
      console.log(e)
      throw new Error("Error inesperado al realizar la consulta getById");
    }
  }

  async getByIdLean(id) {
    try {
      const result = await this.cartsModel.findById(id).populate("products.product").lean();
      // lean(); retorna todo el objeto y los subobjetos en objetos nativos de js
      return result
    } catch (e) {
      console.log(e)
      throw new Error("Error inesperado al realizar la consulta getById");
    }
  }

  async getByEmail(email) {
    try {
      return await this.cartsModel.findOne({email:email});
    } catch (e) {
      throw new Error("Error inesperado al realizar la consulta getById");
    }
  }

  async post(body) {
    try {
      return await this.cartsModel.create({email:body});
    } catch (e) {
      throw new Error("Error inesperado al realizar la consulta post");
    }
  }

  async put(id, body) {
    try {
      return await this.cartsModel.findByIdAndUpdate( id, { $set: body });
    } catch (e) {
      throw new Error("Error inesperado al realizar la consulta");
    }
  }

  async delete(id) {
    try {
      const result = await this.cartsModel.deleteOne({ _id:id });
      return result
    } catch (e) {
      throw new Error("Error inesperado al realizar la consulta");
    }
  }

  async save(ob) {
    try {
      return await ob.save();
    } catch (e) {
      console.log(e)
      throw new Error("Error inesperado al salvar la consulta");
    }
  }
}

module.exports = CartsDAOMongo;
