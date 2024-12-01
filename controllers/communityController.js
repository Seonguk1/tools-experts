const express = require("express");
const asyncHandler = require("express-async-handler");
const mongoose = require('mongoose');
const mainLayout = "../views/layouts/main.ejs";
const Post = require("../models/Post"); 
const User = require("../models/User");
const Comment = require('../models/Comment');

const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

const getPage = asyncHandler(async (req, res) => {
    const page = Number(req.query.page || 1);
    const perPage = Number(req.query.perPage || 10);

    const totalPosts = await Post.countDocuments();  // 전체 게시물 수
    const totalPages = Math.ceil(totalPosts / perPage); // 페이지가 부족하면 안되기에 올림
    const posts = await Post.find()
        .populate('userId', 'nickname') // userId를 참조하고 nickname만 가져옴
        .sort({ created_at: -1 }) // 최신순으로 정렬
        .skip((page - 1) * perPage) // 현재 페이지에 맞춰 skip
        .limit(perPage) // 페이지당 제한 수
        .exec(); // 최종적으로 쿼리 실행

    const locals = {
        title: "Community",
        currentPage: page,
        totalPages: totalPages,
        perPage: perPage
    };

    res.render("community", { data: posts, locals, layout: mainLayout });
});


// const getPostsAndComments = asyncHandler(async (req, res) => {
//   Promise.all([
//     Post.findOne({_id:req.params.id}).populate({ path: 'userId', select: 'username' }),
//     Comment.find({post:req.params.id}).sort('createdAt').populate({ path: 'author', select: 'username' })
//   ])
//   .then(([post, comments]) => {
//     const commentTrees = util.convertToTrees(comments, '_id','parentComment','childComments'); // 1
//       return res.json({post, commentTrees})
//   })
//   .catch((err) => {
//     return res.json(err);
//   });
// });

const getPosts = asyncHandler(async (req, res) => {
    const locals = { title: "게시물 편집" };
 
    // await를 사용해 데이터를 가져옴
    const data = await Post.findOne({ _id: req.params.postId }).populate('userId', 'nickname');
    
 
    // 렌더링 시 data를 전달
    res.render("writer", { locals, data, layout: mainLayout });
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

const getAddPost = asyncHandler(async(req, res) => {

    const locals = {
        title: "게시물 작성"
    };
    res.render("writeBoard", {locals, layout: mainLayout});
})

const postAddPost = asyncHandler(async (req, res) => {
    const { title, body } = req.body;

    if (!title || !body) {
        return res.status(400).json({ error: "제목과 본문은 필수 입력 항목입니다." });
    }

    const token = req.cookies.token;
    if (!token) {
        return res.redirect("/login");
    }
    
    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.userID = decoded.id;
    } catch (error) {
        return;  // 여기에서 응답을 보내지 않도록 종료합니다.
    }

    const user = await User.findById(req.userID);

    if (!user) {
        return res.status(401).json({ error: "로그인된 사용자만 게시글을 작성할 수 있습니다." });
    }

    try {
        const createdPost = await Post.create({
            title: title,
            body: body,
            userId: user._id,
            nickname: user.nickname
        });

        user.posts.push(createdPost._id);
        await user.save();

        res.status(201).json({ message: "게시글이 성공적으로 등록되었습니다." });
    } catch (error) {
        res.status(500).json({ error: "게시글 등록 중 서버 오류가 발생했습니다." });
    }
});


const getEditPost = asyncHandler(async (req, res) => {
    const locals = { title : "게시물 편집"};
    const data = await Post.findOne( { _id: req.params.postId});
    res.render("editPost", {locals, data, layout : mainLayout});
})

const putEditPost = asyncHandler(async(req, res) => {
    await Post.findByIdAndUpdate(req.params.postId, {
        title : req.body.title,
        body : req.body.body,
    })
    res.redirect("/community/myPosts");
});

const deletePost = asyncHandler(async(req, res) => {
    await Post.deleteOne({ _id:req.params.postId});
    res.redirect("/community/myPosts");
});


//
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


module.exports = {
    getPage,
    getAddPost,
    postAddPost,
    getEditPost,
    putEditPost,
    deletePost,
    getMyPosts,
    verifyToken,
    getPosts
};