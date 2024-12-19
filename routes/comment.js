const express = require('express');
const { 
    createComment, 
    getCommentsByPost, 
    updateComment, 
    deleteComment 
} = require('../controllers/commentController');

const router = express.Router();

// 댓글 작성
router.post('/', createComment);

// 특정 게시물 댓글 조회
router.get('/:postId', getCommentsByPost);

// 댓글 수정
router.put('/:commentId', updateComment);

// 댓글 삭제
router.delete('/:commentId', deleteComment);

module.exports = router;
