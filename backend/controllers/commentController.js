const express = require('express');
const Comment = require('../models/commentModel');
const { errorHandler } = require('../utils/error');

const createComment = async (req, res, next) => {
    try {
        const { content, postId, userId } = req.body;

        if (userId !== req.user.id) {
            return next(errorHandler(403, 'You are not allowed to create this comment'));
        }
        const newComment = new Comment({
            content,
            postId,
            userId,
        });
        await newComment.save();
        return res.status(201).json(newComment);

    } catch (error) {
        return next(error);
    }
};

module.exports = {
  createComment,
};