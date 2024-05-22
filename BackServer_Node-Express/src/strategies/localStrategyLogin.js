const passport = require("passport");
const passportLocal = require("passport-local");
const usersModel = require("../models/usersModel");
const { hashPassword, isValidPassword } = require("../utils/passwordHash");

const LocalStrategy = passportLocal.Strategy;

const localStrategyLogin = 
passport.use("login", new LocalStrategy( 
    { usernameField: "email" }, 
    async (username, password, done) => {
      try {
        let user = await usersModel.findOne({email:username});
        if (user == null) {
          console.log(`Usuario es invalido`);
          return done(null,false,{message:`Datos incorrectos`})
        }
        //console.log(isValidPassword(data.password,user.password)) // Aca comparo la password que me pasaron con la password hasheada, esto me retorna true o false.
        if (!isValidPassword(password, user.password)) {
          // Chequeo si las password hacen match pero antes paso la password por nuestra funcion de hash para poder comprarlas.
          console.log(`Contraseña invalida`);
          return done(null,false,{message:`Contraseña invalida`})
        }
        console.log(`${user.email} a iniciado sesion`);
        user = user.toObject(); // Conbierto la respuesta de mongo a objeto para poder borrar el password y que no quede en el backend
        delete user.password; // Borro la contraseña para que no quede en el backend
        return done(null,user)
        } catch (e) {
        console.log("Error al leer la db");
        return done(e);
      }
    }
  )
);

module.exports = localStrategyLogin;