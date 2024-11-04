const express = require("express");
const router = express.Router(); 
const {createComment} 
= require("../controllers/commentController");
const auth = require('../middlewares/auth');       // 로그인 인증 미들웨어
const checkPostId = require('../middlewares/checkPostId');  // 게시물 ID 확인 미들웨어

router.post('/:id/addcomment', auth, checkPostId, createComment);

module.exports = router;