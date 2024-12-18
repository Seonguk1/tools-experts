const Comment = require('../models/Comment');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 댓글 작성
const createComment = asyncHandler(async (req, res) => {
  try {
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

      const { content, postId } = req.body;
      if (!content || !postId) {
          return res.status(400).json({ error: '내용과 게시물 ID가 필요합니다.' });
      }

      const comment = await Comment.create({ content, postId, userId: user._id });

      // 디버깅 로그를 여기로 이동
     

      res.status(201).json(comment);
  } catch (error) {
      console.error('댓글 작성 에러:', error);
      res.status(401).json({ error: error.message });
  }
});


// 특정 게시물 댓글 조회
const getCommentsByPost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const page = parseInt(req.query.page) || 1; // 현재 페이지 (기본값 1)
  const limit = parseInt(req.query.limit) || 4; // 페이지당 댓글 수 (기본값 4)
  const skip = (page - 1) * limit; // 건너뛸 댓글 수

  try {
      // 총 댓글 수
      const totalComments = await Comment.countDocuments({ postId });

      // 현재 페이지의 댓글 가져오기
      const comments = await Comment.find({ postId })
          .populate('userId', 'nickname')
          .sort({ created_at: -1 }) // 최신순 정렬
          .skip(skip) // 건너뛰기
          .limit(limit); // 페이지당 댓글 수

      // 페이지네이션 정보 생성
      const pagination = {
          totalComments,
          totalPages: Math.ceil(totalComments / limit),
          currentPage: page,
      };

      // 응답
      res.status(200).json({
          comments,
          pagination,
      });
  } catch (error) {
      console.error('Error fetching comments:', error);
      res.status(500).json({ error: '댓글을 가져오는 중 오류가 발생했습니다.' });
  }
});

// 댓글 수정
const updateComment = asyncHandler(async (req, res) => {
    try {
        const { commentId } = req.params;
        const { content } = req.body;
        const user = await authenticateUser(req);

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ error: '댓글을 찾을 수 없습니다.' });
        }

        if (comment.userId.toString() !== user._id.toString()) {
            return res.status(403).json({ error: '댓글을 수정할 권한이 없습니다.' });
        }

        comment.content = content;
        await comment.save();

        res.status(200).json(comment);
    } catch (error) {
        console.error('댓글 수정 에러:', error);
        res.status(401).json({ error: error.message });
    }
});

// 댓글 삭제
const deleteComment = asyncHandler(async (req, res) => {
    try {
        const { commentId } = req.params;
        const user = await authenticateUser(req);

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ error: '댓글을 찾을 수 없습니다.' });
        }

        if (comment.userId.toString() !== user._id.toString()) {
            return res.status(403).json({ error: '댓글을 삭제할 권한이 없습니다.' });
        }

        await comment.deleteOne();

        res.status(204).send();
    } catch (error) {
        console.error('댓글 삭제 에러:', error);
        res.status(401).json({ error: error.message });
    }
});

module.exports = {
    createComment,
    getCommentsByPost,
    updateComment,
    deleteComment,
};
