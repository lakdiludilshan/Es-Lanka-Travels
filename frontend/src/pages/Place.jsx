import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PlaceCard from "../components/PlaceCard";

const Place = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(6); // initially show 6 places

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const res = await fetch("/api/places/all");
        if (!res.ok) throw new Error("Failed to fetch places");
        const data = await res.json();
        setPlaces(Array.isArray(data.places) ? data.places : []);
      } catch (error) {
        setError("Failed to load places. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 6); // show 6 more on each click
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
        <div className="bg-black bg-opacity-60 w-full h-full absolute top-0 left-0" />
        <div className="z-10 text-center px-6">
          <h1 className="text-4xl md:text-6xl font-bold">
            Discover Beautiful Places in Sri Lanka
          </h1>
          <p className="mt-4 text-lg md:text-xl">
            Explore beaches, mountains, heritage sites, and more.
          </p>
          <Link
            to="/search"
            className="mt-6 inline-block bg-teal-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-amber-600 transition"
          >
            Browse All Places
          </Link>
        </div>
      </div>

      {/* Place Listings Section */}
      <div className="max-w-6xl mx-auto p-6 flex flex-col gap-8 py-7">
        {loading ? (
          <p className="text-center text-lg text-gray-700 dark:text-white">
            Loading places...
          </p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : places.length > 0 ? (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold text-center">
              Featured Places
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {places.slice(0, visibleCount).map((place) => (
                <PlaceCard key={place._id} place={place} />
              ))}
            </div>

            {visibleCount < places.length && (
              <button
                onClick={handleShowMore}
                className="mt-4 mx-auto bg-teal-600 text-white px-6 py-2 rounded-full hover:bg-teal-700 transition"
              >
                Show More
              </button>
            )}
          </div>
        ) : (
          <p className="text-center text-gray-500">No places found.</p>
        )}
      </div>
    </div>
  );
};

export default Place;
