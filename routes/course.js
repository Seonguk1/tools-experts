const express = require("express");
const router = express.Router();
const{getCourse, postCourse, getCourseList} = require("../controllers/courseController");
router
    .route("/")
    .get(getCourseList)        
router
    .route("/add")
    .get(getCourse)
    .post(postCourse)

module.exports = router;