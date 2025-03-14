import express from "express";
import {
  savePreferences,
  getAllPreferences,
  getUserPreferences,
} from "../controllers/preferenceController.js";

const router = express.Router();

router.post("/", savePreferences); // Save user preferences
router.get("/", getAllPreferences); // Admin can view all preferences
router.get("/:email", getUserPreferences); // Fetch preferences by email

export default router;
