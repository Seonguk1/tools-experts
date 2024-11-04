const express = require("express");
const router = express.Router();
const {
    getLogin,
    postLogin,
    getLogout
} = require("../controllers/loginController");

router 
    .route("/login")
    .get(getLogin)
    .post(postLogin)

router 
    .route("/logout")
    .get(getLogout)

module.exports = router;