import React, { useState } from "react";
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
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
};

export default TravelPreferencesForm;
