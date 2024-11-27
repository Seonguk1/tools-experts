const express = require("express");
const router = express.Router();
const { 
    getStart1, 
    postStart1, 
    getStart2, 
    postStart2, 
    getStart3, 
    postStart3,
    getStart4 // 새로 추가할 컨트롤러
} = require('../controllers/registerController');

router.get('/start_1', getStart1);
router.post('/start_1', postStart1);
router.get('/start_2', getStart2);
router.post('/start_2', postStart2);
router.get('/start_3', getStart3);
router.post('/start_3', postStart3);

// 새로 추가된 라우트
router.get('/start_4', getStart4); // getStart4를 통해 start_4 페이지를 처리합니다.

module.exports = router;
