const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const {
  createPlace,
  getPlaces,
  getPlacesByCategory,
  getPlaceById,
  editPlace,
  deletePlace,
  getPaginatedPlaces,
  addRating,
  getSuggestedPlaces
} = require("../controllers/placeController");

const router = express.Router();

router.post("/create", requireAuth, createPlace);
router.get("/all", getPlaces);
router.get("/category/:category", getPlacesByCategory);
router.get("/:placeId", getPlaceById);
router.put("/edit/:placeId", requireAuth, editPlace);
router.delete("/delete/:placeId", requireAuth, deletePlace);
router.get("/paginated", requireAuth, getPaginatedPlaces);
router.post("/:placeId/rate", requireAuth, addRating); // ⭐ New rating route
router.post("/recommended-places", getSuggestedPlaces); // ⭐ New rating route

module.exports = router;
