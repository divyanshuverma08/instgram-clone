require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

app.use(cors());

mongoose.connect(process.env.MOGODB_URI,{useNewUrlParser:true , useUnifiedTopology:true});
mongoose.connection.on("connected",()=>{
    console.log("Successfully Connected");
});
mongoose.connection.on("err",(err)=>{
    console.log(err);
});

require("./models/user");
require("./models/post");

app.use(express.json());
app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/user"));

if(process.env.NODE_ENV==="production"){
  app.use(express.static("client/build"));
  const path =require("path");
  app.get("*",(req,res)=>{
    res.sendFile(path.resolve(__dirname,"client","build","index.html"));
  })
}

const PORT = process.env.PORT || 5000;
app.listen(PORT,function(){
  console.log("Server running at port " + PORT);
});
