const {Router} = require("express")

const CartsRouter = require("../controllers/cartsController")
const passportCallMiddleware = require("../middleware/passportCallMiddleware")

const cartRouter = new Router()

const cartsController = new CartsRouter();

// Rutas consultas del carrito
cartRouter.get("/carts", passportCallMiddleware('jwt', { session: false}), cartsController.get.bind(cartsController))
cartRouter.get("/carts/:cid", passportCallMiddleware('jwt', { session: false}), cartsController.getById.bind(cartsController))
cartRouter.post("/carts", passportCallMiddleware('jwt', { session: false}), cartsController.post.bind(cartsController))
cartRouter.put("/carts/:cid", passportCallMiddleware('jwt', { session: false}), cartsController.put.bind(cartsController))
cartRouter.delete("/carts/:cid", passportCallMiddleware('jwt', { session: false}), cartsController.delete.bind(cartsController))

// Rutas consultas de productos en un carrito
cartRouter.get("/carts/:cid/product/:pid", passportCallMiddleware('jwt', { session: false}), cartsController.getProductFromCart.bind(cartsController))
cartRouter.post("/carts/:cid/product/:pid", passportCallMiddleware('jwt', { session: false}), cartsController.postProductFromCart.bind(cartsController))
cartRouter.put("/carts/:cid/product/:pid", passportCallMiddleware('jwt', { session: false}), cartsController.putProductFromCart.bind(cartsController))
cartRouter.delete("/carts/:cid/product/:pid", passportCallMiddleware('jwt', { session: false}),cartsController.deleteProductFromCart.bind(cartsController))
cartRouter.get("/cartsBuy/:cid", passportCallMiddleware('jwt', { session: false}),cartsController.getCartsBuy.bind(cartsController))
cartRouter.post("/cartsBuyConfirm/:cid", passportCallMiddleware('jwt', { session: false}), cartsController.postCartsBuyConfirm.bind(cartsController))

module.exports = cartRouter

