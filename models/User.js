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
        required:true, 
        ref: 'Post'}]
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