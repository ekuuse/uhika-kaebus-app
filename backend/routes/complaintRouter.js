const complaintController = require("../controllers/ComplaintController");
const BaseRouter = require("./BaseRouter");
const { checkAuthenticated } = require("../middleware/auth");

class ComplaintRouter extends BaseRouter {
  constructor() {
    super();
    this.registerRoutes();
  }

  registerRoutes() {
    this.registerRoute("get",  "/complaints",     checkAuthenticated, complaintController.getAllComplaints);
    this.registerRoute("post", "/complaint",      checkAuthenticated, complaintController.createComplaint);
    this.registerRoute("put",  "/complaint/:id",  checkAuthenticated, complaintController.updateComplaint);
    this.registerRoute("get", "/complaint/:id",   checkAuthenticated, complaintController.getComplaint);

  }
}

module.exports = new ComplaintRouter().getRouter();