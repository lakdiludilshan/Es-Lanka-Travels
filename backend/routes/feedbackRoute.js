const express = require("express");
const mongoose = require("mongoose");
const requireAuth = require("../middleware/requireAuth");
const router = express.Router();
const {
  createFeedback,
  getPlaceFeedbacks,
  likeFeedback,
  editFeedback,
  deleteFeedback,
  getFeedbacks,
} = require("../controllers/feedbackController");


router.post("/create", requireAuth, createFeedback);
router.get("/getplacefeedbacks/:placeId", getPlaceFeedbacks);
router.put("/likefeedback/:feedbackId", requireAuth, likeFeedback);
router.put("/editfeedback/:feedbackId", requireAuth, editFeedback);
router.delete("/deletefeedback/:feedbackId", requireAuth, deleteFeedback);
router.get("/getfeedbacks", requireAuth, getFeedbacks);

module.exports = router;
