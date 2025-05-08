import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CallToAction from "../components/CallToAction";
import { toast } from "react-toastify";
import ReviewSection from "../components/ReviewSection";

const HotelDetails = () => {
  const { hotelId } = useParams();
  const [hotel, setHotel] = useState(null);
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const res = await axios.get(`/api/hotels/${hotelId}`);
        setHotel(res.data);
      } catch (error) {
        console.error("Error fetching hotel:", error);
        toast.error("Failed to load hotel details.");
      }
    };
    fetchHotel();
  }, [hotelId]);

  const handleRatingSubmit = async () => {
    if (rating < 1 || rating > 5) return;

    setIsSubmitting(true);
    try {
      await axios.post(`/api/hotels/${hotelId}/rate`, { rating });
      const res = await axios.get(`/api/hotels/${hotelId}`);
      setHotel(res.data);
      toast.success("Thanks for rating this hotel!");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
    setIsSubmitting(false);
  };

  if (!hotel) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-5">
      <img
        src={hotel.imageUrls && hotel.imageUrls.length > 0 ? hotel.imageUrls[0] : "/default-hotel.jpg"}
        alt={hotel.name}
        className="w-full h-[400px] object-cover rounded-lg"
      />
      <h1 className="text-3xl font-bold mt-4">{hotel.name}</h1>
      <p className="text-gray-500 italic">{hotel.location || "Location not available"}</p>
      <p className="mt-2">{hotel.description || "No description available"}</p>

      {/* ⭐ Ratings */}
      <div className="flex items-center gap-1 mt-2">
        <span className="text-yellow-500 text-xl">
          ⭐ {hotel.ratings?.averageRating?.toFixed(1) || "N/A"}
        </span>
        <span className="text-gray-500">
          ({hotel.ratings?.ratingCount || 0} reviews)
        </span>
      </div>

      {/* 💰 Price Info */}
      <p className="text-lg font-semibold mt-3">Pricing:</p>
      <p>🛌 Standard Room: ${hotel.pricing?.normal ?? "N/A"}</p>
      <p>👑 Deluxe Room: ${hotel.pricing?.deluxe ?? "N/A"}</p>

      {/* ⭐ Rate This Hotel */}
      <div className="mt-4">
        <label className="block text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
          Rate this hotel:
        </label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg p-2"
        >
          <option value="">Select Rating</option>
          <option value="1">⭐ 1</option>
          <option value="2">⭐ 2</option>
          <option value="3">⭐ 3</option>
          <option value="4">⭐ 4</option>
          <option value="5">⭐ 5</option>
        </select>
        <button
          onClick={handleRatingSubmit}
          disabled={isSubmitting}
          className="bg-indigo-500 text-white px-4 py-2 rounded-md ml-2 disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit Rating"}
        </button>
      </div>

      <div className="mx-auto max-w-4xl w-full py-3">
        <CallToAction />
      </div>

      {hotel && <ReviewSection hotelId={hotel._id} />}
    </div>
  );
};

export default HotelDetails;
