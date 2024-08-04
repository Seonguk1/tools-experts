const asyncHandler = require("express-async-handler");
const mainLayout = "../views/layouts/main.ejs";
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;  


const getLogin = asyncHandler(async (req,res)=>{
    const locals = {
        title:"Login",
    }
    res.render("login",{locals, layout:mainLayout})
})

const postLogin = asyncHandler(async(req,res)=>{
    const {email, password} = req.body;
    console.log(password)   
    const user = await User.findOne({email});
    if(!user){
        return res.status(401).json("일치하는 이메일이 없습니다.");
    }

    const isValidPassword = await bcrypt.compare(password,user.password);
       
    if(!isValidPassword){
        return res.status(401).json("비밀번호가 맞지 않습니다.");
    }

    const token = jwt.sign({id: user._id}, jwtSecret);
    res.cookie("token", token, {httpOnly:true});

    res.redirect("/");
})

const getLogout = asyncHandler(async(req,res)=>{
    res.clearCookie("token");
    res.redirect("/");
})

module.exports = {
    getLogin,
    postLogin,
    getLogout,
};