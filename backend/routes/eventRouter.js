const eventController = require("../controllers/eventController");
const BaseRouter = require("./BaseRouter");
const { checkAuthenticated } = require("../middleware/auth");

class eventRouter extends BaseRouter {
  constructor() {
    super();
    this.registerRoutes();
  }
  registerRoutes() {
    this.registerRoute("post", "/event", eventController.addEvent);
    this.registerRoute("get", "/events", eventController.getAllEvents);
    this.registerRoute("get", "/event/:id", eventController.getEvent);
    this.registerRoute("put", "/event/:id", eventController.updateEvent);
    this.registerRoute("delete", "/event/:id", eventController.deleteEvent);
  }
}

module.exports = new eventRouter().getRouter();