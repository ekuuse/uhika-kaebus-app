const { models } = require("../database");
const { User, Room } = models;
const BaseController = require("./BaseController");
const jwt = require("jsonwebtoken");
// const bcrypt = require("bcrypt");
const crypto = require("crypto");
const validator = require("validator");
const { OAuth2Client } = require("google-auth-library");
const { fn, col, where } = require("sequelize");

const googleAuthClient = new OAuth2Client();

class userController extends BaseController {
  constructor() {
    super();
    this.getAllUsers = this.getAllUsers.bind(this);
    this.adminCreateUser = this.adminCreateUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.Register = this.Register.bind(this);
    this.Login = this.Login.bind(this);
    this.GoogleLogin = this.GoogleLogin.bind(this);
    this.UpdateRole = this.UpdateRole.bind(this);
    this.getSession = this.getSession.bind(this);
  }

  generateToken(user) {
    const secret = Bun.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is not defined");
    return jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      secret,
      { expiresIn: "24h" }
    );
  }

  getAllowedGoogleDomains() {
    return (Bun.env.GOOGLE_ALLOWED_DOMAINS || Bun.env.GOOGLE_ALLOWED_DOMAIN || "")
      .split(",")
      .map((domain) => domain.trim().toLowerCase().replace(/^@/, ""))
      .filter(Boolean);
  }

  getGoogleClientIds() {
    return [
      Bun.env.GOOGLE_CLIENT_ID,
      Bun.env.GOOGLE_EXPO_CLIENT_ID,
      Bun.env.GOOGLE_ANDROID_CLIENT_ID,
      Bun.env.GOOGLE_IOS_CLIENT_ID,
      Bun.env.GOOGLE_WEB_CLIENT_ID,
    ]
      .filter(Boolean)
      .map((clientId) => clientId.trim());
  }

  async generateUniqueUsername(baseUsername) {
    const sanitized = (baseUsername || "user")
      .toLowerCase()
      .replace(/[^a-z0-9._-]/g, "")
      .slice(0, 90);

    const root = sanitized || "user";
    let candidate = root;
    let suffix = 1;

    while (await User.findOne({ where: where(fn("LOWER", col("username")), candidate) })) {
      candidate = `${root}${suffix}`;
      suffix += 1;
    }

    return candidate;
  }

  async getAllUsers(req, res) {
    this.handleRequest(req, res, async () => {
      const users = await User.findAll({
        attributes: { exclude: ['password', 'google_id'] },
        order: [['id', 'ASC']],
      });
      return res.status(200).json({ success: true, users });
    });
  }

  async adminCreateUser(req, res) {
    this.handleRequest(req, res, async () => {
      const { first_name, last_name, email, password, role, status } = req.body;

      if (!first_name || !last_name || !email || !password || !role || !status) {
        return res.status(400).json({ success: false, error: "All fields are required." });
      }

      if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Invalid email format." });
      }

      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        return res.status(409).json({ success: false, error: "An account with this email already exists." });
      }

      try {
        const hashedPassword = await Bun.password.hash(password, { algorithm: "argon2id" });
        const username = await this.generateUniqueUsername(email.split("@")[0]);

        const user = await User.create({
          first_name,
          last_name,
          username,
          email,
          password: hashedPassword,
          role,
          status,
        });

        const userResponse = { ...user.get() };
        delete userResponse.password;

        return res.status(201).json({
          success: true,
          message: "User created successfully.",
          user: userResponse,
        });
      } catch (dbErr) {
        console.error("Database error occurred: ", dbErr);
        return res.status(500).json({
          success: false,
          message: "Failed to create user.",
          error: dbErr.message,
        });
      }
    });
  }

  async deleteUser(req, res) {
    this.handleRequest(req, res, async () => {
      const userId = Number(req.params.id);

      if (!Number.isInteger(userId) || userId <= 0) {
        return res.status(400).json({ success: false, error: "Invalid user id." });
      }

      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).json({ success: false, error: "User not found." });
      }

      await user.destroy();

      return res.status(200).json({ success: true, message: "User deleted successfully." });
    });
  }

  async Register(req, res) {
    this.handleRequest(req, res, async () => {
      const { first_name, last_name, email, password } = req.body;

      if ( !first_name || !last_name || !email || !password) {
        return res
          .status(400)
          .json({ success: false, error: "Fields cannot be empty!" });
      }

      if (
        typeof first_name !== "string" ||
        typeof last_name !== "string" ||
        typeof email !== "string" ||
        typeof password !== "string" ||
        !validator.isEmail(email) ||
        !validator.isLength(password, { min: 8 })
      ) {
        return res.status(400).json({ message: "Invalid register data, please check your formatting." });
      }

      const username = email.split("@")[0].toLowerCase();
      console.log(username)

      // add error if many same usernames 
      const userExists = await User.findOne({
        where: where(fn("LOWER", col("username")), username.toLowerCase())
      });

      if (userExists) {
        return res
          .status(409)
          .json({ success: false, error: "An account already exists with that email!" })
      }

      try {
        const hashedPassword = await Bun.password.hash(password, {
          algorithm: "argon2id",
        });

        const user = await User.create({
          first_name,
          last_name,
          username,
          email,
          password: hashedPassword,
          role: "user",
          status: "pending",
        });

        const token = this.generateToken(user);

        return res.status(201).json({
          success: true,
          message: "User created and logged in.",
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
          },
        });
      } catch (dbErr) {
        console.error("Database error occurred: ", dbErr);
        return res.status(500).json({
          success: false,
          message: "Failed to create user.",
          error: dbErr.message,
        });
      }
    });
  }

  async Login(req, res) {
    this.handleRequest(req, res, async () => {
      const { accountname, password } = req.body;

      if (!accountname || !password) {
        return res
          .status(400)
          .json({ success: false, error: "Fields cannot be empty!" });
      }

      try {
        // Find by email or username
        const isEmail = validator.isEmail(accountname);
        const user = await User.findOne({
          where: isEmail
            ? where(fn("LOWER", col("email")), accountname.toLowerCase())
            : where(fn("LOWER", col("username")), accountname.toLowerCase()),
        });

        if (!user) {
          return res
            .status(401)
            .json({ success: false, error: "Invalid credentials" });
        }

        const isPasswordValid = await Bun.password.verify(
          password,
          user.password
        );

        if (!isPasswordValid) {
          return res
            .status(401)
            .json({ success: false, error: "Invalid credentials" });
        }

        const token = this.generateToken(user);

        return res.status(200).json({
          success: true,
          message: "User logged in.",
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
          },
        });
      } catch (dbErr) {
        console.error("Database error occurred: ", dbErr);
        return res.status(500).json({
          success: false,
          message: "Failed to login user.",
          error: dbErr.message,
        });
      }
    });
  }

  async GoogleLogin(req, res) {
    this.handleRequest(req, res, async () => {
      const { idToken } = req.body;

      if (!idToken || typeof idToken !== "string") {
        return res.status(400).json({ success: false, error: "Google idToken is required." });
      }

      const allowedDomains = this.getAllowedGoogleDomains();
      if (allowedDomains.length === 0) {
        return res.status(500).json({
          success: false,
          error: "Google login is not configured. Set GOOGLE_ALLOWED_EMAIL(S) or GOOGLE_ALLOWED_DOMAIN(S).",
        });
      }

      const clientIds = this.getGoogleClientIds();
      if (clientIds.length === 0) {
        return res.status(500).json({
          success: false,
          error: "Google login is not configured. Set GOOGLE_CLIENT_ID values.",
        });
      }

      let payload;
      try {
        const ticket = await googleAuthClient.verifyIdToken({
          idToken,
          audience: clientIds,
        });
        payload = ticket.getPayload();
      } catch (error) {
        return res.status(401).json({ success: false, error: "Invalid Google token." });
      }

      const email = payload?.email?.toLowerCase();
      if (!email || payload?.email_verified !== true) {
        return res.status(401).json({ success: false, error: "Google email is not verified." });
      }

      const emailDomain = email.split("@")[1] || "";
      const isEmailAllowed = allowedEmails.includes(email);
      const isDomainAllowed = allowedDomains.includes(emailDomain);

      if (!isEmailAllowed && !isDomainAllowed) {
        return res.status(403).json({ success: false, error: "This email or domain is not allowed to sign in." });
      }

      const googleId = payload?.sub;
      if (!googleId) {
        return res.status(401).json({ success: false, error: "Google token missing subject." });
      }

      let user = await User.findOne({ where: where(fn("LOWER", col("email")), email) });

      if (!user) {
        const suggestedUsername = email.split("@")[0];
        const username = await this.generateUniqueUsername(suggestedUsername);
        const firstName = payload?.given_name || payload?.name || username;
        const lastName = payload?.family_name || "Google";
        const randomPasswordHash = await Bun.password.hash(crypto.randomUUID(), {
          algorithm: "argon2id",
        });

        user = await User.create({
          first_name: firstName,
          last_name: lastName,
          username,
          email,
          password: randomPasswordHash,
          google_id: googleId,
          role: "user",
          status: "accepted",
        });
      } else {
        if (user.google_id && user.google_id !== googleId) {
          return res.status(409).json({ success: false, error: "Google account mismatch for this email." });
        }

        if (!user.google_id) {
          user.google_id = googleId;
          await user.save();
        }
      }

      const token = this.generateToken(user);

      return res.status(200).json({
        success: true,
        message: "User logged in with Google.",
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      });
    });
  }

  async UpdateRole(req, res) {
    this.handleRequest(req, res, async () => {
      const userId = Number(req.params.id);
      const { role, status, room_nr } = req.body;

      if (!Number.isInteger(userId) || userId <= 0) {
        return res.status(400).json({ success: false, error: "Invalid user id." });
      }

      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).json({ success: false, error: "User not found." });
      }

      if (role !== undefined) {
        const normalizedRole = typeof role === "string" ? role.trim().toLowerCase() : role;
        if (typeof role !== "string" || !["user", "admin"].includes(normalizedRole)) {
          return res.status(400).json({
            success: false,
            error: "Invalid role. Allowed values: user, admin.",
          });
        }
        user.role = normalizedRole;
      }

      if (status !== undefined) {
        const normalizedStatus = typeof status === "string" ? status.trim().toLowerCase() : status;
        if (typeof status !== "string" || !["pending", "denied", "accepted"].includes(normalizedStatus)) {
          return res.status(400).json({
            success: false,
            error: "Invalid status. Allowed values: pending, denied, accepted.",
          });
        }
        user.status = normalizedStatus;
      }

      if (room_nr !== undefined) {
        if (room_nr !== null) {
          if (typeof room_nr !== 'number' || !Number.isInteger(room_nr)) {
            return res.status(400).json({ success: false, error: "Invalid room number." });
          }
          const roomExists = await Room.findOne({ where: { room_nr } });
          if (!roomExists) {
            return res.status(400).json({ success: false, error: `Room with number ${room_nr} does not exist.` });
          }
        }
        user.room_nr = room_nr;
      }

      await user.save();

      const userResponse = { ...user.get() };
      delete userResponse.password;
      delete userResponse.google_id;

      return res.status(200).json({
        success: true,
        message: "User updated.",
        user: userResponse,
      });
    });
  }

  async getSession(req, res) {
    this.handleRequest(req, res, async () => {
      return res.status(200).json({
        success: true,
        user: req.user,
      });
    })
  }
}

module.exports = new userController();