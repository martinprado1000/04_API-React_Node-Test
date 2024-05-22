const { Router } = require("express");
const { userPostRegisterValidator } = require("../validators/userPostRegisterValidator")
const { userLoginValidator } = require("../validators/userLoginValidator")
const { userPutValidator } = require("../validators/userPutValidator");
const { userRecoveryPasswordValidator } = require("../validators/userRecoveryPasswordValidator");
const passportCallMiddleware = require("../middleware/passportCallMiddleware")
const authorizationMiddleware = require("../middleware/authorizationMiddleware")

const UsersController = require("../controllers/usersController");

const usersRouter = new Router();

const usersController = new UsersController();

// Usuarios con rol: user y admin NO pueden agregar, editar ni eliminar usuarios
usersRouter.get("/users", usersController.get.bind(usersController));
usersRouter.get("/usersPaginate",usersController.getPaginate.bind(usersController));
usersRouter.get("/users/:uid", usersController.getById.bind(usersController));
usersRouter.post("/users", passportCallMiddleware('jwt', { session: false}), authorizationMiddleware('routeSuperAdminProtected'), userPostRegisterValidator, usersController.post.bind(usersController));
usersRouter.put("/users/:uid", passportCallMiddleware('jwt', { session: false}), authorizationMiddleware('routeSuperAdminProtected'), userPutValidator, usersController.put.bind(usersController));
usersRouter.delete("/users/:uid", passportCallMiddleware('jwt', { session: false}), authorizationMiddleware('routeSuperAdminProtected'), usersController.delete.bind(usersController));

usersRouter.post("/login", userLoginValidator , usersController.login.bind(usersController));
usersRouter.get("/logOut", usersController.logOut.bind(usersController));
usersRouter.post("/register", userPostRegisterValidator, usersController.register.bind(usersController));
usersRouter.put("/resetPassword/:uid", userPutValidator, usersController.resetPassword.bind(usersController));
usersRouter.put("/recoveryPassword", userRecoveryPasswordValidator, usersController.recoveryPassword.bind(usersController));
usersRouter.delete("/deleteInactiveUsers/:uid", usersController.deleteInactiveUsers.bind(usersController));
usersRouter.get("/profile", passportCallMiddleware('jwt', { session: false}), usersController.profile.bind(usersController)); // no trabaja con sessiones, la session la maneja el front

// Usuarios superAdmin pueden entrar a todas las rutas, Usuarios admin
usersRouter.get("/adminRoute", passportCallMiddleware('jwt', { session: false}), authorizationMiddleware('routeAdminProtected'), usersController.adminRoute.bind(usersController));
usersRouter.get("/superAdminRoute", passportCallMiddleware('jwt', { session: false}), authorizationMiddleware('routeSuperAdminProtected'), usersController.superAdminRoute.bind(usersController));

module.exports = usersRouter;
