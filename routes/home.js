const express = require("express");
const router = express.Router();
const {getHome} = require("../controllers/homeController");
router
    .route(["/","/home"])
    .get(getHome)

module.exports = router;
