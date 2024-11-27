const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const mainLayout = "../views/layouts/main.ejs";
const jwtSecret = "your_jwt_secret"; // 실제 JWT 비밀 키로 교체 필요

// 홈 페이지 라우트
const getHome = asyncHandler(async (req, res) => {
    // const token = req.cookies.token;
    // console.log("Token received:", token); // 토큰 존재 여부 확인

    // if (!token) {
    //     console.log("No token found, redirecting to /login"); // 토큰이 없을 때 로그
    //     return res.redirect("/login"); // return 추가
    // } else {
    //     try {
    //         const decoded = jwt.verify(token, jwtSecret);
    //         console.log("Token decoded successfully, userID:", decoded.id); // 토큰 디코딩 성공 시 로그
    //         req.userID = decoded.id;
    //     } catch (error) {
    //         console.log("Token verification failed, redirecting to /login", error); // 토큰 검증 실패 시 로그
    //         return res.redirect("/login"); // return 추가
    //     }
    // }
    
    // console.log("Rendering home page"); // 홈 페이지 렌더링 직전 로그
    const locals = {
        title: "Home",
    };
    return res.render("home", { locals, layout: mainLayout }); // return 추가
});

module.exports = {
    getHome: [getHome] // verifyToken을 getHome에 적용
};
