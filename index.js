const express = require("express");
const router=require("./routes/user.route");
const bodyParser = require("body-parser");
const port = process.env.PORT;
require("./config/db");

const app = express();  
app.use(express.json());

app.set("view engine","ejs")
app.set("views",(__dirname+"/views"))
app.use(express.static(__dirname+"/public"))
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", router);

app.listen(8090, () => {
  console.log("server running on " + `${8090}`);
});
