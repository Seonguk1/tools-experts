const asyncHandler = require("express-async-handler");
const mainLayout = "../views/layouts/main.ejs";
const User = require("../models/User");
const Running = require("../models/Running");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;
const mongoose = require("mongoose");

const getRecord = asyncHandler(async (req,res)=>{
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
    const running = [];
    for(let i=0;i<user.runnings.length;i++){
        running.push(await Running.findById(user.runnings[i]));
    }

    // console.log(running);
    const locals = {
        title:"Record",
    }
    res.render("record",{locals, running, layout: mainLayout});
})

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

    const { latitude, longitude, timestamp, cnt, score } = req.body;
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
            console.log(score);
            newRunning.score = score;   
        }

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