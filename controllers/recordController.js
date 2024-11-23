const asyncHandler = require("express-async-handler");
const mainLayout = "../views/layouts/main.ejs";
const User = require("../models/User");
const Running = require("../models/Running");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;
const mongoose = require("mongoose");

const getRecord = asyncHandler(async (req, res) => {
    const token = req.cookies.token;

    // 토큰 검증 및 리디렉션 처리
    if (!token) {
        return res.redirect("/login");
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.userID = decoded.id;

        console.log("Decoded userID:", req.userID); // JWT 토큰에서 추출한 유저 ID

    } catch (error) {
        return res.redirect("/login");
    }

    // 사용자 조회
    const user = await User.findById(req.userID) || {}; // user가 null일 경우 빈 객체로 초기화

    // console.log("User data:", user); // MongoDB에서 조회한 유저 데이터

    const userRunnings = user.runnings || []; // runnings가 null일 경우 빈 배열로 초기화

    // console.log("User runnings:", userRunnings); // 유저의 러닝 기록 배열

    // 러닝 데이터 조회
    const running = [];
    for (let i = 0; i < userRunnings.length; i++) {
        const runningData = await Running.findById(userRunnings[i]);
        if (runningData) {
            running.push(runningData);
        }
    }

    console.log(running);

    // locals 객체 정의
    const locals = {
        title: "Record",
    };

    // 템플릿 렌더링
    res.render("record", { locals, running, layout: mainLayout });
});


const getRunning = asyncHandler(async (req,res)=>{
    const token = req.cookies.token;
    
    if (!token) {
        res.redirect("/login");
    } else {
        try {
            const decoded = jwt.verify(token, jwtSecret);
            req.userID = decoded.id;
            
        } catch (error) {
            res.redirect("/login");
        }
    }
    const user = await User.findById(req.userID);

    const locals = {
        title:"Running",
    }
    res.render("running",{locals, layout: mainLayout});
})

let latitudeArray = [];
let longitudeArray = [];
let timestampArray = [];
const postRunning = asyncHandler(async (req,res)=>{
    const token = req.cookies.token;
    
    if (!token) {
        res.redirect("/login");
    } else {
        try {
            const decoded = jwt.verify(token, jwtSecret);
            req.userID = decoded.id;
            
        } catch (error) {
            res.redirect("/login");
        }
    }
    const user = await User.findById(req.userID);

    const { latitude, longitude, timestamp, cnt, score, distance } = req.body;
    if(!cnt){
        latitudeArray.push(latitude);
        longitudeArray.push(longitude);
        timestampArray.push(timestamp);
        
        // console.log(`${latitudeArray}  ${longitudeArray}  ${timestampArray}`);
    }
    else if(cnt){
        const newRunning = new Running({
            creator: req.userID
        });
        console.log(req.userID);
        for(let i=0;i<latitudeArray.length;i++){
            newRunning.location.push({
                latitude: latitudeArray[i],
                longitude: longitudeArray[i]
            });
            newRunning.timestamp.push(timestampArray[i]);
        }
        console.log(score);
        newRunning.score = score;
        newRunning.distance = distance;   

        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            await newRunning.save({ session: session });
            user.runnings.push(newRunning._id);
            await user.save({ session: session });
            await session.commitTransaction();
            latitudeArray = [];
            longitudeArray = [];
            timestampArray = [];
            console.log("세션");
        } catch (error) {
            await session.abortTransaction();
            throw error;    
        } finally {
            session.endSession();
            console.log("Redirecting to /record after session end");
            return res.redirect("/");
        }
        
        
    }
})

module.exports = {
    getRecord,
    getRunning,
    postRunning,

};