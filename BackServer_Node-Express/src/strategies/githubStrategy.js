const passport = require("passport");
const passportLocal = require("passport-local");
const usersModel = require("../models/usersModel");
const GitHubStrategy = require("passport-github2")

const githubStrategy = 
passport.use("github", new GitHubStrategy( 
    { 
      clientID:"Iv1.60312c44dbb83c65",
      clientSecret:"103d6a1e8d8691c19f60cd265dbd13625bf19e86",
      callbackURL:"http://localhost:8080/api/loginGithub-callback"
    }, 
    async (accessToken, refreshToken, profile, done) => { //accessToken: se usa para leer datos de la aplicacion de git, refreshToken: es para actualizar el token despues del tiempo de vida, profile: viene la informacion de github.
      try {
        console.log(profile) // Aca viene la info que nos trae github
        let user = await usersModel.findOne({username:profile.username}) // hago el registro con username porq github no me retorna el email
        console.log(user)
        if(user){
          console.log(`El usuario ${profile.username} ya existe`)
          return done(null,user)
        }

        console.log(`El usuario ${profile.username} no existe`)
        newUser = {
          username : profile.username,
          name : profile._json.name
        }
        await usersModel.create(newUser)
        return done(null,newUser)
        } catch (e) {
        console.log("Error al leer la db");
        return done(e);
      }
    }
  )
);

module.exports = githubStrategy;
