const Post = require('../models/Post');

const checkPostId = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id); //Post모델에 post 해당하는
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.locals.post = post;
    next();
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = checkPostId;

