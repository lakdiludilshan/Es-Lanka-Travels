const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true, 
    },
    description: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    budget: {
      adult: { type: Number, required: true }, 
      child: { type: Number, required: true }, 
    },
    ratings: {
      averageRating: { type: Number, default: 0 }, 
      ratingCount: { type: Number, default: 0 }, 
    },
  },
  { timestamps: true }
);

const Place = mongoose.model("Place", placeSchema);

module.exports = Place;
