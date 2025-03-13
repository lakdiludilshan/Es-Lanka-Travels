const express = require("express");
const { errorHandler } = require("../utils/error");
const Place = require("../models/placeModel");

// Create a new place
const createPlace = async (req, res, next) => {
  try {
    const { name, location, category, description, imageUrl, coordinates, budget } = req.body;

    if (!req.user.isAdmin) {
      return next(errorHandler(403, "Only admins can add places."));
    }

    const newPlace = new Place({
      name,
      location,
      category,
      description,
      imageUrl,
      coordinates,
      budget,
    });

    await newPlace.save();
    return res.status(201).json(newPlace);
  } catch (error) {
    return next(error);
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
    const { rating } = req.body; // Rating from 1 to 5
    const place = await Place.findById(req.params.placeId);

    if (!place) {
      return next(errorHandler(404, "Place not found"));
    }

    if (rating < 1 || rating > 5) {
      return next(errorHandler(400, "Rating must be between 1 and 5"));
    }

    // Update ratings
    const newTotalRatings = place.ratingCount + 1;
    const newAverageRating = ((place.averageRating * place.ratingCount) + rating) / newTotalRatings;

    place.ratingCount = newTotalRatings;
    place.averageRating = newAverageRating;

    await place.save();
    res.status(200).json({ message: "Rating added", place });
  } catch (error) {
    next(error);
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
