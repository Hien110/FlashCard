const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({

  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject", // môn học liên quan
    required: true,
  },

  questionText: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Question", QuestionSchema);
