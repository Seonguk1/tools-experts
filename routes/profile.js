const express = require("express");
const { updateProfile, getUserInfo } = require("../controllers/profileController");
const router = express.Router();

// 프로필 업데이트 라우트
router.post("/update-profile", updateProfile);

router.route("/").get(getUserInfo);

module.exports = router;
