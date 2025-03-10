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
      required: true, // Example: "Cultural", "Wildlife", "Beach"
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
      adult: { type: Number, required: true }, // Price per adult
      child: { type: Number, required: true }, // Price per child
    },
    ratings: {
      averageRating: { type: Number, default: 0 }, // Average rating (1-5)
      ratingCount: { type: Number, default: 0 }, // Total number of ratings
    },
  },
  { timestamps: true }
);

const Place = mongoose.model("Place", placeSchema);

module.exports = Place;
