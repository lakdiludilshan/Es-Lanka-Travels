const express = require("express");
const mongoose = require("mongoose");
const requireAuth = require("../middleware/requireAuth");
const router = express.Router();
const {createComment, getPostComments, likeComment, editComment, deleteComment, getComments} = require("../controllers/commentController");

router.post('/create', requireAuth ,createComment);
router.get('/getpostcomments/:postId', getPostComments);
router.put('/likecomment/:commentId', requireAuth, likeComment)
router.put('/editcomment/:commentId', requireAuth, editComment)
router.delete('/deletecomment/:commentId', requireAuth, deleteComment)
router.get('/getcomments', requireAuth, getComments)

module.exports = router;