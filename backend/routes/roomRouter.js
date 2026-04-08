const roomController = require("../controllers/roomController");
const BaseRouter = require("./BaseRouter");
const { checkAuthenticated, checkAdmin } = require("../middleware/auth");

class roomRouter extends BaseRouter {
  constructor() {
    super();
    this.registerRoutes();
  }

  registerRoutes() {
    this.registerRoute("post", "/room", checkAuthenticated, checkAdmin, roomController.addRoom);
    this.registerRoute("get", "/rooms", checkAuthenticated, roomController.getAllRooms);
    this.registerRoute("get", "/rooms/:room_nr/:room_letter", checkAuthenticated, roomController.getRoom);
    this.registerRoute("put", "/rooms/:room_nr/:room_letter", checkAuthenticated, checkAdmin, roomController.updateRoom);
    this.registerRoute("delete", "/rooms/:room_nr/:room_letter", checkAuthenticated, checkAdmin, roomController.deleteRoom);

  }
}

module.exports = new roomRouter().getRouter();