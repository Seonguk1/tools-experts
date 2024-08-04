const asyncHandler = require("express-async-handler");
const mainLayout = "../views/layouts/main.ejs";

const getCommunity = asyncHandler(async (req,res)=>{
    const locals ={
        title:"Community",
    }
    res.render("community",{localsl, layout: mainLayout});
})

module.exports = {
    getCommunity
};