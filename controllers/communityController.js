const express = require("express");
const asyncHandler = require("express-async-handler");
const mongoose = require('mongoose');
const mainLayout = "../views/layouts/main.ejs";
const Post = require("../models/Post"); 
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

const getCommunity = asyncHandler(async (req,res)=>{
    const locals ={
        title:"Community",
    }
    const posts = await Post.find();

    res.render("community",{data: posts, locals, layout: mainLayout});
})
const getMyPosts = asyncHandler(async (req, res)=> {

    const token = req.cookies.token;
    if (!token) {
        res.redirect("/login");
    } else {
        try {
            const decoded = jwt.verify(token, jwtSecret);
            req.userID = decoded.id;
            
        } catch (error) {
            res.redirect("/login");
        }
    }
    const user = await User.findById(req.userID);

    if (!user) {
        return res.redirect("/login"); // 사용자 존재 여부 확인
    }

    const posts = await Post.find({ '_id': { $in: user.posts } });

    const locals = {
        title:"MyPosts",
    }
    res.render('myPosts', {posts : posts, locals, layout : mainLayout});
})

const postCommunity = asyncHandler(async (req, res) => {
const data = await Post.findOne({ _id : req.params.id});
res.render("post", {data, layout : mainLayout}); // 게시물 보기
})

const getAddPost = asyncHandler(async(req, res) => {

    const token = req.cookies.token;
    if (!token) {
        res.redirect("/login");
    } else {
        try {
            const decoded = jwt.verify(token, jwtSecret);
            req.userID = decoded.id;
            
        } catch (error) {
            res.redirect("/login");
        }
    }

    const locals = {
        title: "게시물 작성"
    }
    res.render("addPost", {locals, layout: mainLayout});
})

const postAddPost = asyncHandler(async (req, res) => {
    const { title, body } = req.body;

    const token = req.cookies.token;
    if (!token) {
        res.redirect("/login");
    } else {
        try {
            const decoded = jwt.verify(token, jwtSecret);
            req.userID = decoded.id;
            
        } catch (error) {
            res.redirect("/login");
        }
    }
    const user = await User.findById(req.userID);

    if (!user) {
        return res.redirect("/login"); // 사용자 존재 여부 확인
    }

    const createdPost = await Post.create({
        title : title,
        body : body,
        creator : user._id
    })

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        await createdPost.save({ session: session });
        user.posts.push(createdPost._id);
        await user.save({ session: session });
        await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }

    res.redirect("/community");
});

const getEditPost = asyncHandler(async (req, res) => {
    const locals = { title : "게시물 편집"};
    const data = await Post.findOne( { _id: req.params.id});
    res.render("editPost", {locals, data, layout : mainLayout});
})

const putEditPost = asyncHandler(async(req, res) => {
    await Post.findByIdAndUpdate(req.params.id, {
        title : req.body.title,
        body : req.body.body,
        createdAt : Date.now()
    })
    res.redirect("/community/myPosts");
});

const deletePost = asyncHandler(async(req, res) => {
    await Post.deleteOne({ _id:req.params.id});
    res.redirect("/community/myPosts");
});


module.exports = {
    getCommunity,
    postCommunity,
    getAddPost,
    postAddPost,
    getEditPost,
    putEditPost,
    deletePost,
    getMyPosts
};