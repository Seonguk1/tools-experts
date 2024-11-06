require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const expressLayouts = require("express-ejs-layouts");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const cors = require('cors');
const mainLayout = "../views/layouts/main.ejs";
const startLayout ="../views/layouts/start.ejs";
const informationLayout ="../views/layouts/information.ejs";

connectDB();

app.use(cors());

app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressLayouts);
app.use(cookieParser());
app.use(methodOverride("_method"));

app.use("/", require("./routes/home"));
app.use("/", require("./routes/record"));
app.use("/community", require("./routes/community"));
app.use("/community", require("./routes/comment"));
app.use("/", require("./routes/login"));
app.use("/", require("./routes/register"));
app.use("/friends", require("./routes/Friends"));
app.use("/course", require("./routes/course"));
app.use("/start",require("./routes/start"));

app.listen(port, () => {
    console.log(`server listened for ${port}`);
})
