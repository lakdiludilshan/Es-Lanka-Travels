const express = require("express");
const mongoose = require("mongoose");
const requireAuth = require("../middleware/requireAuth");
const router = express.Router();
const {createComment} = require("../controllers/commentController");

router.post('/create', requireAuth ,createComment);

module.exports = router;