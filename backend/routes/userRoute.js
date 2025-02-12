const express = require("express");
const mongoose = require("mongoose");
const { signup, login, google, logout, checkAuth, updateUser } = require("../controllers/userController");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");

router.post("/signup", signup);
router.post("/login", login);
router.post("/google", google);
router.get("/logout", logout);
router.get("/checkauth", checkAuth);
router.put("/update/:_id" ,  requireAuth, updateUser);


module.exports = router;

