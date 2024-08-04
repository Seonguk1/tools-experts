const express = require("express")
const router = express.Router();
const{getAddFriends, postAddFriends} = require("../controllers/addFriendsController");

router
    .route("/addFriends")
    .get(getAddFriends)
    .post(postAddFriends)

module.exports = router;