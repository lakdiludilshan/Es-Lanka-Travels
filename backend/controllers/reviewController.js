const express = require("express");
const Review = require("../models/reviewModel");
const { errorHandler } = require("../utils/error");

const createReview = async (req, res, next) => {
  try {
    const { content, hotelId, userId } = req.body;

    if (userId !== req.user.id) {
      return next(errorHandler(403, "You are not allowed to create this review"));
    }

    const newReview = new Review({
      content,
      hotelId,
      userId,
    });

    await newReview.save();
    return res.status(201).json(newReview);
  } catch (error) {
    return next(error);
  }
};

const getHotelReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ hotelId: req.params.hotelId }).sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
};

const likeReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) {
      return next(errorHandler(404, "Review not found"));
    }
    const userIndex = review.likes.indexOf(req.user.id);
    if (userIndex === -1) {
      review.numberOfLikes += 1;
      review.likes.push(req.user.id);
    } else {
      review.numberOfLikes -= 1;
      review.likes.splice(userIndex, 1);
    }
    await review.save();
    res.status(200).json(review);
  } catch (error) {
    next(error);
  }
};

const editReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) {
      return next(errorHandler(404, "Review not found"));
    }
    if (review.userId !== req.user.id && !req.user.isAdmin) {
      return next(errorHandler(403, "You are not allowed to edit this review"));
    }

    const editedReview = await Review.findByIdAndUpdate(
      req.params.reviewId,
      {
        content: req.body.content,
      },
      { new: true }
    );

    res.status(200).json(editedReview);
  } catch (error) {
    next(error);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) {
      return next(errorHandler(404, "Review not found"));
    }
    if (review.userId !== req.user.id && !req.user.isAdmin) {
      return next(errorHandler(403, "You are not allowed to delete this review"));
    }

    await Review.findByIdAndDelete(req.params.reviewId);
    res.status(200).json("Review deleted successfully");
  } catch (error) {
    next(error);
  }
};

const getReviews = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to view this page"));
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "desc" ? -1 : 1;

    const reviews = await Review.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalReviews = await Review.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const lastMonthReviews = await Review.countDocuments({ createdAt: { $gte: oneMonthAgo } });

    res.status(200).json({ reviews, totalReviews, lastMonthReviews });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReview,
  getHotelReviews,
  likeReview,
  editReview,
  deleteReview,
  getReviews,
};
