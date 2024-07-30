require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const expressLayouts = require("express-ejs-layouts");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");

connectDB();

app.use(express.static("public"));

app.set("view engine","ejs");
app.set("views","./views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressLayouts);
app.use(cookieParser());

app.use("/",require("./routes/home"))
app.use("/",require("./routes/record"))
app.use("/",require("./routes/community"))
app.use("/",require("./routes/login"))
app.use("/",require("./routes/register"))

app.listen(port, ()=>{
    console.log(`server listened for ${port}`);
})