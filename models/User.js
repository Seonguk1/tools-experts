const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    realname: {
        type: String,
        // required: true,
        // unique: true
    },
    nickname: {
        type: String,
        // required: true,
        // unique: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        // required: true
    },
    // age: {
    //     type: Number,
    //     // required: true
    // },
    height: {
        type: Number,
        // required: true
    },
    weight: {
        type: Number,
        // required: true
    },
    birthdate: {
        type: Date,
        required: true, // 생년월일은 필수로 설정
    },
    phone: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                // 전화번호의 형식 검증 (예시: xxx-xxxx-xxxx)
                return /^\d{3}-\d{4}-\d{4}$/.test(v);
            },
            message: props => `${props.value}는 유효한 전화번호가 아닙니다!`
        }
    },
    address: {
        type: String,
        required: true,
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

    // 가상필드(커뮤니티용)
    userSchema.virtual('postList', { 
        ref: 'Post', // Post 모델 참조
        localField: '_id', // 필드 _id가 사용(User)
        foreignField: 'userId', // userId가 사용(Post)
      });

    userSchema.virtual('comments', { // 위와 동일
        ref: 'Comment',
        localField: '_id', 
        foreignField: 'author',
      });

    userSchema.set('toObject', { virtuals: true }); //  Mongoose 문서를 일반 JavaScript 객체로 변환할 때, 가상 필드도 포함되도록
    userSchema.set('toJSON', { virtuals: true }); // Mongoose 문서를 JSON으로 변환할 때 가상 필드를 포함

    userSchema.pre('remove', async function (next){ // 삭제하기 전에(유적 삭제될 때)
        const user = this; // 제거되는 사용자의 정보를 사용
        try {
            await Post.deleteMany({ userId: user._id}); // userId가 이 유저의 _id로 가지는 사람
            next();
        } catch(e) {
            next();
        }
    });

//친구추가
// pre-save 미들웨어를 사용하여 친구 목록에 자기 자신을 추가(친구 추가)
// userSchema.pre('save', function(next) {
//     if (this.isNew) {
//         // 새로운 사용자일 경우에만 자기 자신을 친구 목록에 추가
//         this.friends.push(this._id);
//     }
//     next();
// });

module.exports = mongoose.model("User",userSchema);