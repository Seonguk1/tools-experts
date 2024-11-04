const mongoose = require('mongoose');
const commentSchema = mongoose.Schema(
    {
        post: {
            type : mongoose.Schema.Types.ObjectId,
            ref: 'Post',
            require: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
          },
        parentComment: { // 1
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
          },
        body: { // text
            type: String,
            required: true,
          },
        depth: {
            type: Number,
            default: 1,
          },
        isDeleted: { // 2
            type: Boolean,
            default: false,
          }, // 댓글을 데이터에서 지우는 것이 아니라, 웹사이트 상으로 안보이게 하는 것(고아 방지)
        createdAt: {
            type: Date,
            default: Date.now,
          },
        updatedAt: {
            type: Date,
          },
    },
    { toObject: { virtuals: true }, toJSON: { virtuals: true } },
);

commentSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'parentComment',
  });

  commentSchema.virtual('childComments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'parentComment',
});

  commentSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

  module.exports = mongoose.model('Comment', commentSchema);