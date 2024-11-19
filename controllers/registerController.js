const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const startLayout ="../views/layouts/start.ejs";

const getStart1 = (req, res) => {
    res.render("start_1",{layout:startLayout});
};

const postStart1 = asyncHandler(async (req, res) => {
    const { realname, birthdate, phone, address } = req.body;
    req.session.realname = realname;
    req.session.birthdate = birthdate;
    req.session.phone = phone;
    req.session.address = address;

    res.redirect('/start_2');
});

const getStart2 = (req, res) => {
    res.render("start_2",{layout:startLayout});
};

const postStart2 = asyncHandler(async (req, res) => {
    const { height, weight, gender } = req.body;
    req.session.height = height;
    req.session.weight = weight;
    req.session.gender = gender;

    res.redirect('/start_3');
});

const getStart3 = (req, res) => {
    res.render("start_3",{layout:startLayout});
};

const postStart3 = asyncHandler(async (req, res) => {
    const { email, password, password2, nickname } = req.body;
    
    // 세션에서 이전 단계에서 저장한 정보 가져오기
    const { realname, birthdate, phone, address, height, weight, gender } = req.session;

        // email을 비교하여 user가 이미 존재하는지 확인
        let user = await User.findOne({ email });
              if (user) {
          return res
            .status(400)
            .json({ errors: [{ msg: "User already exists" }] });
        }

    // 비밀번호 확인 처리
    if (password !== password2) {
        return res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
        realname,
        email,
        password: hashedPassword, // 암호화된 비밀번호
        nickname,
        birthdate,
        phone,
        address,
        height,
        weight,
        gender,
    });

    // 성공적으로 회원가입이 완료된 후 start_4 페이지로 리디렉션
    res.redirect('/start_4');
});

module.exports = {
    getStart1,
    postStart1,
    getStart2,
    postStart2,
    getStart3,
    postStart3,
};