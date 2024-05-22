// Factory: seleccionamos que tipo de DAO vamos a usar segun la persisten elegida.

const UsersDAOMongo = require("../DAOs/usersDAOMongo")
//const UsersDAOSql = require("../DAOs/usersDAOSql")

const persistenceMapper = {
    mongo: () => new UsersDAOMongo(),
    //sql: ()=> new UsersDAOSql(),
    default: ()=> new UsersDAOMongo(),
}

module.exports = (persistence)=>{
    //console.log(persistence)
    const persistenceFn = persistenceMapper[persistence] || persistenceMapper.default  // Si no se pasa ninguna persistencia usamos la default. Para pasarle un valor dinamico a un objeto lo hago entre [].
    const dao = persistenceFn();
    return dao
}