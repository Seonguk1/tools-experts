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
    } catch (error) {
        return;  // 여기에서 응답을 보내지 않도록 종료합니다.
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
        return res.redirect("/login");
    }
    
    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.userID = decoded.id;
    } catch (error) {
        return;  // 여기에서 응답을 보내지 않도록 종료합니다.
    }

    const user = await User.findById(req.userID);

    const locals = {
        title:"Running",
    }
    res.render("running",{locals, layout: mainLayout});
})

const postRunning = asyncHandler(async (req,res)=>{
    const token = req.cookies.token;
    
    if (!token) {
        return res.redirect("/login");
    }
    
    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.userID = decoded.id;
    } catch (error) {
        return;  // 여기에서 응답을 보내지 않도록 종료합니다.
    }
    const user = await User.findById(req.userID);

    let { allLatitudes, allLongitudes, allTimestamps, allPaces, score, totalDistance } = req.body;
allLatitudes = allLatitudes.split(",");
allLongitudes = allLongitudes.split(",");
allTimestamps = allTimestamps.split(",");
allPaces = allPaces.split(",");
    
    const newRunning = new Running({
        creator: req.userID
    });

    for(let i=0;i<allLatitudes.length;i++){
        newRunning.location.push({
            latitude: allLatitudes[i],
            longitude: allLongitudes[i]
        });
        newRunning.timestamp.push(allTimestamps[i]);
    }
    newRunning.score = score;
    newRunning.distance = totalDistance;  

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        await newRunning.save({ session: session });
        user.runnings.push(newRunning._id);
        await user.save({ session: session });
        await session.commitTransaction();
        console.log("세션");
    } catch (error) {
        await session.abortTransaction();
        throw error;    
    } finally {
        session.endSession();
        console.log("Redirecting to /record after session end");
        return res.redirect("/");
    }

    //
    // if(!cnt){
    //     latitudeArray.push(latitude);
    //     longitudeArray.push(longitude);
    //     timestampArray.push(timestamp);
        
    //     // console.log(`${latitudeArray}  ${longitudeArray}  ${timestampArray}`);
    // }
    // else if(cnt){
    //     const newRunning = new Running({
    //         creator: req.userID
    //     });
    //     console.log(req.userID);
    //     for(let i=0;i<latitudeArray.length;i++){
    //         newRunning.location.push({
    //             latitude: latitudeArray[i],
    //             longitude: longitudeArray[i]
    //         });
    //         newRunning.timestamp.push(timestampArray[i]);
    //     }
    //     console.log(score);
    //     newRunning.score = score;
    //     newRunning.distance = distance;   

    //     const session = await mongoose.startSession();
    //     session.startTransaction();
    //     try {
    //         await newRunning.save({ session: session });
    //         user.runnings.push(newRunning._id);
    //         await user.save({ session: session });
    //         await session.commitTransaction();
    //         latitudeArray = [];
    //         longitudeArray = [];
    //         timestampArray = [];
    //         console.log("세션");
    //     } catch (error) {
    //         await session.abortTransaction();
    //         throw error;    
    //     } finally {
    //         session.endSession();
    //         console.log("Redirecting to /record after session end");
    //         return res.redirect("/");
    //     }
    // }
})

module.exports = {
    getRecord,
    getRunning,
    postRunning,

};