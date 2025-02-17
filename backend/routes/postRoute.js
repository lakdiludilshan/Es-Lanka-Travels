const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
const {createPost ,getPosts} = require("../controllers/postController");


router.post('/create', requireAuth, createPost);
router.get('/getposts', getPosts);

module.exports = router;