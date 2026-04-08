const roomController = require("../controllers/roomController");
const BaseRouter = require("./BaseRouter");
const { checkAuthenticated, checkAdmin } = require("../middleware/auth");

class roomRouter extends BaseRouter {
  constructor() {
    super();
    this.registerRoutes();
  }

  registerRoutes() {
    this.registerRoute("post", "/rooms/register", userController.Register);
    this.registerRoute("get", "/rooms/:room_nr/:room_letter", userController.getRoom);

  }
}

module.exports = new roomRouter().getRouter();