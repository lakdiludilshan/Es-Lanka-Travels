const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
const {
  savePreferences,
  getAllPreferences,
  getUserPreferences,
  getSuggestedPlaces,
} = require("../controllers/preferenceController");

// Routes
router.post("/", savePreferences);
router.get("/", getAllPreferences);
router.get("/user/:email", getUserPreferences);
router.post("/recommended-places", getSuggestedPlaces);

module.exports = router; 