const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
const {createPost} = require("../controllers/postController");

router.post('/create', requireAuth, createPost);

module.exports = router;