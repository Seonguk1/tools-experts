// const jwt = require('jsonwebtoken');
// const User = require('../models/User');  // 사용자 모델
// const jwtSecret = process.env.JWT_SECRET; // 환경변수로 저장된 JWT 시크릿

//   const auth = (req, res, next) => {
//     // 요청에서 Authorization 헤더를 가져옴
//     const token = req.header('Authorization');
    
//     if (!token) {
//       return res.status(401).json({ error: 'Access denied. No token provided.' });
//     }
  
//     try {
//       // Bearer 부분을 제거하고 토큰만 가져옴
//       const decoded = jwt.verify(token.replace('Bearer ', ''), 'yourSecretKey'); // 시크릿 키는 환경 변수에 저장
//       req.user = decoded; // 디코딩된 사용자 정보를 req.user에 할당
//       next(); // 다음 미들웨어로 넘김
//     } catch (err) {
//       res.status(400).json({ error: 'Invalid token.' });
//     }
//   };

// module.exports = auth;