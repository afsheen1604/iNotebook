const mongoose = require("mongoose");
const { Schema } = mongoose;

const TodoListSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  content: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending",
  },
  type:{
    type: String,
    enum: ["own", "suggested"],
    default: "own"
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("todolist", TodoListSchema);
