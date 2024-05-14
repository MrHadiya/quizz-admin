const mongoose=require("mongoose")
require('dotenv').config();

const connection = async () => {
  await mongoose.connect("mongodb://127.0.0.1:27017/adminpenal");
  console.log("database connected");
};

module.exports = connection();
