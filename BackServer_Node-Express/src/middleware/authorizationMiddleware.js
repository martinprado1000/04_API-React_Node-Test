// *** MIDDLEWARE DE AUTORIZACION ***
const authorizationMiddleware2 = (route) => {
  return (req, res, next) => {
    const rol = req.user.rol;

    if (!req.user) {
      return res.status(401).json({
        error: "Debes iniciar sesión",
      });
    }

    switch (route) {
      case "routeSuperAdminProtected":
        if (rol == "superAdmin") {
          return next();
        }
        break;
      case "routeAdminProtected":
        if (rol == "admin" || rol == "superAdmin") {
          return next();
        }
        break;
    }

    return res.status(403).json({
      error: "No tienes permiso para consumir este recurso",
    });
  };
};

module.exports = authorizationMiddleware2;
