const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const mainLayout = "../views/layouts/main.ejs";
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

const getUserInfo = asyncHandler(async (req, res) => {
    const token = req.cookies.token; // 쿠키에서 토큰 가져오기
    if (!token) {
        return res.redirect("/login"); // 토큰 없으면 로그인 페이지로 리다이렉트
    }

    // 토큰 검증
    const jwtSecret = process.env.JWT_SECRET; // 환경변수에서 JWT 비밀키 가져오기
    let userID;
    try {
        const decoded = jwt.verify(token, jwtSecret); // 토큰 디코딩
        userID = decoded.id; // 사용자 ID 추출
    } catch (err) {
        console.error("JWT 검증 실패:", err);
        return res.redirect("/login"); // 유효하지 않은 토큰 처리
    }

    // 사용자 조회
    const user = await User.findById(userID).select(
        "realname birthdate phone address height weight gender email nickname runningArea goalDistance"
    ); // 필요한 필드만 선택
    if (!user) {
        console.error("사용자를 찾을 수 없습니다.");
        return res.redirect("/login"); // 사용자 존재 여부 확인
    }

    // 사용자 정보를 렌더링에 전달
    res.render("information", {
        title: "사용자 정보",
        user: {
            nickname: user.nickname || "미입력",
            runningArea: user.runningArea || "미입력",
            goalDistance: user.goalDistance || "미입력",
            realname: user.realname || "미입력",
            birthdate: user.birthdate
                ? user.birthdate.toLocaleDateString("ko-KR")
                : "미입력",
            phone: user.phone || "미입력",
            address: user.address || "미입력",
            height: user.height || "미입력",
            weight: user.weight || "미입력",
            gender:
                user.gender === "Male"
                    ? "남성"
                    : user.gender === "Female"
                    ? "여성"
                    : "기타",
            email: user.email || "미입력",
        },
        layout: mainLayout,
    });
});

module.exports = { getUserInfo };



// 프로필 업데이트 컨트롤러
const updateProfile = asyncHandler(async (req, res) => {
    const { field, value } = req.body;

    // 인증된 사용자만 수정 가능
    const user = await User.findById(req.userID);
    if (!user) {
        return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    // 필드 업데이트
    user[field] = value;
    await user.save();

    res.status(200).json({ message: "프로필이 성공적으로 업데이트되었습니다." });
});

module.exports = {
    updateProfile, getUserInfo
};
