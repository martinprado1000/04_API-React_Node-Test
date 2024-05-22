const CartsService = require("../services/cartsService");

class CartsController {
  constructor() {
    this.cartsService = new CartsService();
  }

  // Edicion de carritos ----------------------------------------
  async get(req,res) {
      const limit = parseInt(req.query.limit);
      const result = await this.cartsService.get(limit);
      res.json(result);
  }

  async getById(req,res) {
    const cid = req.params.cid;
    const result = await this.cartsService.getById(cid);
    res.json(result);
  }

  async post(req,res) {
    const body = req.body;
    const result = await this.cartsService.post(body);
    res.json(result);
  }

  async put(req,res) {
    const cid = req.params.cid;
    const body = req.body;
    const result = await this.cartsService.put(cid,body);
    res.json(result);
  }

  async delete(req, res) {
    const cid = req.params.cid;
    const result = await this.cartsService.delete(cid);
    res.json(result);
  }

  // Edicion de productos en un carrito ----------------------------------------
  async getProductFromCart(req,res) {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const result = await this.cartsService.getProductFromCart({ cid, pid });
    res.json(result);
  }

  async postProductFromCart(req,res) {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const body = req.body;
    const result = await this.cartsService.postProductFromCart({cid,pid,body});
    res.json(result);
  }

  async putProductFromCart(req,res) {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const body = req.body;
    const result = await this.cartsService.putProductFromCart({cid,pid,body});
    res.json(result);
  }

  async deleteProductFromCart(req,res) {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const result = await this.cartsService.deleteProductFromCart({ cid, pid });
    res.json(result);
  }

  async getCartsBuy(req,res) {
    const cid = req.params.cid;
    const result = await this.cartsService.getCartsBuy({ cid });
    res.json(result);
  }

  async postCartsBuyConfirm(req,res) {
    const cid = req.params.cid;
    const result = await this.cartsService.postCartsBuyConfirm({ cid });
    res.json(result);
  }
  
}

module.exports = CartsController;
