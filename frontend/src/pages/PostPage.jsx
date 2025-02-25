import React from "react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Spinner } from "flowbite-react";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";

function PostPage() {
  const { postslug } = useParams();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);
  const [error, setError] = useState(false);
  const [recentPosts, setRecentPosts] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/posts/getposts?slug=${postslug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setPost(data.posts[0]);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postslug]);

  useEffect(() => {
    try {
      const fetchRecentPosts = async () => {
        const res = await fetch(`/api/posts/getposts?limit=3`);
        const data = await res.json();
        if (res.ok) {
          setRecentPosts(data.posts);
        }
      };
      fetchRecentPosts();
    } catch (error) {
      console.log(error.message);
    }
    }, []);


  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <Spinner size="xl"/>
    </div>
  );

  return <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
    <h1 className="text-3xl mt-10 p-3 text-center font-serif mx-w-2xl mx-auto lg:text-4xl">{post && post.title}</h1>
    <Link to={`/search?category=${post && post.category}`} className="self-center mt-5 ">
        <Button color="gray" pill size="xs">{post && post.category}</Button>
    </Link>
    <img src={post && post.image} alt={post && post.title} className="mt-10 p-3 mx-auto max-h-[600px] w-full object-cover"/>
    <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs  ">
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className="italic">{post && (post.content.length /1000).toFixed(0)} mins read</span>
    </div>
    <div dangerouslySetInnerHTML={{__html: post && post.content}} className="p-3 max-w-2xl mx-auto w-full post-content">

    </div>
    <div className="mx-auto max-w-4xl w-full ">
        <CallToAction/>
    </div>
    {post && <CommentSection postId={post._id} />}

    <div className="flex flex-col justify-center items-center mb-5">
      <h1 className="text-xl mt-5">Recent Articles</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-5 max-w-screen-xl mx-auto px-4">
        {recentPosts && recentPosts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  </main>;
}

export default PostPage;
