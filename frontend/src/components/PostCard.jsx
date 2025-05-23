import React from "react";
import { Link } from "react-router-dom";

function PostCard({ post }) {
  // Get the first image if there are multiple, or just the single image
  const imageSrc = Array.isArray(post.images) && post.images.length > 0 ? post.images[0] : post.image;

  return (
    <div className="group relative w-full border border-teal-500 hover:border-2 h-[350px] overflow-hidden rounded-lg
    sm:w-[430px] transition-all">
      <Link to={`/post/${post.slug}`}>
        <img
          src={imageSrc}
          alt="post cover"
          className="h-[260px] w-full object-cover group-hover:h-[200px] transition-all
          duration-300 z-20"
        />
      </Link>
      <div className="p-3 flex flex-col gap-1">
        <p className="text-lg font-semibold line-clamp-2">{post.title}</p>
        <span className="italic text-sm">{post.category}</span>
        <Link to={`/post/${post.slug}`}
        className="z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border bordeer-teal-500
        text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md
        !rounded-tl-none m-2 ">
            Read Article
        </Link>
      </div>
    </div>
  );
}

export default PostCard;
