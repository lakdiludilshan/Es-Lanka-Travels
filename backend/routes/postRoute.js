const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
const {createPost , getPosts, deletePost, updatePost} = require("../controllers/postController");


router.post('/create', requireAuth, createPost);
router.get('/getposts', getPosts);
router.delete('/deletepost/:postId/:userId', deletePost);
router.put('/updatepost/:postId/:userId', requireAuth, updatePost);

module.exports = router;