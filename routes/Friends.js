const express = require("express")
const router = express.Router();
const{
    getFriends, 
    searchFriends,
    addFriends, 
    requestFriends, 
    putFriends,
    deleteFriends,
    getHome
    } = require("../controllers/FriendsController");

router.route("/friendslist").get(getFriends);

router.route("/").get(getHome);


    

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