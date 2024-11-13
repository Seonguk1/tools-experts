const startLayout = "../views/layouts/start.ejs";
const asyncHandler = require("express-async-handler");

const getStart = asyncHandler(async (req,res)=>{
    const locals = {title:"start"};
    res.render("start",{locals,layout:startLayout});
});

const getStart1 = asyncHandler(async (req,res)=>{
    const locals = {title:"start1"};
    res.render("start_1",{locals,layout:startLayout});
});

const getStart2 = asyncHandler(async (req,res)=>{
    const locals = {title:"start2"};
    res.render("start_2",{locals,layout:startLayout});
});

const getStart3 = asyncHandler(async (req,res)=>{
    const locals = {title:"start3"};
    res.render("start_3",{locals,layout:startLayout});
});

const getStart4 = asyncHandler(async (req,res)=>{
    const locals = {title:"start4"};
    res.render("start_4",{locals,layout:startLayout});
});

module.exports = {getStart,getStart1,getStart2,getStart3,getStart4};