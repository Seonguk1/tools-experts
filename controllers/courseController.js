const asyncHandler = require("express-async-handler");
const mainLayout = "../views/layouts/main.ejs";
const Course = require("../models/Course");
const mongoose = require("mongoose");

const getCourse = asyncHandler(async (req, res) => {
    const local = {
        title: "course",
    }
    res.render("course", { local, layout: mainLayout });
})

const postCourse = asyncHandler(async (req, res) => {
    const { line, centerLat, centerLng } = req.body;
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
    await newCourse.save();

})

const getCourseList = asyncHandler(async (req, res) => {
    const course = await Course.findById("66cebe6259e8485fed8137cb");
    const line = course.course;
    const center = course.center;
    const local = {
        title: "courseList",
    }
    res.render("courseList", { local, line, center, layout: mainLayout });
})

module.exports = { getCourse, postCourse, getCourseList };