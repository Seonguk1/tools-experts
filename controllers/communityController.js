const express = require("express");
const asyncHandler = require("express-async-handler");
const mongoose = require('mongoose');
const mainLayout = "../views/layouts/main.ejs";
const Post = require("../models/Post"); 
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;
const Comment = require('../models/Comment');
const util = require('../utils/util');

const verifyToken = asyncHandler(async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.redirect("/login");
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.userID = decoded.id;
        next();
    } catch (error) {
        res.redirect("/login");
    }
});

const getCommunity = asyncHandler(async (req, res) => {
    const page = Number(req.query.page || 1);
    const perPage = Number(req.query.perPage || 10);

    const totalPosts = await Post.countDocuments();  // 전체 게시물 수
    const totalPages = Math.ceil(totalPosts / perPage); // 페이지가 부족하면 안되기에 올림

    const posts = await Post.find()
        .sort({ createdAt: -1 }) // 역순으로 저장
        .skip((page - 1) * perPage) // 현재 페이지에 맞춰 skip
        .limit(perPage)
        .exec();

    const locals = {
        title: "Community",
        currentPage: page,
        totalPages: totalPages,
        perPage: perPage
    };

    res.render("community", { data: posts, locals, layout: mainLayout });
});

const getMyPosts = asyncHandler(async (req, res)=> {

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

const getPostAndComments = async (req, res) => {
    try {
        const [post, comments] = await Promise.all([
            Post.findOne({ _id: req.params.id }).populate({ path: 'author', select: 'username' }),
            Comment.find({ post: req.params.id }).sort('createdAt').populate({ path: 'author', select: 'username' })
        ]);

        if (!post) {
            return res.status(404).send('Post not found');
        }

        // 댓글을 트리 구조로 변환
        const commentTrees = util.convertToTrees(comments, '_id', 'parentComment', 'childComments');
        
        // 결과를 템플릿에 전달
        res.render('post', {
            layout : mainLayout,
            data: post,
            commentTrees: commentTrees || []  // commentTrees가 없으면 빈 배열을 전달
        });
    } catch (err) {
        return res.status(500).json(err);
    }
};

const getAddPost = asyncHandler(async(req, res) => {

    const locals = {
        title: "게시물 작성"
    };
    res.render("addPost", {locals, layout: mainLayout});
})

const postAddPost = asyncHandler(async (req, res) => {
    const { title, body } = req.body;

    const user = await User.findById(req.userID);

    if (!user) {
        return res.redirect("/login"); // 사용자 존재 여부 확인
    }

    const createdPost = await Post.create({
        title : title,
        body : body,
        userId : user._id
    })

    user.posts.push(createdPost._id);
    await user.save();

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
    })
    res.redirect("/community/myPosts");
});

const deletePost = asyncHandler(async(req, res) => {
    await Post.deleteOne({ _id:req.params.id});
    res.redirect("/community/myPosts");
});


module.exports = {
    getCommunity,
    getAddPost,
    postAddPost,
    getEditPost,
    putEditPost,
    deletePost,
    getMyPosts,
    verifyToken,
    getPostAndComments
};