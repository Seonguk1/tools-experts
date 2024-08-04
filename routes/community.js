const express = require("express");
const router = express.Router(); 
const {getCommunity, postCommunity, getAddPost, postAddPost, getEditPost, putEditPost, deletePost} = require("../controllers/communityController");
router
    .route("/community")
    .get(getCommunity);

router.route("/post/:id")
.get(postCommunity);

router.route("/add").get(getAddPost).post(postAddPost);

router.route("/edit/:id").get(getEditPost).put(putEditPost);

router.route("/delete/:id").delete(deletePost);

module.exports = router;
