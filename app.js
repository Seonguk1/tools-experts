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

const session = require('express-session');
const bodyParser = require('body-parser');

connectDB();
    
app.use(cors());

app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // HTTPS 사용 시 true로 설정
}));

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
app.get("/information", (req,res)=>{
    res.render("information",{layout:informationLayout});
})
app.get("/free_board", (req,res)=>{
    res.render("free_board",{layout:mainLayout});
})
app.get("/writeBoard", (req,res)=>{
    res.render("writeBoard",{layout:mainLayout});
})
app.get("/friendsList", (req,res)=>{
    res.render("friendsList",{layout:mainLayout});
})
app.get("/friends_list", (req,res)=>{
    res.render("friends_list",{layout:mainLayout});
})
app.get("/find_friends", (req,res)=>{
    res.render("find_friends",{layout:mainLayout});
})
app.get("/course_list", (req,res)=>{
    res.render("course_list",{layout:mainLayout});
})
app.get('/record', (req, res) => {
    const running = req.userData.running || []; // 데이터가 없으면 빈 배열로 초기화
    const sanitizedRunning = running.filter(run => run && run.distance != null); // 유효한 데이터만 유지
    res.render('record', { running: sanitizedRunning });
});
app.get("/recording", (req,res)=>{
    res.render("recording",{layout:mainLayout});
})
app.get("/setting", (req,res)=>{
    res.render("setting",{layout:informationLayout});
})
app.get("/details", (req,res)=>{
    res.render("details",{layout:informationLayout});
})
app.get("/writer", (req,res)=>{
    res.render("writer",{layout:mainLayout});
})
app.get("/courseshare", (req,res)=>{
    res.render("courseshare",{layout:mainLayout});
})
app.listen(port, () => {
    console.log(`server listened for ${port}`);
})
