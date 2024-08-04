const asyncHandler = require("express-async-handler");
const mainLayout = "../views/layouts/main.ejs";
const User = require("../models/User");
const bcrypt = require("bcrypt");

const getRegister = asyncHandler(async (req,res)=>{
    const locals = {
        title:"Register",
    }
    res.render("register",{locals, layout:mainLayout})
})

const postRegister = asyncHandler(async (req,res)=>{
    const {email, password, password2, nickname, age, height, weight} = req.body;

        if(password != password2){
            return res.json({message:"비밀번호가 맞지 않습니다."});
        };
        const hashedPassword = await bcrypt.hash(password,10);
        await User.create({
            email : email,
            password : hashedPassword,
            nickname : nickname,
            age : age,
            height : height,
            weight : weight,
        });

        res.render("login",{layout:mainLayout});
})
module.exports = {
    getRegister,
    postRegister,
};