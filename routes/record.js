const express = require("express");
const router = express.Router();
const {getRecord,getRunning,postRunning} = require("../controllers/recordController");
router
    .route("/record")
    .get(getRecord)


//임시
router
    .route("/running")
    .get(getRunning)
    .post(postRunning)


module.exports = router;
