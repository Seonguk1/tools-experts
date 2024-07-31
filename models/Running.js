const mongoose = require("mongoose");

const runningSchema = new mongoose.Schema({
    distance:{
        type:String,
        require:true
    },
    time:{
        type:String,
        require:true
    },
    date:{
        type:Date,
        default:Date.now()
    },
    creator:{type: mongoose.Types.ObjectId, required:true, ref: 'User'}
});

module.exports = mongoose.model("Running",runningSchema);