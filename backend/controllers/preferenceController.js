const Preference = require("../models/preferenceModel");
const Place = require("../models/placeModel");

// Save user preferences
const savePreferences = async (req, res) => {
  try {
    const preference = new Preference(req.body);
    await preference.save();
    res.status(201).json(preference);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all preferences
const getAllPreferences = async (req, res) => {
  try {
    const preferences = await Preference.find();
    res.json(preferences);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user preferences
const getUserPreferences = async (req, res) => {
  try {
    const preferences = await Preference.find({ email: req.params.email });
    res.json(preferences);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get suggested places based on preferences
const getSuggestedPlaces = async (req, res) => {
  try {
    const { location, category, minBudget, maxBudget, minRating } = req.query;
    const user = req.body;

    let filter = {};

    if (location) {
      filter.location = { $regex: new RegExp(location, "i") };
    }
    if (category) {
      filter.category = { $regex: new RegExp(category, "i") };
    }
    if (minBudget || maxBudget) {
      filter["budget.adult"] = {};
      if (minBudget) filter["budget.adult"].$gte = parseInt(minBudget);
      if (maxBudget) filter["budget.adult"].$lte = parseInt(maxBudget);
    }
    if (minRating) {
      filter["ratings.averageRating"] = { $gte: parseFloat(minRating) };
    }

    const places = await Place.find(filter);

    const recommendedPlaces = places.filter((place) => {
      return (
        place.location.toLowerCase().includes(user.destination.toLowerCase()) ||
        user.activities.some((activity) =>
          place.category.toLowerCase().includes(activity.toLowerCase())
        )
      );
    });

    res.json({ user, recommendedPlaces });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { savePreferences, getAllPreferences, getUserPreferences, getSuggestedPlaces }; 