const express  = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
// const Comment = require('../models/Comment');  
const {getPage, getAddPost, postAddPost, getEditPost, putEditPost, deletePost, getMyPosts, getPostWithComments , toggleLike, getTopPost } 
= require("../controllers/communityController");

router
    .route("/")
    .get(getPage, getTopPost);

router
    .route("/mypost")
    .get(getMyPosts);  // 로그인 필요

 router
     .route("/post/:postId")
     .get(getPostWithComments );

router
    .route("/add")
    .get(getAddPost)    // 로그인 필요
    .post(postAddPost); // 로그인 필요

router
    .route("/edit/:postId") 
    .get(getEditPost)   // 로그인 필요
    .post(putEditPost);  // 로그인 필요

router
    .route("/delete")
    .post(deletePost); // 로그인 필요

router
    .route("/post/:id/like")
    .post(toggleLike)


module.exports = router;