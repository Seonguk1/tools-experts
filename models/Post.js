const mongoose = require("mongoose");
const Comment = require('./Comment');

const PostSchema = new mongoose.Schema ({
    title : { type:String, required : true },
    body: { type:String, required : true},
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userId:{type: mongoose.Types.ObjectId, required:true, ref: 'User'},
    completed: { type: Boolean, required: true, default: false },
},
    {timestamps : true});

PostSchema.set('toObject', { virtuals: true });
PostSchema.set('toJSON', { virtuals: true });

PostSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'post',
  });

  PostSchema.pre('remove', async function (next) {
    const post = this;
    try {
      await Comment.deleteMany({ post: post._id });
      next();
    } catch (e) {
      next(e);
    }
  });

module.exports = mongoose.model("Post", PostSchema);