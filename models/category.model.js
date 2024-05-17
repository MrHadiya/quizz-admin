const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  account_type_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AccountType",
    default: null,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: null,
  },
  icon: {
    type: String,
    default: null,
  },
  color_code: {
    type: String,
    default: null,
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }, 
  status: {
    type: Number,
    required: true,
    default: 1,
    enum: [1, 2],
    comment: "1=active, 2=deactive",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
