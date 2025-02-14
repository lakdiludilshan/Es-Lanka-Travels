const Post = require("../models/postModel");
const { errorHandler } = require("../utils/error");

const createPost = async (req, res, next) => {

    if (!req.user.isAdmin) {
        return next(errorHandler(403, "Unauthorized to create a post"));
    }
    if (!req.body.title || !req.body.content) {
        return next(errorHandler(400, "Title and content are required"));
    }
    const slug = req.body.title.toLowerCase().split(" ").join("-").replace(/[^a-zA-Z0-9-]/g, "");

    const newPost = new Post({
        ...req.body,
        slug,
        userId: req.user.id,
    });
    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        next(error);
    }
};

module.exports = { createPost };