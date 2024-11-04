const mongoose = require("mongoose");

const runningSchema = new mongoose.Schema({
    timestamp: [{
        type: String,
        required: true
    }],
    location: [{
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        }
    }],
    distance:{
        type: Number,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    creator: {
        type: mongoose.Types.ObjectId,
        // required:true, 
        ref: 'User'
    }
});

module.exports = mongoose.model("Running", runningSchema);

