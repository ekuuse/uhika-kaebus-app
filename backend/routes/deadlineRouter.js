const deadlineController = require("../controllers/deadlineController");
const BaseRouter = require("./BaseRouter");
const { checkAuthenticated, checkAdmin } = require("../middleware/auth");

class deadlineRouter extends BaseRouter {
  constructor() {
    super();
    this.registerRoutes()
  }
  registerRoutes() {
    this.registerRoute("post", "/deadline", checkAuthenticated, checkAdmin, deadlineController.addDeadline);
    this.registerRoute("get", "/deadlines",checkAuthenticated, deadlineController.getAllDeadlines);
    this.registerRoute("get", "/deadline/:id",checkAuthenticated, deadlineController.getDeadline);
    this.registerRoute("put", "/deadline/:id", checkAuthenticated, checkAdmin, deadlineController.updateDeadline);
    this.registerRoute("delete", "/deadline/:id", checkAuthenticated, checkAdmin, deadlineController.deleteDeadline);
  }
}

module.exports = new deadlineRouter().getRouter();