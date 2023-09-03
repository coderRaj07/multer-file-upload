const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
const cors = require("cors");
app.use(cors());


//mongodb connection
const mongoUrl =
  "<YOUR-MONGODB-DB-URL>";

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((e) => console.log(e));

//importing schema
const Files = require("./fileDetails");

app.get("/", async (req, res) => {
  res.send("Success!!!!!!");
});

app.listen(5000, () => {
  console.log("Server Started");
});

//////////////////////////////////////////////////////////////

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../src/files/");            //@devnotes:: ../src/files/ refers to frontend destination where files gets stored
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

const upload = multer({ storage: storage });
//@devnotes:: upload.single("file") the string value inside should be same as in frontend formData.append
app.post("/upload-file", upload.single("file"), async (req, res) => {
  console.log(req.body);
  const fileName = req.file.filename;
  try {
    await Files.create({ file: fileName });
    res.json({ status: "ok" });
  } catch (error) {
    res.json({ status: error });
  }
});

app.get("/get-file", async (req, res) => {
  try {
    Files.find({}).then((data) => {
      res.send({ status: "ok", data: data });
    });
  } catch (error) {
    res.json({ status: error });
  }
});
