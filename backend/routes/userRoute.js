const express = require("express");
const mongoose = require("mongoose");
const { signup, login, logout, checkAuth } = require("../controllers/userController");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.get("/checkauth", requireAuth, checkAuth);

module.exports = router;

