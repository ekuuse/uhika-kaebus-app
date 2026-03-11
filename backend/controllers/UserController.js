const { models } = require("../database");
const { User } = models;
const BaseController = require("./BaseController");
const jwt = require("jsonwebtoken");
// const bcrypt = require("bcrypt");
const crypto = require("crypto");
const validator = require("validator");
const { fn, col, where } = require("sequelize");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

class userController extends BaseController {
  constructor() {
    super();
    this.Register = this.Register.bind(this);
    this.Login = this.Login.bind(this);
  }

  generateToken(user) {
    const secret = Bun.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is not defined");
    return jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      secret,
      { expiresIn: "24h" }
    );
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
        return res.status(400).json({ message: "Invalid input data." });
      }

      const username = email.split("@")[0].toLowerCase();
      console.log(username)
      // if (!emailRegex.test(email)) {
      //  return res
      //    .status(400)
      //    .json({ success: false, error: "Invalid email format" });
      //}

      // add error if many same usernames 
      const userExists = await User.findOne({
        where: where(fn("LOWER", col("email")), email.toLowerCase())
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
          role: "User",
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