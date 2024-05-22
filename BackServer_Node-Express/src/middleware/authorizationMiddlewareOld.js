  // *** MIDDLEWARE DE AUTORIZACION ***
  const authorizationMiddleware = (rol) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          error: "Debes iniciar sesión",
        });
      }
      if (req.user.rol !== rol) {
        return res.status(403).json({
          error: "No tienes permiso para consumir este recurso",
        });
      }
      return next();
    };
  };

  module.exports = authorizationMiddleware;