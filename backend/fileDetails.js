const mongoose = require("mongoose");

const FileDetailsSchema = new mongoose.Schema(
  {
    file: String,
  },
  {
    collection: "FileDetails",
  }
);

const FileDetails = mongoose.model("FileDetails", FileDetailsSchema);

module.exports = FileDetails;

