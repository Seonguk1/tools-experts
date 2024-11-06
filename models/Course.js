const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
    name: {
        type: String,
        // required: true,
    },
    course: [{
        la: {
            type: Number,
            required:true,
        },
        ma: {
            type: Number,
            required:true,
        },
    }],
    center: {
        la: {
            type: Number,
            required:true,  
        },
        ma: {   
            type: Number,
            required:true,
        },
    },
    distance:{
        type: Number,
        // required: true,
    },
    description: {
        type: String,
    },
    lineColor:{
        type: String,
    },
    pin:{
        type: Boolean,
    },
    createAt: {
        type: Date,
        default: Date.now() 
    },
    creator: {
        type: mongoose.Types.ObjectId, 
        ref: 'User'
    }
})

module.exports = mongoose.model("Course", CourseSchema);