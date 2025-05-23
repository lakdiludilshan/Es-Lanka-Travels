import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import HotelCard from "../components/HotelCard";

const Hotel = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(6);

  const featuredRef = useRef(null); // Ref to scroll to featured section

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await fetch("/api/hotels/all");
        if (!res.ok) {
          throw new Error("Failed to fetch hotels");
        }
        const data = await res.json();
        setHotels(Array.isArray(data.hotels) ? data.hotels : []);
      } catch (error) {
        setError("Failed to load hotels. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  const scrollToFeatured = () => {
    featuredRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-gradient-to-b from-white to-amber-50 dark:from-slate-900 dark:to-slate-800 min-h-screen">
      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center h-[60vh] flex items-center justify-center text-white"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1605522989515-30b9173f435b')`,
        }}
      >
        <div className="bg-black bg-opacity-60 w-full h-full absolute top-0 left-0"></div>
        <div className="z-10 text-center px-6">
          <h1 className="text-4xl md:text-6xl font-bold">
            Discover Hotels in Sri Lanka
          </h1>
          <p className="mt-4 text-lg md:text-xl">
            Unwind in paradise—from luxury resorts to cozy retreats.
          </p>
          <button
            onClick={scrollToFeatured}
            className="mt-6 inline-block bg-teal-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-amber-600 transition"
          >
            Browse All Hotels
          </button>
        </div>
      </div>

      {/* Hotel Listings Section */}
      <div ref={featuredRef} className="max-w-6xl mx-auto p-6 flex flex-col gap-8 py-7">
        {loading ? (
          <p className="text-center text-lg text-gray-700 dark:text-white">
            Loading hotels...
          </p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : hotels.length > 0 ? (
          <>
            <h2 className="text-2xl font-semibold text-center">
              Featured Hotels
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotels.slice(0, visibleCount).map((hotel) => (
                <HotelCard key={hotel._id} hotel={hotel} />
              ))}
            </div>

            {visibleCount < hotels.length && (
              <button
                onClick={handleShowMore}
                className="mt-4 mx-auto bg-teal-600 text-white px-6 py-2 rounded-full hover:bg-teal-700 transition"
              >
                Show More
              </button>
            )}
          </>
        ) : (
          <p className="text-center text-gray-500">No hotels found.</p>
        )}
      </div>
    </div>
  );
};

export default Hotel;
