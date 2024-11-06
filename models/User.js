const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        require: true,
        unique: true
    },
    password:{
        type: String,
        require: true
    },
    nickname:{
        type: String,
        // require: true,
        // unique: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        //required: true
      },
    age:{
        type: Number,
        // require: true
    },
    height:{
        type: Number,
        // require: true
    },
    weight:{
        type: Number,
        // require: true
    },
    runningTemp:{
        type: Number,
    },
    residence:{
        type: String,
    },
    runningArea:{
        type: String,
    },
    goalDistance:{
        type: Number,
    },
    friends: [{
        type: mongoose.Types.ObjectId,
    }],
    runnings: [{
        type: mongoose.Types.ObjectId,  
        ref: 'Running'
    }],
    courses: [{
        type: mongoose.Types.ObjectId,  
        ref: 'Course'
    }],
    posts: [{
        type: mongoose.Types.ObjectId, 
        // required:true, 
        ref: 'Post'}]
    });

    userSchema.virtual('comments', {
        ref: 'Comment',
        localField: '_id',
        foreignField: 'author',
      });

    userSchema.set('toObject', { virtuals: true }); //  Mongoose 문서를 일반 JavaScript 객체로 변환할 때, 가상 필드도 포함되도록
    userSchema.set('toJSON', { virtuals: true }); // Mongoose 문서를 JSON으로 변환할 때 가상 필드를 포함

    userSchema.pre('remove', async function (next){
        const user = this; // 제거되는 사용자의 정보를 사용
        try {
            await Post.deleteMany({ userId: user._id}); // userId가 이 유저의 _id로 가지는 사람
            next();
        } catch(e) {
            next();
        }
    });

// pre-save 미들웨어를 사용하여 친구 목록에 자기 자신을 추가
userSchema.pre('save', function(next) {
    if (this.isNew) {
        // 새로운 사용자일 경우에만 자기 자신을 친구 목록에 추가
        this.friends.push(this._id);
    }
    next();
});

module.exports = mongoose.model("User",userSchema);