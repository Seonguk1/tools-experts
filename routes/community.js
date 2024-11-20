const express  = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');  
const {getPage, getAddPost, postAddPost, getEditPost, putEditPost, deletePost, getMyPosts, verifyToken, getPostsAndComments } 
= require("../controllers/communityController");

router
    .route("/")
    .get(getPage);

router
    .route("/myPosts")
    .get(verifyToken, getMyPosts);  // 로그인 필요

 router
     .route("/post/:postId")
     .get(getPostsAndComments);

router
    .route("/add")
    .get(verifyToken, getAddPost)    // 로그인 필요
    .post(verifyToken, postAddPost); // 로그인 필요

router
    .route("/edit/:postId") 
    .get(verifyToken, getEditPost)   // 로그인 필요
    .put(verifyToken, putEditPost);  // 로그인 필요

router
    .route("/delete/:postId")
    .delete(verifyToken, deletePost); // 로그인 필요

module.exports = router;