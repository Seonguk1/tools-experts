const express = require("express");
const router = express.Router();
const { 
    getStart1, 
    postStart1, 
    getStart2, 
    postStart2, 
    getStart3, 
    postStart3 
} = require('../controllers/registerController');

router.get('/start_1', getStart1);
router.post('/start_1', postStart1);
router.get('/start_2', getStart2);
router.post('/start_2', postStart2);
router.get('/start_3', getStart3);
router.post('/start_3', postStart3);

module.exports = router;