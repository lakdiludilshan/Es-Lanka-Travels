const express = require("express");
const { errorHandler } = require("../utils/error");
const Place = require("../models/placeModel");

// Create a new place
const createPlace = async (req, res, next) => {
  try {
    const { name, location, category, description, imageUrl, coordinates, budget } = req.body;

    // Basic Validation
    if (!name || !location || !category || !coordinates || !budget) {
      return next(errorHandler(400, "All fields are required!"));
    }

    if (!coordinates.lat || !coordinates.lng) {
      return next(errorHandler(400, "Valid coordinates are required!"));
    }

    if (!budget.adult || !budget.child) {
      return next(errorHandler(400, "Valid budget for adult and child is required!"));
    }

    // Check if the user is an admin
    if (!req.user.isAdmin) {
      return next(errorHandler(403, "Only admins can add places."));
    }

    // Create a new place object
    const newPlace = new Place({
      name,
      location,
      category,
      description,
      imageUrl, // Make sure imageUrl is properly set (maybe from Firebase or file upload)
      coordinates,
      budget,
    });

    // Save the new place to the database
    await newPlace.save();

    // Send back the created place
    return res.status(201).json({
      message: "Place created successfully!",
      place: newPlace,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return next(errorHandler(500, "Internal Server Error"));
  }
};


// Get all places
const getPlaces = async (req, res) => {
  try {
    const places = await Place.find(); // Fetch all places
    res.json({ places }); // Return all places
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Get places by category
const getPlacesByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const places = await Place.find({ category });
    res.status(200).json(places);
  } catch (error) {
    next(error);
  }
};

// Get a single place by ID
const getPlaceById = async (req, res, next) => {
  try {
    const place = await Place.findById(req.params.placeId);
    if (!place) {
      return next(errorHandler(404, "Place not found"));
    }
    res.status(200).json(place);
  } catch (error) {
    next(error);
  }
};

// Edit a place
const editPlace = async (req, res, next) => {
  try {
    const place = await Place.findById(req.params.placeId);
    if (!place) {
      return next(errorHandler(404, "Place not found"));
    }

    if (!req.user.isAdmin) {
      return next(errorHandler(403, "Only admins can edit places."));
    }

    const updatedPlace = await Place.findByIdAndUpdate(
      req.params.placeId,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedPlace);
  } catch (error) {
    next(error);
  }
};

// Delete a place
const deletePlace = async (req, res, next) => {
  try {
    const place = await Place.findById(req.params.placeId);
    if (!place) {
      return next(errorHandler(404, "Place not found"));
    }

    if (!req.user.isAdmin) {
      return next(errorHandler(403, "Only admins can delete places."));
    }

    await Place.findByIdAndDelete(req.params.placeId);
    res.status(200).json("Place deleted successfully");
  } catch (error) {
    next(error);
  }
};

// Get paginated places
const getPaginatedPlaces = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const sortDirection = req.query.sort === "desc" ? -1 : 1;

    const places = await Place.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPlaces = await Place.countDocuments();

    res.status(200).json({ places, totalPlaces });
  } catch (error) {
    next(error);
  }
};

// Add Rating to a Place
const addRating = async (req, res, next) => {
  try {
    const { rating } = req.body;
    const place = await Place.findById(req.params.placeId);

    if (!place) {
      return next(errorHandler(404, "Place not found"));
    }

    if (rating < 1 || rating > 5) {
      return next(errorHandler(400, "Rating must be between 1 and 5"));
    }

    // Ensure ratings object exists
    if (!place.ratings) {
      place.ratings = {
        averageRating: 0,
        ratingCount: 0,
      };
    }

    const currentCount = place.ratings.ratingCount;
    const currentAvg = place.ratings.averageRating;

    const newTotal = currentCount + 1;
    const newAvg = ((currentAvg * currentCount) + rating) / newTotal;

    place.ratings.ratingCount = newTotal;
    place.ratings.averageRating = newAvg;

    await place.save();

    res.status(200).json({ message: "Rating added", place });
  } catch (error) {
    console.error("Error in addRating:", error);
    next(error); // Pass error to error-handling middleware
  }
};


module.exports = {
  createPlace,
  getPlaces,
  getPlacesByCategory,
  getPlaceById,
  editPlace,
  deletePlace,
  getPaginatedPlaces,
  addRating,
};
