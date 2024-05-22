// Factory: seleccionamos que tipo de DAO vamos a usar segun la persisten elegida.

const CartsDAOMongo = require("../DAOs/cartsDAOMongo")
//CartsDAOSql = require("../DAOs/cartsDAOSql")

const persistenceMapper = {
    mongo: () => new CartsDAOMongo(),
    //sql: ()=> new CartsDAOSql(),
    default: ()=> new CartsDAOMongo(),
}

module.exports = (persistence)=>{
    //console.log(persistence)
    const persistenceFn = persistenceMapper[persistence] || persistenceMapper.default  // Si no se pasa ninguna persistencia usamos la default. Para pasarle un valor dinamico a un objeto lo hago entre [].
    const dao = persistenceFn();
    return dao
}