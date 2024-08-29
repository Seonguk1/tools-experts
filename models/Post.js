const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema ({
    title : { type:String, required : true },
    body: { type:String, required : true}, 
    // author : { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}, //작성자
    creator:{type: mongoose.Types.ObjectId, required:true, ref: 'User'},
    creatAt: { type:Date, default:Date.now()}
})

module.exports = mongoose.model("Post", PostSchema);