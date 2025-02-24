const express = require("express");
const mongoose = require("mongoose");
const requireAuth = require("../middleware/requireAuth");
const router = express.Router();
const {createComment, getPostComments, likeComment} = require("../controllers/commentController");

router.post('/create', requireAuth ,createComment);
router.get('/getpostcomments/:postId', getPostComments);
router.put('/likecomment/:commentId', requireAuth, likeComment)

module.exports = router;