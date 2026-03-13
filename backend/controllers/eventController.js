const { models } = require("../database");
const { Event } = models;
const BaseController = require("./BaseController");

class eventController extends BaseController {
  constructor() {
    super();
    this.addEvent = this.addEvent.bind(this);
    this.getEvent = this.getEvent.bind(this);
    this.updateEvent = this.updateEvent.bind(this);
    this.deleteEvent = this.deleteEvent.bind(this);
    this.getAllEvents = this.getAllEvents.bind(this);
  }

  async addEvent(req, res) {
    try {
      const { name, description, location, date, image } = req.body;

      const event = await Event.create({
        name,
        description,
        location,
        date,
        image,
      });

      return res.status(201).json({
        success: true,
        data: event,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to create event",
        error: error.message,
      });
    }
  }

  async getEvent(req, res) {
    try {
      const { id } = req.params;

      const event = await Event.findByPk(id);

      if (!event) {
        return res.status(404).json({
          success: false,
          message: "Event not found",
        });
      }

      return res.json({
        success: true,
        data: event,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to get event",
        error: error.message,
      });
    }
  }

  async getAllEvents(req, res) {
    try {
      const events = await Event.findAll({
        order: [["date", "ASC"]],
      });

      return res.json({
        success: true,
        data: events,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch events",
        error: error.message,
      });
    }
  }

  async updateEvent(req, res) {
    try {
      const { id } = req.params;
      const { name, description, location, date, image } = req.body;

      const event = await Event.findByPk(id);

      if (!event) {
        return res.status(404).json({
          success: false,
          message: "Event not found",
        });
      }

      await event.update({
        name,
        description,
        location,
        date,
        image,
      });

      return res.json({
        success: true,
        data: event,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to update event",
        error: error.message,
      });
    }
  }

  async deleteEvent(req, res) {
    try {
      const { id } = req.params;

      const event = await Event.findByPk(id);

      if (!event) {
        return res.status(404).json({
          success: false,
          message: "Event not found",
        });
      }

      await event.destroy();

      return res.json({
        success: true,
        message: "Event deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to delete event",
        error: error.message,
      });
    }
  }
}

module.exports = new eventController();