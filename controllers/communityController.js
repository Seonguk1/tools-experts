const express = require("express");
const asyncHandler = require("express-async-handler");
const mainLayout = "../views/layouts/main.ejs";
const Post = require("../models/Post"); 

const getCommunity = asyncHandler(async (req,res)=>{
<<<<<<< HEAD
    const locals = {
        title : "Community"
    }
    const data = await Post.find();

    console.log(data);

    res.render("community", {locals, data, layout : mainLayout}) // 게시물 가져오기
=======
    const locals ={
        title:"Community",
    }
    res.render("community",{localsl, layout: mainLayout});
>>>>>>> 4c6d13809f5fafe2911075b26ead2a07f09f87e8
})

const postCommunity = asyncHandler(async (req, res) => {
const data = await Post.findOne({_id : req.params.id});
res.render("post", {data, layout : mainLayout}); // 게시물 보기
})

const getAddPost = asyncHandler(async(req, res) => {
    const locals = {
        title: "게시물 작성"
    }
    res.render("add", {locals, layout: mainLayout});
})

const postAddPost = asyncHandler(async (req, res)=> {
    const {title, body} = req.body;
    const newPost = new Post( { 
        title : title,
        body : body,
    });

    await Post.create(newPost);
    res.redirect("/community");
})

const getEditPost = asyncHandler(async (req, res) => {
    const locals = { title : "게시물 편집"};
    const data = await Post.findOne( { _id: req.params.id});
    res.render("edit", {locals, data, layout : mainLayout});
})

const putEditPost = asyncHandler(async(req, res) => {
    await Post.findByIdAndUpdate(req.params.id, {
        title : req.body.title,
        body : req.body.body,
        createdAt : Date.now()
    })
    res.redirect("/community");
});

const deletePost = asyncHandler(async(req, res) => {
    await Post.deleteOne({ _id:req.params.id});
    res.redirect("/community");
});




// router.get("/add", asyncHandler(async (req, res) => {
//     const locals = {
//         title: "게시물 작성"
//     }
//     res.render("add", {locals, layout : mainLayout});
//     }))


module.exports = {
    getCommunity,
    postCommunity,
    getAddPost,
    postAddPost,
    getEditPost,
    putEditPost,
    deletePost
};