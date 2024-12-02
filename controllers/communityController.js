const express = require("express");
const asyncHandler = require("express-async-handler");
const mongoose = require('mongoose');
const mainLayout = "../views/layouts/main.ejs";
const Post = require("../models/Post"); 
const User = require("../models/User");
const Comment = require('../models/Comment');

const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

const getPage = asyncHandler(async (req, res, next) => {
    const currentPage = parseInt(req.query.page) || 1; // 현재 페이지 번호
    const postsPerPage = 5; // 페이지당 게시글 수

    try {
        const totalPosts = await Post.countDocuments(); // 총 게시글 수
        const totalPages = Math.ceil(totalPosts / postsPerPage); // 총 페이지 수 계산

        // 현재 페이지에 해당하는 게시글 가져오기
        const posts = await Post.find()
            .sort({ created_at: -1 }) // 최신순 정렬
            .skip((currentPage - 1) * postsPerPage) // 스킵
            .limit(postsPerPage) // 제한
            .populate('userId', 'nickname'); // 작성자 닉네임 포함

        // 페이지네이션 데이터 생성
        const pagination = {
            totalPosts,
            totalPages,
            currentPage,
        };

        // 데이터를 요청 객체(req)에 추가
        req.pageData = {
            data: posts || [], // 데이터가 없으면 빈 배열
            pagination: pagination || {}, // 페이지네이션이 없으면 빈 객체
        };

        // 다음 미들웨어 호출
        next();
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).render('error', {
            message: '게시글을 가져오는 중 오류가 발생했습니다.',
            layout: mainLayout,
        });
    }
});

const getTopPost = asyncHandler(async (req, res) => {
    try {
        const topPost = await Post.findOne()
            .sort({ likes: -1, created_at: -1 })
            .populate('userId', 'nickname');

        if (!topPost) {
            return res.status(404).render('error', {
                message: 'No posts found',
                layout: mainLayout,
            });
        }

        // `getPage`에서 전달된 데이터 가져오기
        const { data: posts = [], pagination = {} } = req.pageData || {};

        const locals = {
            title: 'Community',
        };

        res.render('community', {
            post: topPost, // 인기 게시물
            data: posts, // 최신 게시글
            pagination, // 페이지네이션 데이터
            locals, // 페이지 메타데이터
            layout: mainLayout,
        });
    } catch (error) {
        console.error('Error fetching top post:', error);
        res.status(500).render('error', {
            message: 'An error occurred while fetching the top post.',
            layout: mainLayout,
        });
    }
});

const getPosts = asyncHandler(async (req, res) => {
    const locals = { title: "게시물" };
 
    // await를 사용해 데이터를 가져옴
    const data = await Post.findOne({ _id: req.params.postId }).populate('userId', 'nickname');
    
 
    // 렌더링 시 data를 전달
    res.render("writer", { locals, data, layout: mainLayout });
 });
 
 const getMyPosts = asyncHandler(async (req, res) => {
    try {
        // 쿠키에서 토큰 가져오기
        const token = req.cookies.token;
        if (!token) {
            return res.redirect("/login"); // 토큰 없으면 로그인 페이지로 리다이렉트
        }

        // 토큰 검증
        const jwtSecret = process.env.JWT_SECRET; // 환경변수에서 JWT 비밀키 가져오기
        let userID;
        try {
            const decoded = jwt.verify(token, jwtSecret);
            userID = decoded.id; // 토큰에서 사용자 ID 추출
        } catch (err) {
            return res.redirect("/login"); // 토큰이 유효하지 않으면 로그인 페이지로 리다이렉트
        }

        // 사용자 조회
        const user = await User.findById(userID);
        if (!user) {
            return res.redirect("/login"); // 사용자 존재 여부 확인
        }

        // Pagination variables
        const postsPerPage = 5;
        let currentPage = parseInt(req.query.page) || 1;
        currentPage = Math.max(1, currentPage); // 페이지 최소값 1 보장

        // 사용자의 총 게시물 수 계산
        const totalPosts = await Post.countDocuments({ '_id': { $in: user.posts } });
        const totalPages = Math.ceil(totalPosts / postsPerPage);

        // 현재 페이지가 총 페이지보다 클 경우 처리
        if (totalPages > 0) {
            currentPage = Math.min(currentPage, totalPages);
        } else {
            currentPage = 1; // 게시물이 없을 때도 기본 페이지는 1
        }

        // 현재 페이지의 게시물 가져오기 (게시물이 없으면 빈 배열)
        const paginatedPosts = await Post.find({ '_id': { $in: user.posts } })
            .sort({ created_at: -1 })
            .skip((currentPage - 1) * postsPerPage)
            .limit(postsPerPage)
            .populate('userId', 'nickname');

        // Add pagination object
        const pagination = {
            totalPosts,
            totalPages,
            currentPage,
            postsPerPage,
        };

        // 데이터 렌더링
        const locals = {
            title: "MyPosts",
        };

        res.render('myPost', {
            posts: paginatedPosts || [], // 게시물이 없으면 빈 배열로 전달
            pagination,
            locals,
            layout: mainLayout,
            isDeleteMode: false, // 초기 삭제 모드 상태
        });
    } catch (error) {
        console.error("Error fetching user's posts:", error); // 디버깅을 위한 로그
        res.status(500).render("error", { message: "An error occurred while fetching your posts." });
    }
});









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
    try {
        const postId = req.params.postId;
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).render("error", { 
                message: "게시물을 찾을 수 없습니다.", 
                layout: mainLayout 
            });
        }

        const locals = { title: "게시물 편집" };
        res.render("editPost", { locals, data: post, layout: mainLayout });
    } catch (error) {
        console.error("Error fetching post for editing:", error);
        res.status(500).render("error", { 
            message: "게시물을 불러오는 중 오류가 발생했습니다.", 
            layout: mainLayout 
        });
    }
});

