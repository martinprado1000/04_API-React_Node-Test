const mongoose = require("mongoose");
const UsersRepository = require("../repositories/usersRepository");
const CartsRepository = require("../repositories/cartsRepository");
const { hashPassword, isValidPassword } = require("../utils/passwordHash");
const { generateToken, verifyToken } = require("../utils/jwt");
const { sendMailRecoveryPassword } = require("../utils/sendMailFn");

// Funcion para validar si los id son válidos para mongo
const isValid = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

class UsersService {
  constructor() {
    this.usersRepository = new UsersRepository();
    this.cartsRepository = new CartsRepository();
  }

  async get() {
    try {
      const result = await this.usersRepository.get();
      if (!result || result == "") {
        return { status: 404, data: "No existen usuarios" };
      }
      return { status: 200, data: result };
    } catch (e) {
      console.log(e);
      return { status: 500, data: "Error inesperado en el sistema" };
    }
  }

  async getPaginate(data) {
    try {
      // ?limit=2&page=2&query=fruta&sort=asc  // Esto podemos recibir en la consulta
      const limit = parseInt(data.limit) || 10;
      const page = parseInt(data.page) || 1;
      const rol = data.rol || "";
      let sort = data.sort == "asc" ? -1 : 1 || "";
      sort = { price: sort };
      //const sort = parseInt(data.sort) || " ";
      const options = { limit, page, rol, sort };
      //const users = await productModel.paginate(query,{ limit , page , sort:{price:sort} })
      let query = {}; // Define un objeto vacío para la consulta
      if (rol) {
        query.rol = rol; // Agrega la categoría a la consulta si se proporciona
      }
      console.log(options);
      const users = await this.usersRepository.getPaginate(query, options);
      if (!users || users == "") {
        return { status: 404, data: "No existen usuarios" };
      }
      const payload = users.docs;
      // paguinate me retorna un objeto que contiene toda la info de paguinacion y un array llamado docs que ahi se encuentran los datos solicitados.
      const usersPaginate = {
        status: "success",
        payload,
        totalPages: users.totalPages,
        prevPage: users.prevPage,
        nextPage: users.nextPage,
        page: users.page,
        hasPrevPage: users.hasPrevPage,
        hasNextPage: users.hasNextPage,
        prevLink:
          users.hasPrevPage == true
            ? `http://localhost:8080/users/?page=${users.prevPage}`
            : null,
        nextLink:
          users.hasNextPage == true
            ? `http://localhost:8080/users/?page=${users.nextPage}`
            : null,
      };
      return { status: 200, data: usersPaginate };
    } catch (e) {
      console.log(e);
      return { status: 500, data: "Error inesperado en el sistema" };
    }
  }

  async getById(id) {
    if (!isValid(id)) {
      return { status: 404, data: "ID de usuario inválido" };
    }
    try {
      if (!id) {
        return { status: 404, data: "Debe enviar un ID de usuario válido" };
      }
      const result = await this.usersRepository.getById(id);
      if (!result) {
        return { status: 404, data: "Usuario no encontrado" };
      }
      return { status: 200, data: result };
    } catch (e) {
      console.log(e);
      return { status: 500, data: "Error inesperado en el sistema" };
    }
  }

  async getByEmail(email) {
    try {
      const result = await this.usersRepository.getByEmail(email);
      if (!result) {
        return { status: 404, data: "Usuario no encontrado" };
      }
      return { status: 200, data: result };
    } catch (e) {
      console.log(e);
      return { status: 500, data: "Error inesperado en el sistema" };
    }
  }

  async getByEmailNotDto(email) {
    try {
      const result = await this.usersRepository.getByEmailNotDto(email);
      if (!result) {
        return { status: 404, data: "Usuario no encontrado" };
      }
      return { status: 200, data: result };
    } catch (e) {
      console.log(e);
      return { status: 500, data: "Error inesperado en el sistema" };
    }
  }

