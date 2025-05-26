import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import ReviewSection from "../components/ReviewSection";
import CallToAction from "../components/CallToAction";

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
    <div className="max-w-4xl mx-auto p-5 text-gray-800 dark:text-gray-100">
      {/* 🖼️ Main Image */}
      <img
        src={hotel.imageUrls?.[0] || "/default-hotel.jpg"}
        alt={hotel.name}
        className="w-full h-[400px] object-cover rounded-lg"
      />

      {/* 🏨 Hotel Info */}
      <h1 className="text-3xl font-bold mt-4">{hotel.name}</h1>
      <p className="text-gray-500 dark:text-gray-400 italic">
        {hotel.location || "Location not available"}
      </p>
      <p className="mt-3">{hotel.description || "No description available"}</p>

      {/* 🌟 Ratings */}
      <div className="flex items-center gap-2 mt-4">
        <span className="text-yellow-400 text-xl">
          ⭐ {hotel.ratings?.averageRating?.toFixed(1) || "N/A"}
        </span>
        <span className="text-gray-600 dark:text-gray-400">
          ({hotel.ratings?.ratingCount || 0} reviews)
        </span>
      </div>

      {/* 💰 Pricing */}
      <div className="mt-5">
        <h2 className="text-xl font-semibold mb-1">Pricing</h2>
        <p>🛌 Standard Room: ${hotel.pricing?.normal ?? "N/A"}</p>
        <p>👑 Deluxe Room: ${hotel.pricing?.deluxe ?? "N/A"}</p>
      </div>

      {/* ✨ Amenities */}
      {hotel.amenities?.length > 0 && (
        <div className="mt-5">
          <h2 className="text-xl font-semibold mb-2">Amenities</h2>
          <ul className="list-disc list-inside grid grid-cols-2 gap-1">
            {hotel.amenities.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 📞 Contact Info */}
      <div className="mt-5 space-y-1">
        <h2 className="text-xl font-semibold">Contact Info</h2>
        {hotel.contactInfo?.phone && <p>📞 {hotel.contactInfo.phone}</p>}
        {hotel.contactInfo?.email && <p>📧 {hotel.contactInfo.email}</p>}
        {hotel.contactInfo?.website && (
          <p>
            🌐{" "}
            <a
              href={hotel.contactInfo.website}
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 underline"
            >
              {hotel.contactInfo.website}
            </a>
          </p>
        )}
      </div>

      {/* ⭐ Rate This Hotel */}
      <div className="mt-6">
        <label className="block text-lg font-semibold mb-2">
          Rate this hotel:
        </label>
        <div className="flex gap-3 items-center">
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
          >
            <option value="">Select Rating</option>
            {[1, 2, 3, 4, 5].map((val) => (
              <option key={val} value={val}>
                {`⭐ ${val}`}
              </option>
            ))}
          </select>
          <button
            onClick={handleRatingSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            {isSubmitting ? "Submitting..." : "Submit Rating"}
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-4xl w-full py-3">
        <CallToAction />
      </div>

      {/* 📝 Reviews */}
      <div className="mt-10">
        <ReviewSection hotelId={hotelId} />
      </div>
    </div>
  );
};

export default HotelDetails;
