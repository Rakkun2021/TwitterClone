const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const usersRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const tweetsRoute = require("./routes/tweets");

dotenv.config();

mongoose.connect(process.env.Mongo_URL, () => {
  console.log("MongoDB Connected!");
});

app.use("/images", express.static(path.join(__dirname, "public/images")));

// Middleware
app.use(morgan("common"));
app.use(cors());
app.use(express.json());
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// express.static exposes a directory or a file to a particular URL so it's contents can be publicly accessed. [https://stackoverflow.com/questions/53002671/what-is-express-static-in-express],[https://stackoverflow.com/questions/48248832/stylesheet-not-loaded-because-of-mime-type?page=1&tab=scoredesc#tab-top]

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/images");
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
}).single("file");

app.post("/api/upload", upload, (req, res) => {
  res.json("upload successful");
});

app.use("/api/users", usersRoute);
app.use("/api/auth", authRoute);
app.use("/api/tweets", tweetsRoute);

app.listen(3001, () => {
  console.log("Server setup successful!");
});
