const eventController = require("../controllers/eventController");
const BaseRouter = require("./BaseRouter");
const { checkAuthenticated, checkAdmin } = require("../middleware/auth");

class eventRouter extends BaseRouter {
  constructor() {
    super();
    this.registerRoutes();
  }
  registerRoutes() {
    this.registerRoute("post", "/event", checkAuthenticated, checkAdmin, eventController.addEvent);
    this.registerRoute("get", "/events",checkAuthenticated, eventController.getAllEvents);
    this.registerRoute("get", "/event/:id",checkAuthenticated, eventController.getEvent);
    this.registerRoute("put", "/event/:id", checkAuthenticated, checkAdmin, eventController.updateEvent);
    this.registerRoute("delete", "/event/:id", checkAuthenticated, checkAdmin, eventController.deleteEvent);
  }
}

module.exports = new eventRouter().getRouter();