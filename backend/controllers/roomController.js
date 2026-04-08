const { models } = require("../database");
const { Room } = models;
const BaseController = require("./BaseController");

class deadlineController extends BaseController {
  constructor() {
    super();
    this.addRoom = this.addRoom.bind(this);
    
  }

  async addRoom(req, res) {
    try {
      const { room_nr, room_letter, floor } = req.body;

      const room = await Room.create({
        room_nr,
        room_letter,
        floor
      });

      return res.status(201).json({
        success: true,
        data: room,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to create a room",
        error: error.message,
      });
    }
  }

  async getRoom(req, res) {
    try {
      const { room_nr, room_letter } = req.params;

      const room = await Room.findOne({
      where: {
        room_nr: room_nr,
        room_letter: room_letter
      }
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

      return res.json({
        success: true,
        data: room,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to get the room",
        error: error.message,
      });
    }
  }

  async getAllRooms(req, res) {
  try {
    const rooms = await Room.findAll({
      order: [
        ["room_nr", "ASC"],
        ["room_letter", "ASC"]
      ],
    });

    const grouped = {};
    rooms.forEach(room => {
      if (!grouped[room.room_nr]) {
        grouped[room.room_nr] = { A: null, B: null, C: null };
      }
      grouped[room.room_nr][room.room_letter] = room;
    });

    return res.json({
      success: true,
      data: grouped,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get rooms",
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