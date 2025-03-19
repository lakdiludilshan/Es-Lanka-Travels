const express = require("express");
const {errorHandler} = require("../utils/error");
const Place = require("../models/placeModel");

// Create a new place
const createPlace = async (req, res, next) => {
    try {
        const {name, location, category, description, imageUrl, coordinates, budget} = req.body;

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
        res.json({places}); // Return all places
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({message: "Server error"});
    }
};


// Get places by category
const getPlacesByCategory = async (req, res, next) => {
    try {
        const {category} = req.params;
        const places = await Place.find({category});
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
            {new: true}
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
            .sort({createdAt: sortDirection})
            .skip(startIndex)
            .limit(limit);

        const totalPlaces = await Place.countDocuments();

        res.status(200).json({places, totalPlaces});
    } catch (error) {
        next(error);
    }
};

// Add Rating to a Place
const addRating = async (req, res, next) => {
    try {
        const {rating} = req.body; // Rating from 1 to 5
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
        res.status(200).json({message: "Rating added", place});
    } catch (error) {
        next(error);
    }
};


const getSuggestedPlaces = async (req, res) => {
    const { email } = req.query;
    if (!email) {
        return res.status(400).json({ error: "Email is required for filtering" });
    }

    const user = userPreferenceData.find((user) => user.email === email);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

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


const userPreferenceData = [
    {
        name: "John Doe",
        email: "johndoe@example.com",
        destination: "Bali",
        travelDates: {
            start: new Date("2025-06-10"),
            end: new Date("2025-06-20"),
        },
        travelers: 2,
        tripStyles: ["Adventure", "Relaxation"],
        activities: ["Hiking", "Snorkeling"],
        budgetRange: "$$",
        accommodation: "Resort",
        transport: "Rental Car",
        foodPreferences: ["Vegan", "Street Food"],
        specialRequests: ["Kid-Friendly"],
    },
    {
        name: "Alice Smith",
        email: "alice.smith@example.com",
        destination: "Paris",
        travelDates: {
            start: new Date("2025-07-05"),
            end: new Date("2025-07-15"),
        },
        travelers: 1,
        tripStyles: ["Culture", "Luxury"],
        activities: ["Museum Visits", "Wine Tasting"],
        budgetRange: "$$$",
        accommodation: "Luxury Hotel",
        transport: "Public Transport",
        foodPreferences: ["Fine Dining"],
        specialRequests: ["Accessibility"],
    },
    {
        name: "Mike Johnson",
        email: "mike.johnson@example.com",
        destination: "Tokyo",
        travelDates: {
            start: new Date("2025-08-12"),
            end: new Date("2025-08-25"),
        },
        travelers: 3,
        tripStyles: ["Adventure", "Tech Exploration"],
        activities: ["City Tours", "Gaming Arcades"],
        budgetRange: "$$",
        accommodation: "Capsule Hotel",
        transport: "Public Transport",
        foodPreferences: ["Street Food", "Sushi"],
        specialRequests: ["None"],
    },
    {
        name: "Emma Wilson",
        email: "emma.wilson@example.com",
        destination: "Maldives",
        travelDates: {
            start: new Date("2025-09-01"),
            end: new Date("2025-09-10"),
        },
        travelers: 2,
        tripStyles: ["Relaxation", "Luxury"],
        activities: ["Snorkeling", "Spa Retreat"],
        budgetRange: "$$$",
        accommodation: "Overwater Bungalow",
        transport: "Boat Transfer",
        foodPreferences: ["Seafood", "Vegetarian"],
        specialRequests: ["Honeymoon Special"],
    },
];

// module.exports = userPreferenceData;

const placesData = [
    {
        name: "Eiffel Tower",
        location: "Paris, France",
        category: "Landmark",
        description: "An iconic wrought-iron lattice tower in Paris.",
        imageUrl: "https://example.com/eiffel-tower.jpg",
        coordinates: {lat: 48.8584, lng: 2.2945},
        budget: {adult: 25, child: 10},
        ratings: {averageRating: 4.8, ratingCount: 12000},
    },
    {
        name: "Grand Canyon",
        location: "Arizona, USA",
        category: "Natural Wonder",
        description: "A breathtaking canyon carved by the Colorado River.",
        imageUrl: "https://example.com/grand-canyon.jpg",
        coordinates: {lat: 36.1070, lng: -112.1130},
        budget: {adult: 35, child: 15},
        ratings: {averageRating: 4.9, ratingCount: 8000},
    },
    {
        name: "Tokyo Disneyland",
        location: "Tokyo, Japan",
        category: "Theme Park",
        description: "A magical Disneyland experience in Japan.",
        imageUrl: "https://example.com/tokyo-disneyland.jpg",
        coordinates: {lat: 35.6329, lng: 139.8804},
        budget: {adult: 75, child: 50},
        ratings: {averageRating: 4.7, ratingCount: 50000},
    },
    {
        name: "Santorini Beaches",
        location: "Santorini, Greece",
        category: "Beach",
        description: "Famous for stunning sunsets and crystal-clear waters.",
        imageUrl: "https://example.com/santorini-beach.jpg",
        coordinates: {lat: 36.3932, lng: 25.4615},
        budget: {adult: 0, child: 0}, // Free entry
        ratings: {averageRating: 4.6, ratingCount: 3000},
    },
    {
        name: "Colosseum",
        location: "Rome, Italy",
        category: "Historical Site",
        description: "An ancient Roman amphitheater and world-famous landmark.",
        imageUrl: "https://example.com/colosseum.jpg",
        coordinates: {lat: 41.8902, lng: 12.4922},
        budget: {adult: 18, child: 10},
        ratings: {averageRating: 4.9, ratingCount: 25000},
    },
];


module.exports = {
    createPlace,
    getPlaces,
    getPlacesByCategory,
    getPlaceById,
    editPlace,
    deletePlace,
    getPaginatedPlaces,
    addRating,
    placesData,
    userPreferenceData,
    getSuggestedPlaces
};
