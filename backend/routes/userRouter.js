const userController = require("../controllers/UserController");
const BaseRouter = require("./BaseRouter");
const { checkAuthenticated, checkAdmin } = require("../middleware/auth");

class userRouter extends BaseRouter {
  constructor() {
    super();
    this.registerRoutes();
  }

  registerRoutes() {
    this.registerRoute("post", "/user/register", userController.Register);
    this.registerRoute("post", "/user/login", userController.Login);
    this.registerRoute(
      "patch",
      "/admin/users/:id/role",
      checkAuthenticated,
      checkAdmin,
      userController.UpdateRole,
    );
  }
}

module.exports = new userRouter().getRouter();