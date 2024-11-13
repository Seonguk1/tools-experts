const mongoose = require('mongoose');
const commentSchema = mongoose.Schema(
    {
        post: {
            type : mongoose.Schema.Types.ObjectId,
            ref: 'Post',
            require: true,
        }, // 어느게시물에 속하는지
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
          }, // 댓글의 작성자
        parentComment: { // 1
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
          }, // 어떤 댓글에 대한 대댓글인지
        text: { // text 필수이다 ~~
            type: String,
            required: true,  
          },
        depth: {
            type: Number,
            default: 1,
          }, // 1, 2로 댓글, 대댓글, 대대댓글..? 을 구분함
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
    { toObject: { virtuals: true }, toJSON: { virtuals: true } }, // 내부와 외부, 2가지 방법이 있다
);
//댓글은 부모만 DB에 저장하고, 대댓글들은 가상필드에서 가져온다
commentSchema.virtual('comments', { // 부모 댓글에 대한 대댓글 가져오기
    ref: 'Comment',
    localField: '_id', // 댓글의 _id
    foreignField: 'parentComment', //부모 댓글 -> 부모댓글 = _id(아이디 부여)
  });

  commentSchema
  .virtual('childComments') // 가상필드 정의
  .get(function () { // getter 메서드 - 가상필드이기 때문에 Db에 저장은 안됨
    return this._childComments;
  })
  .set(function (v) { //setter 메서드 - 외부에서 childComments에 값 할당 이후, _childComments에 저장
    this._childComments = v;
  });

  // commentSchema.pre('save', function(next) {
  //   this.updatedAt = Date.now();
  //   next();
// }); // 저장할 때 마다 시간 저장

  module.exports = mongoose.model('Comment', commentSchema);