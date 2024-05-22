const express = require("express")
const cors = require("cors")
const { Command } = require ('commander')
const dotenv = require('dotenv')
const configEnvFn = require ("./config.env/configEnv")
const cookieParser = require("cookie-parser"); 
const passport = require('passport')
const initializePassport = require('./config.passport/passportConfig')
const path = require('path');

// Obtengo los argumentos, las variables de entorno y se lo paso al archivo config de mongo.
const program = new Command();
program.option("--mode <mode>", "Modo de trabajo", "dev"); // Por default ejecutamos en modo dev
program.parse(); // Finaliza la configuracion de argumentos
const options = program.opts(); // Obtengo los argumentos
dotenv.config({ // Le indico a dotenv el path donde se encuentra las variables de entorno
  path: `src/.env.${options.mode}` // path: indica donde se hace el init de la app
});
console.log(`Sistema ejecutado en modo: ${options.mode}`);

const config = configEnvFn(); //Obtenemos las variables de entorno

// Conexion a la base de datos
const DbMongoSingleton = require('./connections/singleton')
const dbConnectionSingleton = DbMongoSingleton.getConnection(config)

const app = express();

app.use(express.static(path.join(__dirname, 'build')));

app.use(express.json())
app.use(express(express.urlencoded({extended:true})))
app.use(cors({
  origin : config.url_front,
  credentials : true  // Es para permitie establecer las cookies en el front
}))
app.use(cookieParser()); // Middleware de cookie: conbierte las cookie en un objeto JSON.
initializePassport();
app.use(passport.initialize());

const usersRouter = require("./routers/usersRoutes")
const productsRouter = require("./routers/productsRoutes")
const cartsRouter = require("./routers/cartsRoutes")

app.use("/api",usersRouter)
app.use("/api",productsRouter)
app.use("/api",cartsRouter)

const PORT = config.portServer || 8080;
app.listen(PORT,()=>{
    console.log(`Server on port ${PORT}`);
})