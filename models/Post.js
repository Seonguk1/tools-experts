const mongoose = require("mongoose");
const Comment = require('./Comment');

const PostSchema = new mongoose.Schema ({
  title: { type: String, required: true },
  body: { type: String, required: true },
  userId: { type: mongoose.Types.ObjectId, required: true, ref: 'User' }, // 작성자 ID 참조
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date },
  likes: { type: Number, default: 0 },
  likedBy: [{ type: mongoose.Types.ObjectId, ref: 'User' }]

});

PostSchema.virtual('nickname').get(function() {
  if (this.userId && this.userId.nickname) {
      return this.userId.nickname;
  }
  return '익명';
});

PostSchema.set('toObject', { virtuals: true });
PostSchema.set('toJSON', { virtuals: true });
//가상필드는 DB에 저장되지 않기 때문에, 포함되게 해주는 것
// PostSchema.set('toObject', { virtuals: true });
// PostSchema.set('toJSON', { virtuals: true });

// PostSchema.virtual('comments', { // 가상필드
//     ref: 'Comment', // Comment 참조
//     localField: '_id', // _id(Post)
//     foreignField: 'post',// Comment의 post필드 기준, Post 모델의 _id와 일치하는 모든 댓글 가져옴
//   });

//   PostSchema.pre('remove', async function (next) {  // post 삭제할 때, 게시물과 연결된 댓글들도 삭제하도록 함
//     const post = this;
//     try {
//       await Comment.deleteMany({ post: post._id }); // post = this(이 게시물) -> 연결된 댓글 삭제하자
//       next();
//     } catch (e) {
//       next(e);
//     }
//   });

// PostSchema.methods.createPost = function (text) {
//   const post = new this({
//     title : title,
//     body: body,
//   });
//   return post.save();
// };

module.exports = mongoose.model("Post", PostSchema);