const express  = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
// const Comment = require('../models/Comment');  
const {getPage, getAddPost, postAddPost, getEditPost, putEditPost, deletePost, getMyPosts, getPosts } 
= require("../controllers/communityController");

router
    .route("/")
    .get(getPage);

router
    .route("/myPosts")
    .get(getMyPosts);  // 로그인 필요

 router
     .route("/post/:postId")
     .get(getPosts);

router
    .route("/add")
    .get(getAddPost)    // 로그인 필요
    .post(postAddPost); // 로그인 필요

router
    .route("/edit/:postId") 
    .get(getEditPost)   // 로그인 필요
    .put(putEditPost);  // 로그인 필요

router
    .route("/delete/:postId")
    .delete(deletePost); // 로그인 필요

module.exports = router;