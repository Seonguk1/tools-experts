const express = require("express");
const router = express.Router();
const {getRecord} = require("../controllers/recordController");
router
    .route("/record")
    .get(getRecord)

module.exports = router;
