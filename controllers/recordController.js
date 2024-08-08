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
    const locals = {
        title:"Running",
    }
    res.render("running",{locals, layout: mainLayout});
})

const postRunning = asyncHandler(async (req,res)=>{
    const {distance, time} = req.body;
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
    // const user = await User.findById(req.userID);
    // const createdRunning = await Running.create({
    //     distance : distance,
    //     time : time,
    //     creator: user._id
    // });

    // const session = await mongoose.startSession();
    // session.startTransaction();
    // try {
    //     await createdRunning.save({ session: session });
    //     user.runnings.push(createdRunning._id);
    //     await user.save({ session: session });
    //     await session.commitTransaction();
    // } catch (error) {
    //     await session.abortTransaction();
    //     throw error;
    // } finally {
    //     session.endSession();
    // }

    // res.redirect("/");
    const gpsData= [];
    const { latitude, longitude, timestamp } = req.body;
    gpsData.push({ latitude, longitude, timestamp });
    console.log('Received GPS data:', req.body);
    res.sendStatus(200);
})

module.exports = {
    getRecord,
    getRunning,
    postRunning,

};