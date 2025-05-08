const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const {
  createHotel,
  getHotels,
  getHotelById,
  getHotelsByCategory,
  editHotel,
  deleteHotel,
  getPaginatedHotels,
  addHotelRating,
} = require("../controllers/hotelController");

const router = express.Router();

// Public routes
router.get("/all", getHotels);
router.get("/category/:category", getHotelsByCategory);
router.get("/paginated", getPaginatedHotels); // No need for auth to view paginated list
router.get("/:hotelId", getHotelById);

// Protected routes
router.post("/create", requireAuth, createHotel);
router.put("/edit/:hotelId", requireAuth, editHotel);
router.delete("/delete/:hotelId", requireAuth, deleteHotel);
router.post("/:hotelId/rate", requireAuth, addHotelRating);

module.exports = router;
