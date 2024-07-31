const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        require: true,
        unique: true
    },
    password:{
        type: String,
        require: true
    },
    runnings: [{type: mongoose.Types.ObjectId, required:true, ref: 'Running'}]
});

module.exports = mongoose.model("User",userSchema);