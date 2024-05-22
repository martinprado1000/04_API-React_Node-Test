const passport = require("passport");
const UsersService = require("../services/usersService")

// requiero mis estrategias de login y registro.
const jwtStrategy = require("../strategies/jwtStrategy")
const localStrategyRegister = require("../strategies/localStrategyRegister")
const localStrategyLogin = require("../strategies/localStrategyLogin")
const githubStrategy = require("../strategies/githubStrategy")

this.usersService = new UsersService

const initializePassport = () => { 

  jwtStrategy
  localStrategyRegister
  localStrategyLogin
  githubStrategy

  passport.serializeUser((user, done) => {
    done(null, user.id );
  });

  passport.deserializeUser(async (id, done) => {
    const user = await this.usersService.getById(id);
    done(null, user.data); // Le paso user.data porque al llamar al service me retorna un objeto con { status y data } 
  });

};

module.exports = initializePassport;
