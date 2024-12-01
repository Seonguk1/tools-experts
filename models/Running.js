const mongoose = require("mongoose");

const runningSchema = new mongoose.Schema({
    timestamp: [{
        start: { type: Date, required: true },
    end: { type: Date, required: true }
    }],
    location: [{
        latitude: {
            type: Number,
            // required: true
        },
        longitude: {
            type: Number,
            // required: true
        }
    }],
    distance:{
        type: Number,
        // required: true
    },
    score: {
        type: Number,
        // required: true
    },
    avg_pace: {
        type: Number,
    },
    calorie: {
        type: Number,
    },
    taken_time: {
        type: Number,
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
    ,
    week_of_year: {
        type: Number,
        required: true
    },
    month: {
        type: Number,
        required: true
    },
    year: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("Running", runningSchema);

