const express = require("express")
const router = express.Router();
const{
    getFriends, 
    searchFriends,
    addFriends, 
    requestFriends, 
    putFriends,
    deleteFriends
    } = require("../controllers/FriendsController");

router
    .route("/")
    .get(getFriends)
    // .put(putFriends)

router
    .route("/add")
    .get(addFriends)
    .post(requestFriends)

router
    .route("/search")
    .post(searchFriends)

router
    .route("/delete/:id")
    .delete(deleteFriends)
module.exports = router;