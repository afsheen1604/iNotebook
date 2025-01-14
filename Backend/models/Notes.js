const mongoose = require("mongoose");
const { Schema } = mongoose;

const NotesSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    default: "General",
  },
  image: {
    type: [String],
    default: [],
  },
  video: {
    type: [String],
    default: [],
  },
  shared:{
    type: [{
      value: String,
      label: String
    }],
    default: []
  },
  date: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("notes", NotesSchema);
