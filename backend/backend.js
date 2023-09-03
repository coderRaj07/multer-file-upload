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


//On frontend also we could only accept specific type of files 
//by editing "accept" property <input type="file" accept="image/*" onChange={onInputChange}></input>

//To filter in backend
const fileFilter = (req, file, cb) => {
  // Check file type or any other criteria here
  // For example, allow only .jpg and .png files:
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "application/pdf" // Add more allowed types if needed
  ) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Invalid file type"), false); // Reject the file
  }
};

//limits and fileFilter are optional
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Limit file size to 2MB
  fileFilter: fileFilter, // Apply the file filter
});


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
