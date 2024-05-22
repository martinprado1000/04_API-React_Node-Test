const passport = require("passport");
const passportLocal = require("passport-local");
const usersModel = require("../models/usersModel");
const { hashPassword, isValidPassword } = require("../utils/passwordHash");

const LocalStrategy = passportLocal.Strategy;

const localStrategyRegister = 
passport.use( // El primer parametro es un string, seria el nombre del passport. Y el segundo es una instacia
"register", // Nombre del passport
new LocalStrategy( // Instanciamos el passport, el primer parametro es un objeto y el segundo es una fincion
  { passReqToCallback: true, usernameField: "email" }, // Si no le indicamos el email toma por default el nombre si tiene.
  async (req, username, password, done) => {
    // El username siermpre hace referencia al email porque lo definimos en la linea de arriba.
    try {
      const exist = await usersModel.findOne({ email: username }); // Aca le decimos que el email tiene que ser igual a username porque en la linea anterior le indicamos que como nombre usamos el email

      if (exist == null) {
        const body = req.body;
        body.password = hashPassword(body.password); // Llamamos a nustra funcion para hashear la password
        let user = await usersModel.create(body);
        console.log(user);
        console.log(`Usuario ${username} creado correctamente`);
        return done(null, user);
      }

      console.log(`El usuario ${username} ya existe`);
      return done(null, false, {message:`El usuario ${username} ya existe`});
    } catch (e) {
      console.log("Error al leer la db");
      return done(e);
    }
  }
)
);

module.exports = localStrategyRegister;