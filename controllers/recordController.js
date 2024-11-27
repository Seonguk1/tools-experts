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
        return res.redirect("/details");
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