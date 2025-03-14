import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CallToAction from "../components/CallToAction";
import FeedbackSection from "../components/FeedbackSection";

const PlaceDetails = () => {
  const { placeId } = useParams();
  const [place, setPlace] = useState(null);
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const res = await axios.get(`/api/places/${placeId}`);
        setPlace(res.data);
      } catch (error) {
        console.error("Error fetching place:", error);
      }
    };
    fetchPlace();
  }, [placeId]);

  const handleRatingSubmit = async () => {
    if (rating < 1 || rating > 5) return;

    setIsSubmitting(true);
    try {
      await axios.post(`/api/places/${placeId}/rate`, { rating });
      const res = await axios.get(`/api/places/${placeId}`);
      setPlace(res.data);
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
    setIsSubmitting(false);
  };

  if (!place) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-5">
      <img src={place.imageUrl} alt={place.name} className="w-full h-[400px] object-cover rounded-lg" />
      <h1 className="text-3xl font-bold mt-4">{place.name}</h1>
      <p className="text-gray-500 italic">{place.category}</p>
      <p className="mt-2">{place.description}</p>

      {/* ⭐ Ratings */}
      <div className="flex items-center gap-1 mt-2">
        <span className="text-yellow-500 text-xl">⭐ {place.ratings.averageRating.toFixed(1)}</span>
        <span className="text-gray-500">({place.ratings.ratingCount} reviews)</span>
      </div>

      {/* 💰 Budget */}
      <p className="text-lg font-semibold mt-3">Price per person:</p>
      <p>👨 Adult: ${place.budget.adult}</p>
      <p>👶 Child: ${place.budget.child}</p>

      {/* ⭐ Rate This Place */}
      <div className="mt-4">
        <label className="block text-lg font-semibold mb-2">Rate this place:</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="border border-gray-300 rounded-lg p-2"
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
          className="bg-teal-500 text-white px-4 py-2 rounded-md ml-2 disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit Rating"}
        </button>
      </div>
      <div className="mx-auto max-w-4xl w-full py-3">
              <CallToAction/>
          </div>
          {place && <FeedbackSection placeId={place._id} />}
    </div>
  );
};

export default PlaceDetails;
