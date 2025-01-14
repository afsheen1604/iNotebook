const mongoose = require("mongoose");
const { Schema } = mongoose;

const TasksSchema = new Schema({
  Category:{
    type: String,
    required: true,
  },
  Content: {
    type: String,
    required: true,
  },
  link: {
    type: String
  }
});

module.exports = mongoose.model("tasks", TasksSchema);
