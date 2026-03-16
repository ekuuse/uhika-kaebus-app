const { models } = require("../database");
const { Deadline } = models;
const BaseController = require("./BaseController");

class deadlineController extends BaseController {
  constructor() {
    super();
    this.addDeadline = this.addDeadline.bind(this);
    this.getDeadline = this.getDeadline.bind(this);
    this.updateDeadline = this.updateDeadline.bind(this);
    this.deleteDeadline = this.deleteDeadline.bind(this);
    this.getAllDeadlines = this.getAllDeadlines.bind(this);
  }

  async addDeadline(req, res) {
    try {
      const { name, description, date, type } = req.body;
      const user_id = req.user.id;

      const deadline = await Deadline.create({
        name,
        description,
        date,
        type,
        user_id,
      });

      return res.status(201).json({
        success: true,
        data: deadline,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to create deadline",
        error: error.message,
      });
    }
  }

  async getDeadline(req, res) {
    try {
      const { id } = req.params;

      const deadline = await Deadline.findByPk(id);

      if (!deadline) {
        return res.status(404).json({
          success: false,
          message: "Deadline not found",
        });
      }

      return res.json({
        success: true,
        data: deadline,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to get deadline",
        error: error.message,
      });
    }
  }

  async getAllDeadlines(req, res) {
    try {
      const deadlines = await Deadline.findAll({
        order: [["date", "ASC"]],
      });

      return res.json({
        success: true,
        data: deadlines,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch deadlines",
        error: error.message,
      });
    }
  }

  async updateDeadline(req, res) {
    try {
      const { id } = req.params;
      const { name, description, date, type } = req.body;

      const deadline = await Deadline.findByPk(id);

      if (!deadline) {
        return res.status(404).json({
          success: false,
          message: "Deadline not found",
        });
      }

      await deadline.update({
        name,
        description,
        date,
        type,
      });

      return res.json({
        success: true,
        data: deadline,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to update deadline",
        error: error.message,
      });
    }
  }

  async deleteDeadline(req, res) {
    try {
      const { id } = req.params;

      const deadline = await Deadline.findByPk(id);

      if (!deadline) {
        return res.status(404).json({
          success: false,
          message: "Deadline not found",
        });
      }

      await deadline.destroy();

      return res.json({
        success: true,
        message: "Deadline deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to delete deadline",
        error: error.message,
      });
    }
  }
}

module.exports = new deadlineController();