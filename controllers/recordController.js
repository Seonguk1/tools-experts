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
    for (let i = userRunnings.length - 1; i >= 0; i--) {
        const runningData = await Running.findById(userRunnings[i]);
        if (runningData) {
            running.push(runningData);
        }
    }

    // locals 객체 정의
    const locals = {
        title: "Record",
    };

    // 템플릿 렌더링
    res.render("record", { locals, running, layout: mainLayout });
});


const getRunning = asyncHandler(async (req, res) => {
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
        title: "Running",
    }
    res.render("running", { locals, layout: mainLayout });
})
const postRunning = asyncHandler(async (req, res) => {
    console.log("post 요청 완료")
    const token = req.cookies.token;

    if (!token) {
        return res.redirect("/login");
    }

    let decoded;
    try {
        decoded = jwt.verify(token, jwtSecret);
    } catch (error) {
        console.error("JWT verification failed:", error);
        return res.redirect("/login");
    }

    const user = await User.findById(decoded.id);
    if (!user) {
        return res.redirect("/login");
    }

    // req.body에서 데이터 추출
    const { totalDistance, averagePace, totalTime, caloriesBurned, startTime, route, score } = req.body;

    // `route`가 JSON 문자열로 전달된 경우 배열로 변환
    let parsedRoute;
    try {
        parsedRoute = typeof route === "string" ? JSON.parse(route) : route; // JSON 파싱
    } catch (error) {
        console.error("Failed to parse route:", error);
        return res.status(400).json({ error: "Invalid route format. Route should be a JSON array." });
    }

    // `route`가 배열인지 확인
    if (!Array.isArray(parsedRoute)) {
        console.error("Route is not an array.");
        return res.status(400).json({ error: "Route must be an array." });
    }

    // 날짜 관련 필드 계산
    const runningDate = new Date(startTime);
    const weekOfYear = Math.ceil(((runningDate - new Date(runningDate.getFullYear(), 0, 1)) / 86400000 + 1) / 7);

    // 새 러닝 데이터 생성
    const newRunning = new Running({
        timestamp: {
            start: new Date(startTime),
            end: new Date(), // 서버 시간으로 종료 시간 기록
        },
        route: parsedRoute.map((point) => ({
            latitude: point.lat,
            longitude: point.lng,
        })),
        distance: parseFloat(totalDistance),
        score: parseInt(score, 10),
        avg_pace: parseFloat(averagePace),
        calorie: parseFloat(caloriesBurned),
        taken_time: parseInt(totalTime, 10),
        date: new Date(startTime),
        creator: user._id,
        week_of_year: weekOfYear,
        month: runningDate.getMonth() + 1,
        year: runningDate.getFullYear(),
    });

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        await newRunning.save({ session });
        user.runnings.push(newRunning._id);
        await user.save({ session });
        await session.commitTransaction();

        // res.status(201).json({ message: "Running data saved successfully", running: newRunning });
    } catch (error) {
        await session.abortTransaction();
        console.error("Error saving running data:", error);
    } finally {
        session.endSession();
        const daysList = ["일", "월", "화", "수", "목", "금", "토"]
        const locals = {
            day: daysList[new Date(newRunning.date).getDay()],
            title: "Details",
            formattedElapsedTime: formatElapsedTime (newRunning.taken_time), // taken_time을 포맷
        }
        // 경과 시간을 `HH:MM:SS`로 변환하는 함수
        function formatElapsedTime(seconds) {
            const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
            const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
            const secs = (seconds % 60).toString().padStart(2, '0');
            return `${hrs}:${mins}:${secs}`;
        }
        return res.render("details", { newRunning, locals, layout: mainLayout });
    }
});



module.exports = {
    getRecord,
    getRunning,
    postRunning,

};