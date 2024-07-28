const asyncHandler = require("express-async-handler");
const mainLayout = "../views/layouts/main.ejs";

const getHome = asyncHandler(async (req,res)=>{
    res.render("home",{layout: mainLayout});
})

module.exports = {
    getHome
};