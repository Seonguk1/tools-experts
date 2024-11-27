require("dotenv").config();
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

const postLogin = asyncHandler(async(req, res) => {
    const { email, password } = req.body;   
    const user = await User.findOne({ email });
    
    if (!user) {
        console.log("Login failed: No user found with this email"); // 이메일이 존재하지 않을 때 로그 추가
        return res.status(401).json("일치하는 이메일이 없습니다."); // return 추가
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
       
    if (!isValidPassword) {
        console.log("Login failed: Incorrect password"); // 비밀번호가 맞지 않을 때 로그 추가
        return res.status(401).json("비밀번호가 맞지 않습니다."); // return 추가
    }

    const token = jwt.sign({ id: user._id }, jwtSecret);
    console.log("Login successful: Token generated for user", user._id); // 토큰 생성 성공 시 로그 추가
    res.cookie("token", token, { httpOnly: true });

    return res.redirect("/"); // return 추가
});


const getLogout = asyncHandler(async(req,res)=>{
    console.log("User logged out"); // 로그아웃 시 로그 추가
    res.clearCookie("token");
    res.redirect("/");  
})

module.exports = {
    getLogin,
    postLogin,
    getLogout,
};
