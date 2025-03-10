import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PlaceCard from "../components/PlaceCard";

const Place = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);  // ✅ Track loading state
  const [error, setError] = useState(null);      // ✅ Track errors

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const res = await fetch("/api/places/all");
        if (!res.ok) {
          throw new Error("Failed to fetch places"); // Handle HTTP errors
        }
        const data = await res.json();
        setPlaces(data);
      } catch (error) {
        console.error("Error fetching places:", error);
        setError("Failed to load places. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchPlaces();
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold lg:text-6xl">Explore Beautiful Places</h1>
        <p className="text-gray-500 text-md sm:text-sm">
          Discover the best places to visit in Sri Lanka, from breathtaking beaches to historical landmarks.
        </p>
        <Link to="/search" className="text-xs sm:text-sm text-teal-500 font-bold hover:underline">
          View all places
        </Link>
      </div>

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
        {loading ? (
          <p className="text-center text-lg">Loading places...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : places.length > 0 ? (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold text-center">Featured Places</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {places.map((place) => (
                <PlaceCard key={place._id} place={place} />
              ))}
            </div>
            <Link to="/search" className="text-lg text-teal-500 hover:underline text-center">
              View all places
            </Link>
          </div>
        ) : (
          <p className="text-center text-gray-500">No places found.</p>
        )}
      </div>
    </div>
  );
};

export default Place;
