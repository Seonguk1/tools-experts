const express = require("express");
const router = express.Router();
const {getStart,getStart1,getStart2,getStart3,getStart4} = require("../controllers/startController");

router
    .route("/")
    .get(getStart);

router
    .route("/1")
    .get(getStart1);

router
    .route("/2")
    .get(getStart2);

router
    .route("/3")
    .get(getStart3);

router
    .route("/4")
    .get(getStart4);

module.exports = router;