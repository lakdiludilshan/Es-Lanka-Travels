const mongoose = require("mongoose");
const Hotel = require("../models/hotelModel");
const { errorHandler } = require("../utils/error");

// Create a new hotel
const createHotel = async (req, res, next) => {
  try {
    const {
      name,
      location,
      description,
      category,
      imageUrls,
      amenities,
      contactInfo,
      pricing, // expects: { normal: number, deluxe: number }
    } = req.body;

    if (!name || !location) {
      return next(errorHandler(400, "Name and location are required"));
    }

    if (!pricing || typeof pricing.normal !== "number" || typeof pricing.deluxe !== "number") {
      return next(errorHandler(400, "Pricing for both normal and deluxe is required"));
    }

    if (!req.user?.isAdmin) {
      return next(errorHandler(403, "Only admins can add hotels."));
    }

    const newHotel = new Hotel({
      name,
      location,
      description,
      category,
      imageUrls,
      amenities,
      contactInfo,
      pricing,
    });

    await newHotel.save();

    res.status(201).json({
      message: "Hotel created successfully!",
      hotel: newHotel,
    });
  } catch (error) {
    next(errorHandler(500, error.message || "Internal Server Error"));
  }
};

// Get all hotels
const getHotels = async (req, res, next) => {
  try {
    const hotels = await Hotel.find();
    res.status(200).json({ hotels });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

// Get hotel by ID
const getHotelById = async (req, res, next) => {
  try {
    const { hotelId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(hotelId)) {
      return next(errorHandler(400, "Invalid hotel ID"));
    }

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return next(errorHandler(404, "Hotel not found"));
    }

    res.status(200).json(hotel);
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

// Get hotels by category
const getHotelsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const hotels = await Hotel.find({ category });
    res.status(200).json(hotels);
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

// Edit hotel
const editHotel = async (req, res, next) => {
  try {
    const { hotelId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(hotelId)) {
      return next(errorHandler(400, "Invalid hotel ID"));
    }

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return next(errorHandler(404, "Hotel not found"));
    }

    if (!req.user?.isAdmin) {
      return next(errorHandler(403, "Only admins can edit hotels."));
    }

    const updatedHotel = await Hotel.findByIdAndUpdate(hotelId, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedHotel);
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

// Delete hotel
const deleteHotel = async (req, res, next) => {
  try {
    const { hotelId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(hotelId)) {
      return next(errorHandler(400, "Invalid hotel ID"));
    }

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return next(errorHandler(404, "Hotel not found"));
    }

    if (!req.user?.isAdmin) {
      return next(errorHandler(403, "Only admins can delete hotels."));
    }

    await Hotel.findByIdAndDelete(hotelId);
    res.status(200).json("Hotel deleted successfully");
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

// Paginated hotels
const getPaginatedHotels = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const sortDirection = req.query.sort === "desc" ? -1 : 1;

    const hotels = await Hotel.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalHotels = await Hotel.countDocuments();

    res.status(200).json({ hotels, totalHotels });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

// Add rating
const addHotelRating = async (req, res, next) => {
  try {
    const { rating } = req.body;
    const { hotelId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(hotelId)) {
      return next(errorHandler(400, "Invalid hotel ID"));
    }

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return next(errorHandler(404, "Hotel not found"));
    }

    const numericRating = Number(rating);
    if (!numericRating || numericRating < 1 || numericRating > 5) {
      return next(errorHandler(400, "Rating must be a number between 1 and 5"));
    }

    const currentCount = hotel.ratings.ratingCount;
    const currentAvg = hotel.ratings.averageRating;

    const newTotal = currentCount + 1;
    const newAvg = (currentAvg * currentCount + numericRating) / newTotal;

    hotel.ratings.ratingCount = newTotal;
    hotel.ratings.averageRating = newAvg;

    await hotel.save();

    res.status(200).json({ message: "Rating added", hotel });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

module.exports = {
  createHotel,
  getHotels,
  getHotelById,
  getHotelsByCategory,
  editHotel,
  deleteHotel,
  getPaginatedHotels,
  addHotelRating,
};
