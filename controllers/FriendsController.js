const asyncHandler = require("express-async-handler");
const mainLayout = "../views/layouts/main.ejs";
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

const addFriends = asyncHandler(async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        res.redirect("/login");
    } else {
        try {
            const decoded = jwt.verify(token, jwtSecret);
            req.userID = decoded.id;

            // 현재 로그인한 사용자 정보를 가져옴
            const user = await User.findById(req.userID);

            const locals = {
                title: "Friends List",
                nickname: user.nickname, // 닉네임을 locals에 추가
            };

            const friends = {};

            res.render("find_friends", { locals, friends, layout: mainLayout });
        } catch (error) {
            res.redirect("/login");
        }
    }
});


const searchFriends = asyncHandler(async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        res.redirect("/login");
    } else {
        try {
            const decoded = jwt.verify(token, jwtSecret);
            req.userID = decoded.id;

            // 현재 로그인한 사용자 정보를 가져옴
            const user = await User.findById(req.userID);

            const { friend } = req.body;
            const users = await User.find();
            const friends = [];

            users.forEach(nick => {
                if (req.userID != nick._id) {
                    if (nick.nickname.indexOf(friend) != -1) {
                        friends.push(nick.nickname);
                    }
                }
            });
            

            res.render("find_friends", {
                locals: { title: "Friends List", nickname: user.nickname }, // 닉네임 추가
                friends,
                layout: mainLayout,
            });
        } catch (error) {
            res.redirect("/login");
        }
    }
});


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


const getFriends = asyncHandler(async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect("/login");
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.userID = decoded.id;

        const user = await User.findById(req.userID);
        if (!user) {
            return res.redirect("/login");
        }

        // 친구 목록 데이터 생성
        const friendsList = [];
        for (let i = 0; i < user.friends.length; i++) {
            const friend = await User.findById(user.friends[i]);
            if (friend) {
                friendsList.push({
                    nickname: friend.nickname,
                    location: friend.address || "Unknown", // 위치 정보가 없으면 기본값
                });
            }
        }

        // EJS 템플릿으로 데이터 전달
        res.render("friends_list", {
            title: "Friends List",
            friendsList,
            layout: mainLayout
        });
    } catch (error) {
        console.error("Error fetching friends list:", error);
        return res.redirect("/login");
    }
});


// 기본 페이지 핸들러
const getHome = asyncHandler(async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect("/login");
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.userID = decoded.id;

        const user = await User.findById(req.userID);
        if (!user) {
            return res.redirect("/login");
        }

        const friendsList = [];
        for (let i = 0; i < user.friends.length; i++) {
            const friend = await User.findById(user.friends[i]);
            if (friend) {
                friendsList.push({ nickname: friend.nickname });
            }
        }

        const locals = {
            title: "Home",
            nickname: user.nickname,
        };

        res.render("friends", { locals, friendsList, layout: mainLayout });
    } catch (error) {
        return res.redirect("/login");
    }
});

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
    deleteFriends,
    getHome,
};