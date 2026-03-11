const { models } = require("../database");
const { Users } = models;
const BaseController = require("./BaseController");
const jwt = require("jsonwebtoken");
// const bcrypt = require("bcrypt");
const crypto = require("crypto");
const validator = require("validator");
const { fn, col, where } = require("sequelize");
const { PET_NAMES, PET_TYPES } = require("../config/config");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

class userController extends BaseController {
  constructor() {
    super();
    this.Register = this.Register.bind(this);
    this.Login = this.Login.bind(this);
  }

  generateToken(user) {
    return jwt.sign(
      { id: user.user_id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
  }



  async Register(req, res) {
    this.handleRequest(req, res, async () => {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res
          .status(400)
          .json({ success: false, error: "Fields cannot be empty!" });
      }

      if (
        typeof username !== "string" ||
        typeof email !== "string" ||
        typeof password !== "string" ||
        !validator.isLength(username, { min: 3, max: 20 }) ||
        !validator.matches(username, /^[a-zA-Z0-9_]+$/) ||
        !validator.isEmail(email) ||
        !validator.isLength(password, { min: 8 })
      ) {
        return res.status(400).json({ message: "Invalid input data." });
      }

      // if (!emailRegex.test(email)) {
      //  return res
      //    .status(400)
      //    .json({ success: false, error: "Invalid email format" });
      //}

      // add error if many same usernames 
      const userExists = await Users.findOne({
        where: where(fn("LOWER", col("username")), username.toLowerCase())
      });

      if (userExists) {
        return res
          .status(409)
          .json({ success: false, error: "Username already taken!" })
      }

      try {
        const hashedPassword = await Bun.password.hash(password, {
          algorithm: "argon2id",
        });

        const user = await Users.create({
          username,
          email,
          password: hashedPassword,
        });

        const token = this.generateToken(user);

        return res.status(201).json({
          success: true,
          message: "User created and logged in.",
          token,
          user: {
            id: user.user_id,
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
      const { email, password } = req.body;

      if (!username || !password) {
        return res
          .status(400)
          .json({ success: false, error: "Fields cannot be empty!" });
      }

      try {
        const user = await Users.findOne({ where: { username } });

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
            id: user.user_id,
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
}

module.exports = new userController();