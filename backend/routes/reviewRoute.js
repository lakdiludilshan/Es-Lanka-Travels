const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const router = express.Router();
const {
  createReview,
  getHotelReviews,
  likeReview,
  editReview,
  deleteReview,
  getReviews,
} = require("../controllers/reviewController");

router.post("/create", requireAuth, createReview);
router.get("/gethotelreviews/:hotelId", getHotelReviews);
router.put("/likereview/:reviewId", requireAuth, likeReview);
router.put("/editreview/:reviewId", requireAuth, editReview);
router.delete("/deletereview/:reviewId", requireAuth, deleteReview);
router.get("/getreviews", requireAuth, getReviews);

module.exports = router;
