const express = require("express");
const mongoose = require("mongoose");
const requireAuth = require("../middleware/requireAuth");
const router = express.Router();
const {createComment, getPostComments} = require("../controllers/commentController");

router.post('/create', requireAuth ,createComment);
router.get('/getpostcomments/:postId', getPostComments);

module.exports = router;