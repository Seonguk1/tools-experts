const jwt = require('jsonwebtoken');
const User = require('../models/User');  // 사용자 모델
const jwtSecret = process.env.JWT_SECRET; // 환경변수로 저장된 JWT 시크릿

const auth = async (req, res, next) => {
  const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    // 토큰 검증
    const decoded = jwt.verify(token, jwtSecret);

    // 사용자 정보 조회 및 req.user에 저장
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'User not found.' });
    }

    req.user = user;  // 사용자 정보 설정
    next();  // 다음 미들웨어 또는 라우터로 이동
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: 'Invalid token.' });
  }
};

module.exports = auth;