  async post(body) {
    const {
      email,
      name,
      username,
      lastname,
      age,
      password,
      passwordRepeat,
      rol,
    } = body; // Username no es obligatorio, se reemplaza con el correo
    try {
      let exist = await this.getByEmail(email);
      if (exist.status == 200) {
        return { status: 404, data: `El usuario ${email} ya existe` };
      }
      let passwordHashed = hashPassword(password); // Llamamos a la función para hashear la password
      const user = await this.usersRepository.post({
        ...body,
        password: passwordHashed,
      }); // Creo el usuario

      if (user) {
        await this.cartsRepository.post(email); // Creo el carrito default
        return { status: 201, data: "Usuario ingresado correctamente" };
      } else {
        return { status: 500, data: "Error al crear el usuario" };
      }
    } catch (e) {
      console.log(e);
      return { status: 500, data: "Error inesperado en el sistema" };
    }
  }

  async put(id, body) {
    // Valido si es un id válido de mongoo
    if (!isValid(id)) {
      return { status: 404, data: "ID de usuario inválido" };
    }
    if (body.email == "superadmin@superadmin.com") {
      return {
        status: 404,
        data: "No se puede editar este usuario, usuario Super Administrador",
      };
    }
    try {
      // Valido si existe el id
      if (!id) {
        return { status: 400, data: "Debe enviar un ID de usuario válido" };
      }
      const userFound = await this.usersRepository.getById(id);
      // Valido si existe el usuario
      if (!userFound) {
        return { status: 404, data: "Usuario no encontrado" };
      }
      // Valido si enviaron un email que no se modifique
      if (!body.email || userFound.email == body.email) {
        // Si enviaron password la hasheo
        if (body.password) {
          body.password = hashPassword(body.password);
        }
        const userEdit = await this.usersRepository.put(id, body);
        if (userEdit) {
          return { status: 201, data: "Usuario editado correctamente" };
        } else {
          return { status: 500, data: "Error al editar el usuario" };
        }
      } else {
        return {
          status: 404,
          data: "El email del usuario no se puede editar",
        };
      }
    } catch (e) {
      console.log(e);
      return { status: 500, data: "Error inesperado en el sistema" };
    }
  }

  async delete(id) {
    if (!isValid(id)) {
      return { status: 404, data: "ID de usuario inválido" };
    }
    if (!id) {
      return { status: 400, data: "Debe enviar un ID válido" };
    }
    try {
      const user = await this.getById(id);
      if (user.status != 200) {
        return { status: 404, data: "Usuario no encontrado" };
      }
      console.log(user)
      if (user.data.email == "superadmin@superadmin.com") {
        return {
          status: 404,
          data: "No se puede eliminar este usuario, usuario Super Administrador",
        };
      }
      const result = await this.usersRepository.delete(id); // Elimino el usuario
      if (result.deletedCount == 0) {
        return { status: 404, data: "Usuario no encontrado" };
      }

      const cart = await this.cartsRepository.getByEmail(user.data.email); // Obtengo el carrito del usuario
      await this.cartsRepository.delete(cart.id); // Elimino el carrito del usuario

      return { status: 201, data: "Usuario eliminado correctamente" };
    } catch (e) {
      console.log(e);
      return { status: 500, data: "Error inesperado en el sistema" };
    }
  }

