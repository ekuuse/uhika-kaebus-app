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
    this.registerRoute("get", "/user/session", checkAuthenticated, userController.getSession);
    this.registerRoute("post", "/user/google-login", userController.GoogleLogin);
    this.registerRoute("get", "/admin/users", checkAuthenticated, checkAdmin, userController.getAllUsers);
    this.registerRoute("post", "/admin/user", checkAuthenticated, checkAdmin, userController.adminCreateUser);
    this.registerRoute("delete", "/admin/users/:id", checkAuthenticated, checkAdmin, userController.deleteUser);
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