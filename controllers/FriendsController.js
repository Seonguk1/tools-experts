const asyncHandler = require("express-async-handler");
const mainLayout = "../views/layouts/main.ejs";
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

const addFriends = asyncHandler(async (req,res)=>{
    const locals ={
        title:"Friends List",
    }
    const friends = {};

    res.render("addFriends",{locals, friends, layout: mainLayout});
})

const searchFriends = asyncHandler(async (req,res)=>{
    const token = req.cookies.token;
    if (!token) {
        res.redirect("/login");
    } else {
        try {
            const decoded = jwt.verify(token, jwtSecret);
            req.userID = decoded.id;
            
        } catch (error) {
            res.redirect("/login");
        }
    }
    const {friend} = req.body;
    const user = await User.find();
    const friends = [];
    user.forEach(nick=>{
        if( req.userID != nick._id){
            if(nick.email.indexOf(friend) != -1){
                friends.push(nick.nickname);
            }
            else if(nick.nickname.indexOf(friend) != -1){
                friends.push(nick.nickname);
            }
        }
    })
    
    res.render("addFriends", {friends, layout:mainLayout});
})

const requestFriends = asyncHandler(async (req,res)=>{
    const {request} = req.body;
    const token = req.cookies.token;
    if (!token) {
        res.redirect("/login");
    } else {
        try {
            const decoded = jwt.verify(token, jwtSecret);
            req.userID = decoded.id;
            
        } catch (error) {
            res.redirect("/login");
        }
    }
    const user = await User.findById(req.userID);
    const friendUser = await User.findOne({ nickname: request });
    if (!friendUser) {
        return res.send(`Friend with nickname ${request} not found`); // 요청한 친구를 찾지 못한 경우 리디렉션
    }
    if (user.friends.includes(friendUser._id)) {
        return res.send(`${request} is already on your friends list`); // 이미 친구인 경우 리디렉션
    }
    user.friends.push(friendUser._id);
    await user.save();
    res.redirect("/friends");
})

const getFriends = asyncHandler(async (req,res)=>{
    const locals={title:"Friends List"};
    const token = req.cookies.token;
    if (!token) {
        res.redirect("/login");
    } else {
        try {
            const decoded = jwt.verify(token, jwtSecret);
            req.userID = decoded.id;
            
        } catch (error) {
            res.redirect("/login");
        }
    }
    const user = await User.findById(req.userID);
    const friendsList = [];
    for(let i=0;i<user.friends.length;i++){
        if(req.userID != user.friends[i]){
            friendsList.push(await User.findById(user.friends[i]));
        }
    }
    res.render("friends",{locals,friendsList,layout:mainLayout});

})

const putFriends = {}

const deleteFriends = asyncHandler(async (req,res)=>{
    
    const token = req.cookies.token;
    if (!token) {
        res.redirect("/login");
    } else {
        try {
            const decoded = jwt.verify(token, jwtSecret);
            req.userID = decoded.id;
            
        } catch (error) {
            res.redirect("/login");
        }
    }
    const user = await User.findById(req.userID);
    for(let i = 0; i < user.friends.length; i++) {
        console.log(user.friends[i].toString());
        if (user.friends[i].toString() === req.params.id) {
            user.friends.splice(i, 1);
            await user.save();
            return res.redirect("/friends");
        }
    }
})

module.exports = {
    getFriends,
    searchFriends,
    addFriends,
    requestFriends,
    deleteFriends
};