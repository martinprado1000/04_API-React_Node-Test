const passport = require('passport')

// *** MIDDLEWARE DE AUTENTICACION ***
//Middleware para identificar porque fue rechazada la autorizacion de passport.
const passportCallMiddleware = (strategy) => {
    return (req, res, next) => {
      passport.authenticate(strategy, (err, user, info) => {  // Llamo a la estrategia pasada por parametro, jwt
        if (err) {
          return next(err);
        }
        if (!user) { // Token invalido o expirado
          return res.status(401).json({ error: "Token inválido o expirado", errorDetail: info.message ? info.message : info.toString() });
        }
        req.user = user; // Si el token fue correcto meto los datos obtenidos en el token en el req.user
        return next();
      })(req, res, next);
    };
  };

  module.exports = passportCallMiddleware;