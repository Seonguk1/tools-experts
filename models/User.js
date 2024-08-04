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
    
    runnings: [{type: mongoose.Types.ObjectId, required:true, ref: 'Running'}]
});

module.exports = mongoose.model("User",userSchema);