const putEditPost = asyncHandler(async (req, res) => {
    try {
        const postId = req.params.postId;

        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            {
                title: req.body.title,
                body: req.body.body,
            },
            { new: true } // 업데이트된 문서를 반환
        );

        if (!updatedPost) {
            return res.status(404).render("error", { 
                message: "수정할 게시물을 찾을 수 없습니다.", 
                layout: mainLayout 
            });
        }

        res.redirect("/community/mypost");
    } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).render("error", { 
            message: "게시물을 수정하는 중 오류가 발생했습니다.", 
            layout: mainLayout 
        });
    }
});


const deletePost = asyncHandler(async (req, res) => {
    const { postIds } = req.body;
    const token = req.cookies.token; // 쿠키에서 토큰 가져오기

    if (!token) {
        return res.status(401).json({ error: '로그인이 필요합니다.' });
    }

    let userId;
    try {
        // 토큰 검증 및 디코딩
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id; // 디코딩된 사용자 ID 가져오기
    } catch (error) {
        return res.status(401).json({ error: '유효하지 않은 토큰입니다.' });
    }

    if (!Array.isArray(postIds) || postIds.length === 0) {
        return res.status(400).json({ error: '삭제할 게시물이 없습니다.' });
    }

    // 사용자가 소유한 게시물인지 확인
    const postsToDelete = await Post.find({ _id: { $in: postIds }, userId });
    if (postsToDelete.length !== postIds.length) {
        return res.status(403).json({ error: '삭제할 권한이 없는 게시물이 포함되어 있습니다.' });
    }

    // 게시물 삭제
    await Post.deleteMany({ _id: { $in: postIds } });

    res.status(200).json({ message: '게시물이 삭제되었습니다.' });
});

module.exports = deletePost;



const toggleLike = async (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized. Please log in.' });
        }

        // JWT 인증
        let userId;
        try {
            const decoded = jwt.verify(token, jwtSecret);
            userId = decoded.id;
        } catch (jwtError) {
            return res.status(401).json({ message: 'Invalid token. Please log in again.' });
        }

        const postId = req.params.id;

        // 게시물 조회
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // 좋아요 상태 확인 및 업데이트
        const likedIndex = post.likedBy.indexOf(userId);
        if (likedIndex === -1) {
            post.likes += 1;
            post.likedBy.push(userId);
        } else {
            post.likes = Math.max(0, post.likes - 1);
            post.likedBy.splice(likedIndex, 1);
        }

        await post.save();

        res.status(200).json({
            likes: post.likes,
            message: 'Toggle like successful',
        });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while toggling like.' });
    }
};





module.exports = {
    getPage,
    getAddPost,
    postAddPost,
    getEditPost,
    putEditPost,
    deletePost,
    getMyPosts,
    getPosts,
    toggleLike,
    getTopPost
};