const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    placeId: { // Changed postId to placeId
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    likes: {
      type: Array,
      default: [],
    },
    numberOfLikes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;
