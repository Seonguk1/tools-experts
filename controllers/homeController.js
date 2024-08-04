const asyncHandler = require("express-async-handler");
const mainLayout = "../views/layouts/main.ejs";

const getHome = asyncHandler(async (req,res)=>{
    const locals = {
        title:"Home",
    }
    res.render("home",{locals, layout: mainLayout});
})

module.exports = {
    getHome
};