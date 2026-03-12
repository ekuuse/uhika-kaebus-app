const { models } = require("../database");
const { Complaint, Room, ComplaintRoom, User } = models;
const BaseController = require("./BaseController");

const VALID_ROOM_LETTERS = ["A", "B", "C"];
const UNKNOWN_ROOM_LETTER_VALUES = [
  "IDK",
  null,
  "UNKNOWN",
  "A B C",
];

class ComplaintController extends BaseController {
  constructor() {
    super();
    this.getAllComplaints = this.getAllComplaints.bind(this);
    this.createComplaint = this.createComplaint.bind(this);
    this.updateComplaint = this.updateComplaint.bind(this);
    this.getComplaint = this.getComplaint.bind(this);
  }

  async getAllComplaints(req, res) {
    this.handleRequest(req, res, async () => {
      const complaints = await Complaint.findAll({
        include: [
          {
            model: Room,
            through: { attributes: [] },
            attributes: ["room_nr", "room_letter", "floor", "grade"],
          },
          {
            model: User,
            attributes: ["id", "first_name", "last_name", "email"],
          },
        ],
        order: [["sent_date", "DESC"]],
      });

      return res.status(200).json({ success: true, complaints });
    });
  }

  async getComplaint(req, res) {
    this.handleRequest(req, res, async () => {
      const complaint_id = Number(req.params.id);

      if (!Number.isInteger(complaint_id) || complaint_id <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid complaint id.",
        });
      }

      const complaint = await Complaint.findOne({
        where: { complaint_id },
        include: [
          {
            model: Room,
            through: { attributes: [] },
            attributes: ["room_nr", "room_letter", "floor", "grade"],
          },
          {
            model: User,
            attributes: ["id", "first_name", "last_name", "email"],
          },
        ],
        order: [["sent_date", "DESC"]],
      });
      if (!complaint) {
        return res.status(404).json({
          success: false,
          message: "Failed to find the complaint.",
        });
      } else {
        return res.status(200).json({ success: true, complaint });
      }
    });
  }

  async createComplaint(req, res) {
    this.handleRequest(req, res, async () => {
      const { type, reasoning, room } = req.body;
      const user_id = req.user.id;

      if (!type || !reasoning || !room) {
        return res.status(400).json({
          success: false,
          error: "type, reasoning and room are required",
        });
      }

      const room_nr = typeof room === "object" ? room.room_nr : req.body.room_nr;
      const room_letter = typeof room === "object" ? room.room_letter : req.body.room_letter;

      if (typeof room_nr !== "number") {
        return res.status(400).json({
          success: false,
          error: "room_nr must be a number",
        });
      }

      const normalizedRoomLetter =
        typeof room_letter === "string"
          ? room_letter.trim().toUpperCase().replace(/\s+/g, " ")
          : undefined;
      const hasKnownLetter = VALID_ROOM_LETTERS.includes(normalizedRoomLetter);
      const isUnknownLetterSelection =
        !normalizedRoomLetter || UNKNOWN_ROOM_LETTER_VALUES.includes(normalizedRoomLetter);

      if (!hasKnownLetter && !isUnknownLetterSelection) {
        return res.status(400).json({
          success: false,
          error: "room_letter must be A, B, C or an unknown value like IDK",
        });
      }

      const roomsToAttach = hasKnownLetter
        ? await Room.findAll({ where: { room_nr, room_letter: normalizedRoomLetter } })
        : await Room.findAll({ where: { room_nr, room_letter: VALID_ROOM_LETTERS } });

      if (!roomsToAttach.length) {
        return res.status(404).json({
          success: false,
          error: hasKnownLetter ? "Room not found" : "No rooms found for this room number",
        });
      }

      const complaint = await Complaint.create({
        type,
        reasoning,
        user_id,
      });

      const complaintRoomRows = roomsToAttach.map((foundRoom) => ({
        complaint_id: complaint.complaint_id,
        room_nr: foundRoom.room_nr,
        room_letter: foundRoom.room_letter,
      }));

      await ComplaintRoom.bulkCreate(complaintRoomRows, {
        ignoreDuplicates: true,
      });

      return res.status(201).json({
        success: true,
        message: "Complaint created",
        complaint,
        applied_room_letters: hasKnownLetter
          ? [normalizedRoomLetter]
          : VALID_ROOM_LETTERS,
        applied_room_letters_text: hasKnownLetter
          ? normalizedRoomLetter
          : "A, B or C",
      });
    });
  }

  async updateComplaint(req, res) {
    this.handleRequest(req, res, async () => {
      const { id } = req.params;
      const { type, reasoning } = req.body;

      if (!type && !reasoning) {
        return res
          .status(400)
          .json({
            success: false,
            error: "Provide at least type or reasoning to update.",
          });
      }

      const complaint = await Complaint.findByPk(id);

      if (!complaint) {
        return res
          .status(404)
          .json({ success: false, error: "Complaint not found." });
      }

      if (type !== undefined && typeof type !== "string") {
        return res.status(400).json({ success: false, error: "Invalid type." });
      }
      if (reasoning !== undefined && typeof reasoning !== "string") {
        return res
          .status(400)
          .json({ success: false, error: "Invalid reasoning." });
      }

      if (type) complaint.type = type;
      if (reasoning) complaint.reasoning = reasoning;
      await complaint.save();

      return res.status(200).json({
        success: true,
        message: "Complaint updated.",
        complaint,
      });
    });
  }
}

module.exports = new ComplaintController();
