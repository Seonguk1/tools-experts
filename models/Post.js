const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema ({
    title : { type:String, required : true },
    body: { type:String, required : true}, 
    creator:{type: mongoose.Types.ObjectId, required:true, ref: 'User'},
},
    {timestamps : true});

module.exports = mongoose.model("Post", PostSchema);