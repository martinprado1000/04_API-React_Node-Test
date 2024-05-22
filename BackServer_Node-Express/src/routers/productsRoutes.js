const {Router} = require("express")

const { productValidator } = require("../validators/productValidator");
const passportCallMiddleware = require("../middleware/passportCallMiddleware")
const authorizationMiddleware = require("../middleware/authorizationMiddleware")

const ProductsController = require("../controllers/productsController");

const productsRouter = new Router()

const productsController = new ProductsController();

productsRouter.get("/products", productsController.get.bind(productsController))
productsRouter.get("/connectionRDP", productsController.connectionRDP.bind(productsController))
productsRouter.get("/connectionWinbox", productsController.connectionWinbox.bind(productsController))
productsRouter.get("/connectionBrowser", productsController.connectionBrowser.bind(productsController))
// productsRouter.get("/connectionBrowser2", productsController.connectionBrowser2.bind(productsController))
productsRouter.get("/connectionPutty", productsController.connectionPutty.bind(productsController))
productsRouter.get("/connectionPutty2", productsController.connectionPutty2.bind(productsController))


module.exports = productsRouter

