const asyncHandler = require("express-async-handler");
const mainLayout = "../views/layouts/main.ejs";

const getCommunity = asyncHandler(async (req,res)=>{
    res.render("community",{layout: mainLayout});
})

module.exports = {
    getCommunity
};