  async register(body) {
    // Valido los campos en las rutas con un middleware
    const {
      email,
      rol,
      name,
      lastname,
      username,
      age,
      password,
      passwordRepeat,
    } = body;
    try {
      let exist = await this.getByEmail(email);
      if (exist.status == 200) {
        return {
          response: { status: 404, data: `El usuario ${email} ya existe` },
        };
      }

      // Hasheo la password
      let passwordHashed = hashPassword(password);

      const registered = await this.usersRepository.post({
        ...body,
        password: passwordHashed,
      });
      delete registered.password;

      // Genero el token
      const token = await generateToken({
        email,
        name,
        lastname,
        username,
        age,
        rol: registered.rol, // El rol lo obtengo del objeto porque no es una propiedad obligatoria entonces si no lo pasan es user por default.
      });
      await this.cartsRepository.post(email); // Creo el carrito default
      return {
        response: {
          status: 201,
          data: `Usuario registrado satisfactoriamente`,
        },
        token: token,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async login(body) {
    const { email, password } = body;
    try {
      let user = await this.getByEmail(email);
      const data = user.data;

      if (user.status !== 200) {
        return { response: user };
      }

      if (!isValidPassword(password, data.password)) {
        return {
          response: { status: 404, data: "Usuario o password incorrecto" },
        };
      }
      delete data.password; // Elimino la password para no retornarla

      // Genero el token
      const token = generateToken({
        email,
        name: data.name,
        lastname: data.lastname,
        username: data.username,
        age: data.age,
        rol: data.rol,
      });
      return {
        response: {
          status: 201,
          data: `Usuario logueado satisfactoriamente`,
          rol: data.rol,
        },
        token: token,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async resetPassword(id, body) {
    if (!isValid(id)) {
      return { status: 404, data: "ID de usuario inválido" };
    }
    body = { password: body.password, passwordRepeat: body.passwordRepeat };
    try {
      if (!id) {
        return { status: 400, data: "Debe enviar un ID de usuario válido" };
      }
      const userFound = await this.usersRepository.getById(id);
      if (!userFound) {
        return { status: 404, data: "Usuario no encontrado" };
      }

      body.password = hashPassword(body.password);

      const editedPassword = await this.usersRepository.put(id, body);
      if (editedPassword) {
        return { status: 201, data: "Contraseña editada correctamente" };
      } else {
        return { status: 500, data: "Error al editar la contraseña" };
      }
    } catch (e) {
      console.log(e);
      return { status: 500, data: "Error inesperado en el sistema" };
    }
  }

  async recoveryPassword(body) {
    try {
      const userFound = await this.usersRepository.getByEmail(body.email);
      if (!userFound) {
        return { status: 404, data: "Email no encontrado" };
      }

      const randomNumber = Math.floor(100000 + Math.random() * 900000);

      const randomNumberHased = hashPassword(randomNumber.toString());

      const editedPassword = await this.usersRepository.put(userFound.id, {
        password: randomNumberHased,
      });
      if (editedPassword) {
        await sendMailRecoveryPassword(userFound.email, randomNumber);
        return {
          status: 201,
          data: `Se envió la nueva contraseña al correo: ${body.email}`,
        };
      } else {
        return { status: 500, data: "Error al recuperar la contraseña" };
      }
    } catch (e) {
      console.log(e);
      return { status: 500, data: "Error inesperado en el sistema" };
    }
  }

  async profile(req) {
    try {
      let user = req.user; // Al trabajar sin sessiones el req.user son los datos obtenidos del token con jwt.
      const cartUser = await this.cartsRepository.getByEmail(user.email) // Obtengo el carrito del usuario
      if (!cartUser) {
        throw new Error("No se pudo obtener el carrito")
      }
      user.cart = cartUser.id // Le agrego el id del carrito al usuario
      return { status: 200, data: user };
    } catch (error) {
      console.log({ status: 500, data: "Error inesperado en el sistema", errorDetail:error });
      return { status: 500, data: "Error inesperado en el sistema", errorDetail:error };
    }
  }

  static deleteInactiveUsers = async () => {
    try {
      const usersService = new UsersService();
      const users = await usersService.get();

      const fechaActual = new Date();
      const fecha2DiasAntes = new Date();
      const deletedUsers = users.data.map(async (user) => {
        // Evito eliminar usuarios superAdmin, admin o premium
        if (
          user.rol == "superAdmin" ||
          user.rol == "admin" ||
          user.rol == "userPremium"
        )
          return;
        const updatedAt = user.updatedAt;
        // Resta 2 días a la fecha actual
        fecha2DiasAntes.setDate(fechaActual.getDate() - 2);
        //fecha2DiasAntes.setMinutes(fechaActual.getMinutes() - 1); // Ejecuta cada 1 Minutos
        //Compara si la fecha updatedAt está dentro de los últimos 2 días
        if (updatedAt >= fecha2DiasAntes && updatedAt <= fechaActual) {
          //console.log(`Usuario: ${user.name}, NO superar los 2 días de inactividad`);
          return;
        } else {
          const deletedUser = await usersService.delete(user._id);
          console.log(
            `Usuario ${user.name} eliminado por superar los 2 días de inactividad. id: ${user._id}`
          );
          return;
        }
      });
    } catch (error) {
      console.log(error);
      return { status: 500, data: "Error inesperado en el sistema", errorDetail:error };
    }
  };
}

module.exports = UsersService;
