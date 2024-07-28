const asyncHandler = require("express-async-handler");
const mainLayout = "../views/layouts/main.ejs";

const getRecord = asyncHandler(async (req,res)=>{
    res.render("record",{layout: mainLayout});
})

module.exports = {
    getRecord
};