const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const mainLayout = "../views/layouts/main.ejs";
const jwtSecret = process.env.JWT_SECRET;


// 홈 페이지 라우트
const getHome = asyncHandler(async (req, res) => {
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
    
    const locals = {
        title: "Home",
    };
    res.render("home", { locals, layout: mainLayout });
});

module.exports = {
    getHome: [getHome] // verifyToken을 getHome에 적용
};
