const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
require("dotenv").config();
const cors = require("cors");
mongoose.set("strictQuery", true)

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

Routes
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const commentRouter = require("./routes/comment");

//app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/comment", commentRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});


