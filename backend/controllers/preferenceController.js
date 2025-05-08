const Preference = require("../models/preferenceModel.js");
const express = require("express");
const { errorHandler } = require("../utils/error.js");

// Save user preferences
const savePreferences = async (req, res) => {
  try {
    const preference = new Preference(req.body);
    await preference.save();
    res.status(201).json({ message: "Preferences saved!", preference });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all user preferences (admin)
const getAllPreferences = async (req, res) => {
  try {
    const preferences = await Preference.find();
    res.json(preferences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get preferences by user email
const getUserPreferences = async (req, res) => {
  try {
    const preferences = await Preference.findOne({ email: req.params.email });
    if (!preferences) {
      return res.status(404).json({ message: "No preferences found" });
    }
    res.json(preferences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSuggestedPlaces = async (req, res) => {

  const { location, category, minBudget, maxBudget, minRating } = req.query;

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
};

module.exports = { savePreferences, getAllPreferences, getUserPreferences, getSuggestedPlaces };