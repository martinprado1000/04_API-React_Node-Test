const passport = require("passport");
const passportJWT = require("passport-jwt");

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const cookieExtractor = (req) => {
  // Esta es la funcion donde obtenemos el token.
  const {token} = req.cookies
  return token
};

const jwtStrategy = // Esta es la funcion que chequea que el token sea el correcto.  
  passport.use("jwt",new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: "LlaveSecreta",
      },
      (jwtPayload, done) => {
        done(null, jwtPayload.user); // Si el tokes es correcto retorno los datos que trae el token
      }
    )
  );

module.exports = { jwtStrategy };
