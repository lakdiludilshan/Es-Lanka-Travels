const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    userId: {
        type: 'string',
        required: true,
    },
    content: {
        type: 'string',
        required: true,
    },
    title: {
        type: 'string',
        required: true,
        unique: true,
    },
    images: {
        type: [String],
        default: [
          "https://media.sproutsocial.com/uploads/2022/05/How-to-post-on-instagram-from-pc.jpg",
        ],
    },
    category: {
        type: 'string',
        default: 'uncategorized',
    },
    slug: {
        type: 'string',
        required: true,
        unique: true,
    },
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;