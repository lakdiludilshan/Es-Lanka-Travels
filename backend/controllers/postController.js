const Post = require("../models/postModel");
const { errorHandler } = require("../utils/error");

const createPost = async (req, res, next) => {
  console.log(req.body);
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "Unauthorized to create a post"));
  }
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, "Title and content are required"));
  }
  const slug = req.body.title
    .toLowerCase()
    .split(" ")
    .join("-")
    .replace(/[^a-zA-Z0-9-]/g, "");

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

const getPosts = async (req, res, next) => {
  try {

    const startindex = parseInt(req.query.startIndex) || 0;
    let limit = 0;
    if (req.query.limit) {
      limit = parseInt(req.query.limit);
    } else if (req.postId) {
      limit = 0;
    } else {
      limit = 9;
    }
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startindex)
      .limit(limit);

    const totalPosts = await Post.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({ posts, totalPosts, lastMonthPosts });
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  const { id } = req.params;

  // Check authorization properly
  if (!req.user.isAdmin && req.user._id.toString() !== userId) {
    return next(errorHandler(403, "Unauthorized to delete this post"));
  }
  try {
    await Post.findByIdAndDelete(id);
    res.status(200).json("the post has been deleted");
  } catch (error) {
    next(error);
  }
};

const updatePost = async (req, res, next) => {
  // Check authorization
  if (!req.user || (!req.user.isAdmin && req.user.id !== req.params.userId)) {
    return next(errorHandler(403, "Unauthorized to update this post"));
  }

  try {
    console.log("Update request received for post:", req.params.postId);
    console.log("User attempting update:", req.user.id);
    console.log("Update data received:", req.body);

    // Check if postId is valid
    if (!req.params.postId) {
      return next(errorHandler(400, "Post ID is required"));
    }

    // Attempt to update the post
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          image: req.body.image,
        },
      },
      { new: true, runValidators: true }
    );

    // If the post is not found
    if (!updatedPost) {
      return next(errorHandler(404, "Post not found"));
    }

    console.log("Post updated successfully:", updatedPost);
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error while updating post:", error);
    next(errorHandler(500, "Internal Server Error"));
  }
};


module.exports = { createPost, getPosts, deletePost, updatePost };
