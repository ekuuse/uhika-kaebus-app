const userController = require("../controllers/userController");
const BaseRouter = require("./BaseRouter");
const { checkAuthenticated } = require("../middleware/auth");

class userRouter extends BaseRouter {
  constructor() {
    super();
    this.registerRoutes();
  }

  registerRoutes() {
    this.registerRoute("post", "/user/register", userController.Register);
    this.registerRoute("post", "/user/login", userController.Login);

    //
  }
}

module.exports = new userRouter().getRouter();