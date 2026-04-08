const { models } = require("../database");
const { Room } = models;
const BaseController = require("./BaseController");

const VALID_ROOM_LETTERS = ["A", "B", "C"];

class roomController extends BaseController {
  constructor() {
    super();
    this.addRoom = this.addRoom.bind(this);
    this.getRoom = this.getRoom.bind(this);
    this.getAllRooms = this.getAllRooms.bind(this);
    this.updateRoom = this.updateRoom.bind(this);
    this.deleteRoom = this.deleteRoom.bind(this);
  }

  async addRoom(req, res) {
    try {
      const { room_nr, room_letter, floor, grade } = req.body;
      const parsedRoomNr = Number(room_nr);
      const parsedFloor = Number(floor);
      const parsedGrade = grade === undefined || grade === null || grade === ""
        ? null
        : Number(grade);
      const normalizedRoomLetter = typeof room_letter === "string"
        ? room_letter.trim().toUpperCase()
        : room_letter;

      if (!Number.isInteger(parsedRoomNr) || !Number.isInteger(parsedFloor)) {
        return res.status(400).json({
          success: false,
          message: "room_nr and floor must be integers",
        });
      }

      if (!VALID_ROOM_LETTERS.includes(normalizedRoomLetter)) {
        return res.status(400).json({
          success: false,
          message: "room_letter must be A, B, or C",
        });
      }

      if (parsedGrade !== null && !Number.isInteger(parsedGrade)) {
        return res.status(400).json({
          success: false,
          message: "grade must be an integer when provided",
        });
      }

      const existingRoom = await Room.findOne({
        where: {
          room_nr: parsedRoomNr,
          room_letter: normalizedRoomLetter,
        },
      });

      if (existingRoom) {
        return res.status(409).json({
          success: false,
          message: "Room already exists",
        });
      }

      const room = await Room.create({
        room_nr: parsedRoomNr,
        room_letter: normalizedRoomLetter,
        floor: parsedFloor,
        grade: parsedGrade,
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
      const parsedRoomNr = Number(room_nr);
      const normalizedRoomLetter = typeof room_letter === "string"
        ? room_letter.trim().toUpperCase()
        : room_letter;

      if (!Number.isInteger(parsedRoomNr) || !VALID_ROOM_LETTERS.includes(normalizedRoomLetter)) {
        return res.status(400).json({
          success: false,
          message: "Invalid room identifier",
        });
      }

      const room = await Room.findOne({
        where: {
          room_nr: parsedRoomNr,
          room_letter: normalizedRoomLetter,
        },
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
      const { floor } = req.query;
      const parsedFloor = floor === undefined || floor === null || floor === ""
        ? undefined
        : Number(floor);

      if (parsedFloor !== undefined && !Number.isInteger(parsedFloor)) {
        return res.status(400).json({
          success: false,
          message: "floor must be an integer when provided",
        });
      }

      const rooms = await Room.findAll({
        where: parsedFloor === undefined ? undefined : { floor: parsedFloor },
        order: [
          ["room_nr", "ASC"],
          ["room_letter", "ASC"],
        ],
      });

      const grouped = {};
      rooms.forEach((room) => {
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

  async updateRoom(req, res) {
    try {
      const { room_nr, room_letter } = req.params;
      const { floor, grade } = req.body;
      const parsedRoomNr = Number(room_nr);
      const normalizedRoomLetter = typeof room_letter === "string"
        ? room_letter.trim().toUpperCase()
        : room_letter;
      const parsedFloor = floor === undefined || floor === null || floor === ""
        ? undefined
        : Number(floor);
      const parsedGrade = grade === undefined || grade === null || grade === ""
        ? undefined
        : Number(grade);

      if (!Number.isInteger(parsedRoomNr) || !VALID_ROOM_LETTERS.includes(normalizedRoomLetter)) {
        return res.status(400).json({
          success: false,
          message: "Invalid room identifier",
        });
      }

      if (parsedFloor !== undefined && !Number.isInteger(parsedFloor)) {
        return res.status(400).json({
          success: false,
          message: "floor must be an integer when provided",
        });
      }

      if (parsedGrade !== undefined && !Number.isInteger(parsedGrade)) {
        return res.status(400).json({
          success: false,
          message: "grade must be an integer when provided",
        });
      }

      const room = await Room.findOne({
        where: {
          room_nr: parsedRoomNr,
          room_letter: normalizedRoomLetter,
        },
      });

      if (!room) {
        return res.status(404).json({
          success: false,
          message: "Room not found",
        });
      }

      await room.update({
        ...(parsedFloor !== undefined ? { floor: parsedFloor } : {}),
        ...(parsedGrade !== undefined ? { grade: parsedGrade } : {}),
      });

      return res.json({
        success: true,
        data: room,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to update room",
        error: error.message,
      });
    }
  }

  async deleteRoom(req, res) {
    try {
      const { room_nr, room_letter } = req.params;
      const parsedRoomNr = Number(room_nr);
      const normalizedRoomLetter = typeof room_letter === "string"
        ? room_letter.trim().toUpperCase()
        : room_letter;

      if (!Number.isInteger(parsedRoomNr) || !VALID_ROOM_LETTERS.includes(normalizedRoomLetter)) {
        return res.status(400).json({
          success: false,
          message: "Invalid room identifier",
        });
      }

      const room = await Room.findOne({
        where: {
          room_nr: parsedRoomNr,
          room_letter: normalizedRoomLetter,
        },
      });

      if (!room) {
        return res.status(404).json({
          success: false,
          message: "Room not found",
        });
      }

      await room.destroy();

      return res.json({
        success: true,
        message: "Room deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to delete room",
        error: error.message,
      });
    }
  }
}

module.exports = new roomController();