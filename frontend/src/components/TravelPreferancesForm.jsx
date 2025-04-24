import React, { useEffect, useState } from "react";
import { Button, TextInput, Select, Checkbox, Textarea } from "flowbite-react";

const TravelPreferencesForm = () => {
  const [formData, setFormData] = useState({
    destination: "",
    travelDates: "",
    travelers: "",
    tripStyles: [],
    activities: [],
    budget: "",
    accommodation: "",
    transport: "",
    foodPreferences: "",
    specialRequests: ""
  });

  const tripStyles = ["Adventure", "Relaxation", "Culture", "Beach Escape", "Wildlife Safari", "Spiritual Retreat", "Foodie Tour"];
  const activities = ["Hiking", "Surfing", "Snorkeling", "Safari", "Camping", "Ancient Temples", "UNESCO Sites", "Local Festivals", "Beaches", "Spas", "Shopping", "Nightlife"];

  const handleCheckboxChange = (e, category) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [category]: checked
        ? [...prev[category], value]
        : prev[category].filter((item) => item !== value)
    }));
  };

  const [recommendedPlaces, setRecommendedPlaces] = useState([]);


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("http://localhost:3000/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to get recommendations');
      }
      
      const data = await response.json();
      setRecommendedPlaces(data);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setError("Failed to get recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="p-5 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Plan Your Perfect Sri Lanka Trip! 🌴🐘</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="Enter Your Destination"
          required
          className="w-full"
          onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
        />
        
        <TextInput
          type="date"
          placeholder="Select Travel Dates"
          required
          className="w-full"
          onChange={(e) => setFormData({ ...formData, travelDates: e.target.value })}
        />
        
        <TextInput
          type="number"
          placeholder="Number of Travelers"
          required
          className="w-full"
          onChange={(e) => setFormData({ ...formData, travelers: e.target.value })}
        />

        <div>
          <h2 className="text-lg font-semibold mb-2">Trip Style</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {tripStyles.map((style) => (
              <label key={style} className="flex items-center gap-2">
                <Checkbox value={style} onChange={(e) => handleCheckboxChange(e, "tripStyles")} />
                {style}
              </label>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Must-Do Activities</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {activities.map((activity) => (
              <label key={activity} className="flex items-center gap-2">
                <Checkbox value={activity} onChange={(e) => handleCheckboxChange(e, "activities")} />
                {activity}
              </label>
            ))}
          </div>
        </div>

        <Select onChange={(e) => setFormData({ ...formData, budget: e.target.value })}>
          <option value="">Select Budget Range</option>
          <option value="Budget">Backpacker ($)</option>
          <option value="Mid-range">Mid-range ($$)</option>
          <option value="Luxury">Luxury ($$$)</option>
        </Select>

        <Select onChange={(e) => setFormData({ ...formData, accommodation: e.target.value })}>
          <option value="">Select Accommodation Type</option>
          <option value="Homestay">Homestay</option>
          <option value="Beach Resort">Beach Resort</option>
          <option value="Eco-Lodge">Eco-Lodge</option>
          <option value="Boutique Hotel">Boutique Hotel</option>
        </Select>

        <Select onChange={(e) => setFormData({ ...formData, transport: e.target.value })}>
          <option value="">Select Transport Mode</option>
          <option value="Tuk-tuk">Tuk-tuk</option>
          <option value="Private Car">Private Car</option>
          <option value="Train">Train</option>
          <option value="Domestic Flight">Domestic Flight</option>
        </Select>

        <Textarea
          placeholder="Food Preferences (e.g., Vegan, Street Food Lover)"
          rows="3"
          onChange={(e) => setFormData({ ...formData, foodPreferences: e.target.value })}
        />
        
        <Textarea
          placeholder="Special Requests (Kid-Friendly, Pet-Friendly, etc.)"
          rows="3"
          onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
        />

        <Button className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" type="submit">
          Get Your Itinerary
        </Button>
      </form>
    </div>
  );
  // Add this section after your form in the return statement
{recommendedPlaces.length > 0 && (
  <div className="mt-8">
    <h2 className="text-2xl font-bold mb-4">Recommended Places</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {recommendedPlaces.map((place) => (
        <div key={place._id} className="border rounded-lg overflow-hidden shadow-lg">
          {place.imageUrl && (
            <img 
              src={place.imageUrl} 
              alt={place.name} 
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-4">
            <h3 className="text-xl font-semibold mb-2">{place.name}</h3>
            <p className="text-gray-600 mb-2">{place.location}</p>
            <div className="flex items-center mb-2">
              <span className="text-yellow-500 mr-1">★</span>
              <span>{place.ratings.averageRating.toFixed(1)}</span>
              <span className="text-gray-500 text-sm ml-1">
                ({place.ratings.ratingCount} reviews)
              </span>
            </div>
            <p className="text-sm text-gray-700 mb-3">
              {place.description && place.description.substring(0, 120)}
              {place.description && place.description.length > 120 ? '...' : ''}
            </p>
            <div className="flex justify-between items-center">
              <span className="font-semibold">
                ${place.budget.adult} / person
              </span>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm">
                View Details
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)}
};

export default TravelPreferencesForm;
