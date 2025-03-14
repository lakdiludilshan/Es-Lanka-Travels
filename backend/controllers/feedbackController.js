const express = require("express");
const Feedback = require("../models/feedbackModel");
const { errorHandler } = require("../utils/error");

const createFeedback = async (req, res, next) => {
  try {
    const { content, placeId, userId } = req.body;

    if (userId !== req.user.id) {
      return next(errorHandler(403, "You are not allowed to create this feedback"));
    }

    const newFeedback = new Feedback({
      content,
      placeId,
      userId,
    });

    await newFeedback.save();
    return res.status(201).json(newFeedback);
  } catch (error) {
    return next(error);
  }
};

const getPlaceFeedbacks = async (req, res, next) => {
  try {
    const feedbacks = await Feedback.find({ placeId: req.params.placeId }).sort({ createdAt: -1 });
    res.status(200).json(feedbacks);
  } catch (error) {
    next(error);
  }
};

const likeFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.findById(req.params.feedbackId);
    if (!feedback) {
      return next(errorHandler(404, "Feedback not found"));
    }
    const userIndex = feedback.likes.indexOf(req.user.id);
    if (userIndex === -1) {
      feedback.numberOfLikes += 1;
      feedback.likes.push(req.user.id);
    } else {
      feedback.numberOfLikes -= 1;
      feedback.likes.splice(userIndex, 1);
    }
    await feedback.save();
    res.status(200).json(feedback);
  } catch (error) {
    next(error);
  }
};

const editFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.findById(req.params.feedbackId);
    if (!feedback) {
      return next(errorHandler(404, "Feedback not found"));
    }
    if (feedback.userId !== req.user.id && !req.user.isAdmin) {
      return next(errorHandler(403, "You are not allowed to edit this feedback"));
    }

    const editedFeedback = await Feedback.findByIdAndUpdate(
      req.params.feedbackId,
      {
        content: req.body.content,
      },
      { new: true }
    );

    res.status(200).json(editedFeedback);
  } catch (error) {
    next(error);
  }
};

const deleteFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.findById(req.params.feedbackId);
    if (!feedback) {
      return next(errorHandler(404, "Feedback not found"));
    }
    if (feedback.userId !== req.user.id && !req.user.isAdmin) {
      return next(errorHandler(403, "You are not allowed to delete this feedback"));
    }

    await Feedback.findByIdAndDelete(req.params.feedbackId);
    res.status(200).json("Feedback deleted successfully");
  } catch (error) {
    next(error);
  }
};

const getFeedbacks = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to view this page"));
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "desc" ? -1 : 1;

    const feedbacks = await Feedback.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalFeedbacks = await Feedback.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const lastMonthFeedbacks = await Feedback.countDocuments({ createdAt: { $gte: oneMonthAgo } });

    res.status(200).json({ feedbacks, totalFeedbacks, lastMonthFeedbacks });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createFeedback,
  getPlaceFeedbacks,
  likeFeedback,
  editFeedback,
  deleteFeedback,
  getFeedbacks,
};
