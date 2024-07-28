const express = require("express");
const router = express.Router();
const {getCommunity} = require("../controllers/communityController");
router
    .route("/community")
    .get(getCommunity)

module.exports = router;
