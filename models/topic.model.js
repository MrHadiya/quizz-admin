const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema({
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  }, 
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  access: {
    type: String,
    required: true,
    default: "Open",
    enum: ["Open", "Close"],
  },
  access_code: {
    type: String,
    default: null,
  },
  regional_relevance: {
    type: String,
    required: true,
    default: "Global",
    enum: ["Global", "Local"],
  },
  color_code: {
    type: String,
    required: true,
  },
  search_tags: {
    type: String,
    default: null,
  },
  icon: {
    type: String,
    required: true,
  },
  status: {
    type: Number,
    required: true,
    default: 1,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  game_mode: {
    type: String,
    required: true,
    default: "Training",
    enum: ["Training", "Tournament"],
  },
  match_format: {
    type: String,
    required: true,
    default: "Blitz",
    enum: ["Blitz", "Classic"],
  },
  number_of_questions: {
    type: Number,
    required: true,
    default: 7,
  },
  time_for_question: {
    type: Number,
    required: true,
    default: 20,
  },
  learning_point: {
    type: Number,
    required: true,
    default: 1,
  },
  experience_point: {
    type: Number,
    required: true,
    default: 0,
  },
});

const Topic = mongoose.model("Topic", topicSchema);
module.exports = Topic;
