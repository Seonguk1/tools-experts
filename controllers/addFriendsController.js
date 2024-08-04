const asyncHandler = require("express-async-handler");
const mainLayout = "../views/layouts/main.ejs";
const User = require("../models/User");

const getAddFriends = asyncHandler(async (req,res)=>{
    const locals ={
        title:"Add Friends",
    }
    const friends = {};

    res.render("addFriends",{locals, friends, layout: mainLayout});
})

const postAddFriends = asyncHandler(async (req,res)=>{
    const {friend} = req.body;
    const user = await User.find();
    const friends = [];
    user.forEach(nick=>{
        if(nick.email.indexOf(friend) != -1){
            friends.push(nick.nickname);
        }
        else if(nick.nickname.indexOf(friend) != -1){
            friends.push(nick.nickname);
        }
    })
    
    res.render("addFriends", {friends, layout:mainLayout});
})

module.exports = {
    getAddFriends,
    postAddFriends
};