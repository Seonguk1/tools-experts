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
        require: true,
        unique: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
      },
    age:{
        type: Number,
        require: true
    },
    height:{
        type: Number,
        require: true
    },
    weight:{
        type: Number,
        require: true
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId, // 친구 목록은 ObjectId 타입이어야 합니다
        ref: 'User'
    }],
    
    runnings: [{
        type: mongoose.Types.ObjectId,  
        ref: 'Running'
    }],
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