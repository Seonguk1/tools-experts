const asyncHandler = require("express-async-handler");
const mainLayout = "../views/layouts/main.ejs";
const User = require("../models/User");
const Course = require("../models/Course");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

const getCourse = asyncHandler(async (req, res) => {
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

    const local = {
        title: "course",
    }
    res.render("course", { local, layout: mainLayout });
})

const postCourse = asyncHandler(async (req, res) => {
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

    const { line, centerLat, centerLng, distance } = req.body;
    const newCourse = new Course();
    for (let i = 0; i < line.length; i++) {
        newCourse.course.push({
            la: line[i].La,
            ma: line[i].Ma
        })
    }
    newCourse.center = {
        la: centerLng,
        ma: centerLat
    };
    newCourse.distance = distance;
    const session = await mongoose.startSession();
        session.startTransaction();
        try {
            newCourse.creator = user._id;   
            await newCourse.save({ session: session });
            user.courses.push(newCourse._id);
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

})

const getCourseList = asyncHandler(async (req, res) => {
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

    const course = await Course.findById("66cebe6259e8485fed8137cb");
    const line = course.course;
    const center = course.center;
    const local = {
        title: "courseList",
    }
    res.render("courseList", { local, line, center, layout: mainLayout });
})

module.exports = { getCourse, postCourse, getCourseList };