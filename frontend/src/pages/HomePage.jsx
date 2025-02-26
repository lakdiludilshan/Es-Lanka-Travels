import {react, useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import CallToAction from '../components/CallToAction'
import PostCard from '../components/PostCard'

const HomePage = () => {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('/api/posts/getposts')
      const data = await res.json()
      setPosts(data.posts)
    }
    fetchPosts()
  }, [])
  return (
    <div>
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
        <h1 className='text-3xl font-bold lg:text-6xl'>Welcome to Es Lanka Travels</h1>
        <p className='text-gray-500 text-md sm:text-sm'>Endless beaches, timeless ruins, welcoming people, oodles of elephants, 
          rolling surf, cheap prices, fun trains, famous tea and flavorful food 
          make Sri Lanka irresistible.</p>
      <Link to='/search' className='text-xs sm:text-sm text-teal-500 font-bold hover:underline'>
        View all post
      </Link>
      </div>
      <div className='p-3 bg-amber-100 dark:bg-slate-700'>
        <CallToAction />
      </div>
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7'>
        {posts && posts.length > 0 && (
          <div className='flex flex-col gap-6'>
            <h2 className='text-2xl font-semibold text-center'>Recent Posts</h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Link to={"/search"} className='text-lg text-teal-500 hover:underline text-center'>
              View all posts
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage
