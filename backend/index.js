const express = require("express");
const userRouter = require("./routes/userRouter");
const complaintRouter = require("./routes/complaintRouter");
const eventRouter = require("./routes/eventRouter");
const corsHandler = require('./middleware/cors');
const rateLimit = require("express-rate-limit")
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corsHandler);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 500,              // max 500 requests per window per IP
  standardHeaders: true,   // adds RateLimit-* headers
  legacyHeaders: false,    // disables X-RateLimit-* headers
  message: { error: "You have made too many requests, please try again later." },
});

// Rate limiting
app.use("/api", limiter);

// Routes
app.use("/api", userRouter);
app.use("/api", complaintRouter);
app.use("/api", eventRouter)

app.listen(7007, () => {
  console.log("👍 | http://localhost:7007");
});

module.exports = app