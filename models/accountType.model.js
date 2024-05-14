const mongoose = require("mongoose");

const accountTypeSchema = new mongoose.Schema({
  account_type: {
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
});

const AccountType = mongoose.model("AccountType", accountTypeSchema);

module.exports = AccountType;
