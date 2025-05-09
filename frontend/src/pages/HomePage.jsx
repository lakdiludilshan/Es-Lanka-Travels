import { react, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import PostCard from "../components/PostCard";
import PlaceCard from "../components/PlaceCard";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch("/api/posts/getposts");
      const data = await res.json();
      setPosts(data.posts);
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const res = await fetch("/api/places/all");
        const data = await res.json();
        setPlaces(data.places || []);
      } catch (error) {
        console.error("Failed to fetch top places:", error);
      }
    };

    fetchPlaces();
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold lg:text-6xl">
          Welcome to Es Lanka Travels
        </h1>
        <p className="text-gray-500 text-md sm:text-sm">
          Endless beaches, timeless ruins, welcoming people, oodles of
          elephants, rolling surf, cheap prices, fun trains, famous tea and
          flavorful food make Sri Lanka irresistible.
        </p>
        <Link
          to="/search"
          className="text-xs sm:text-sm text-teal-500 font-bold hover:underline"
        >
          View all posts
        </Link>
      </div>

      <div className="p-3 bg-amber-100 dark:bg-slate-700">
        <CallToAction />
      </div>

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
        {posts && posts.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold text-center">Recent Posts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Link
              to={"/search"}
              className="text-lg text-teal-500 hover:underline text-center"
            >
              View all posts
            </Link>
          </div>
        )}
      </div>

      {/* Top Destinations Section */}
      <section className="bg-white dark:bg-slate-800 py-16">
        <div className="max-w-6xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-10">
            Top Places to Visit in Sri Lanka
          </h2>
          {places.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {places.slice(0, 3).map((place) => (
                <PlaceCard key={place._id} place={place} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No top places found.</p>
          )}
        </div>
      </section>

      {/* Why Travel With Us Section */}
      <section className="bg-teal-50 dark:bg-slate-700 py-16">
        <div className="max-w-6xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-10">
            Why Travel With Es Lanka?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[
              {
                title: "Tailor-Made Itineraries",
                icon: "🌍",
                desc: "We craft journeys based on your unique travel style and interests.",
              },
              {
                title: "Local Expertise",
                icon: "🧭",
                desc: "Guided by locals, you’ll explore authentic Sri Lanka beyond the tourist path.",
              },
              {
                title: "24/7 Support",
                icon: "📞",
                desc: "We’re with you from start to finish, anytime you need us.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow text-center"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-600 mt-2 dark:text-gray-300">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
