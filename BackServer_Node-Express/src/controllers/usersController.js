const UsersService = require("../services/usersService");

class ServicesController {
  constructor() {
    this.usersService = new UsersService();
  }

  async get(req, res) {
    const result = await this.usersService.get();
    res.json(result);
  }

  async getPaginate(req, res) {
    const query = req.query;
    const result = await this.usersService.getPaginate(query);
    res.json(result);
  }

  async getById(req, res) {
    const id = req.params.uid;
    const result = await this.usersService.getById(id);
    res.json(result);
  }

  async post(req, res) {
    const body = req.body;
    const result = await this.usersService.post(body);
    res.json(result);
  }

  async put(req, res) {
    const id = req.params.uid;
    const body = req.body;
    const result = await this.usersService.put(id, body);
    res.json(result);
  }

  async delete(req, res) {
    const id = req.params.uid;
    const result = await this.usersService.delete(id);
    res.json(result);
  }

  // async login(req, res) {
  //   const body = req.body;
  //   const result = await this.usersService.login(body);
  //   if (result.token) {
  //     res.cookie("token", result.token).json(result.response);
  //   } else {
  //     res.json(result.response);
  //   }
  // }

  async login(req, res) {
    const body = req.body;
    const result = await this.usersService.login(body);
    if (result.token) {
      res.cookie("token", result.token, {
          httpOnly: process.env.NODE_ENV !== "development",
          sameSite: "none",   // Este parametro indica que la cookie no esta en el mismo dominio
          secure: true        // Opcion unida a sameSite: "none",
        }).json(result.response);
    } else {
      res.json(result.response);
    }
  }

  // async logOut(req, res) {
  //   console.log("Cookie eliminada")
  //   res.cookie( "token", "" , { expires:new Date(0)} )
  //   res.sendStatus(200);
  // }

  async logOut(req, res) {
    console.log("Cookie eliminada");
    res.cookie("token", "", { expires: new Date(0) });
    res.status(200).json({ data: `Cookie eliminada` });
  }

  async register(req, res) {
    const body = req.body;
    const result = await this.usersService.register(body);
    if (result.token) {
      res.cookie("token", result.token, 
      {
        //maxAge: 10000,
        //expires: new Date("2024-02-15"),
          //httpOnly: process.env.NODE_ENV !== "development", // Desdo donde va a poder ser accedida la cookie
          sameSite: "none",   // Este parametro indica que la cookie no esta en el mismo dominio, si pongo strict es para que solo sea accedido desde el mismo dominio.
          secure: true,       // Solo permite acceder a las cookie desde paginas https
        }
        )
        .json(result.response);
    } else {
      res.json(result.response);
    }
  }

  async resetPassword(req, res) {
    const id = req.params.uid;
    const body = req.body;
    const result = await this.usersService.resetPassword(id, body);
    res.json(result);
  }

  async recoveryPassword(req, res) {
    const body = req.body;
    const result = await this.usersService.recoveryPassword(body);
    res.json(result);
  }

  async deleteInactiveUsers(req, res) {
    const id = req.params.uid;
    const result = await this.usersService.deleteInactiveUsers(id);
    res.json(result);
  }

  async profile(req, res) {
    const body = req.body;
    const result = await this.usersService.profile(req);
    res.json(result);
  }

  async adminRoute(req, res) {
    const body = req.body;
    const result = await this.usersService.profile(req);
    res.json(result);
  }

  async superAdminRoute(req, res) {
    const body = req.body;
    const result = await this.usersService.profile(req);
    res.json(result);
  }

}

module.exports = ServicesController;
