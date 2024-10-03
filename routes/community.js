const express = require("express");
const router = express.Router(); 
const {getCommunity, getAddPost, postAddPost, getEditPost, putEditPost, deletePost, getMyPosts, getPostAndComments, verifyToken } 
= require("../controllers/communityController");

router
    .route("/")
    .get(getCommunity);

router
    .route("/myPosts")
    .get(verifyToken, getMyPosts);  // 로그인 필요

router
    .route("/post/:id")
    .get(getPostAndComments);

router
    .route("/add")
    .get(verifyToken, getAddPost)    // 로그인 필요
    .post(verifyToken, postAddPost); // 로그인 필요

router
    .route("/edit/:id") 
    .get(verifyToken, getEditPost)   // 로그인 필요
    .put(verifyToken, putEditPost);  // 로그인 필요

router
    .route("/delete/:id")
    .delete(verifyToken, deletePost); // 로그인 필요

module.exports = router;