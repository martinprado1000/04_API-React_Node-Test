const mongoose = require("mongoose");

let CONNECTION_MONGO;

class MongoSingleton {
  static instance;

  constructor(settings) {
    switch (settings.persistence) {
      case "MONGO_ATLAS_PROD":
      case "MONGO_ATLAS_DEV":
        CONNECTION_MONGO = `mongodb+srv://${settings.db_user}:${settings.db_password}@${settings.db_host}/${settings.db_name}?retryWrites=true&w=majority`;
        break;
      case "MONGO_LOCAL":
        CONNECTION_MONGO = `mongodb://${settings.db_host}/${settings.db_name}`;
        break;
    }
    mongoose.connect(CONNECTION_MONGO, {
      // Le indico a mongoose se conecte a la siguiente direccion:  a la variable uri en este caso.
      useNewUrlParser: true, // Estas 2 lineas son configuraciones de conexion.
      useUnifiedTopology: true,
    });
  }

  static urlConnection() {
    return CONNECTION_MONGO;
  }

  static getConnection(settings) {
    if (this.instance) {
      console.log(
        `Ya existe una conexión a la base de datos ${settings.persistence} con persistencia en ${settings.persistence}`
      );
      return this.instance;
    }

    this.instance = new MongoSingleton(settings);
    const db = mongoose.connection; // Guardamos la escucha de eventos en una variable

    db.once("open", (_) => {
      console.log(
        `Sistema conectado a la base de datos ${settings.db_name} con persistencia en ${settings.persistence}`
      ); // Cuando se establece la coneccion ejecuto esto
    });

    // on: este evento se ejecucha siempre que eschucha el evento
    db.on("error", (err) => {
      // Escuchamos el evento error y recibimos lo que retorna este evento en err
      console.log(
        `Error al conectar con la base ${settings.db_name} con persistencia en ${settings.persistence}. La aplicación sera finalizada.`
      ); // Cuando se establece la coneccion ejecuto esto
      process.exit(); // Termina la aplicacion.
    });

    return this.instance;
  }
}

module.exports = MongoSingleton;
