const Comment = require('../models/Comment');
const Post = require('../models/Post');

const writeComment = async (req, res) => {
    //토큰 검증
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

    try {
        const { text } = req.body;
        const { postId } = req.params;
        const author = req.user._id;  // 사용자 인증이 되어 있는 경우

        const newComment = new Comment({
            post: postId,
            author: author,
            text: text,
            depth: 1,  // 일반 댓글이므로 depth는 1
          });
      
          await newComment.save();
          res.status(201).json(newComment);
        } catch (err) {
          res.status(500).json({ error: err.message });
        }
      }

const replyComment = async (req, res) => {
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



    try {
        const { text } = req.body;
        const { postId, commentId } = req.params;
        const author = req.user._id;  // 사용자 인증이 되어 있는 경우
    
        const newReply = new Comment({
          post: postId,
          author: author,
          text: text,
          parentComment: commentId, // 부모 댓글 ID 설정
          depth: 2,  // 대댓글이므로 depth는 2
        });
    
        await newReply.save();
        res.status(201).json(newReply);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }

    const checkComment = async (req, res) => {
        try {
            const { postId } = req.params;

            const comments = await Comment.find({ post: postId })
              .populate('author', 'username')
              .populate('parentComment', 'text') // 대댓글인 경우 부모 댓글 정보도 가져옴
              .sort('createdAt');
        
            res.json(comments);
          } catch (err) {
            res.status(500).json({ error: err.message });
          }
        }

module.exports = {
    writeComment,
    replyComment,
    checkComment
};