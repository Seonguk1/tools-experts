const express = require("express");
const router = express.Router(); 
const {writeComment, replyComment,
  checkComment, commentController} 
= require("../controllers/commentController");
const Post = require("../models/Post"); 

router.post('/:postId/comments', writeComment);

// 대댓글 생성 (인증 필요)
router.post('/:postId/comments/:commentId/replies', replyComment);

// 댓글 및 대댓글 조회 (인증 필요 없음)
router.get('/:postId/comments', checkComment);


// postId에 해당하는 게시물 찾고, 할당해서 쓰게 해준다 ㅇㅋ
async function checkPostId(req, res, next) {
  try {
      const post = await Post.findOne({ _id: req.params.id }); //

      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }
      res.locals.post = post; // 1
      next();
  } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Post not found' });
  }
}
//테스트


module.exports = router;