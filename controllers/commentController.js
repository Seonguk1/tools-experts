const Comment = require('../models/Comment');
const Post = require('../models/Post');

const createComment = async (req, res) => {
    const post = res.locals.post;

    if (!post) {
        return res.status(404).send('Post not found');
    }

    req.body.author = req.user._id; 
    req.body.post = post._id;

    req.body.body = req.body.body.replace(/[\r\n]+/g, ' ').trim();

    // req.body.body를 사용하여 댓글 내용을 가져옴
    if (!req.body.body) {
        return res.status(400).send('Comment body is required');
    }

    try {
        const comment = await Comment.create(req.body);
        return res.redirect(`/community/post/${post._id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};


module.exports = {
    createComment
};