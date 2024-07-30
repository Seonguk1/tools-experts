const express = require("express");
const router = express.Router();
const {getLogin,postLogin} = require("../controllers/loginController");

router 
    .route("/login")
    .get(getLogin)
    .post(postLogin)

module.exports = router;