import React, { useState } from "react";
import {
  Button,
  TextInput,
  Select,
  Checkbox,
  Textarea,
  Spinner,
  Alert,
} from "flowbite-react";

const TravelPreferencesForm = () => {
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    travelers: "",
    tripStyles: [],
    activities: [],
    budget: "",
    accommodation: "",
    transport: "",
    foodPreferences: "",
    specialRequests: "",
  });

  const tripStyles = [
    "Adventure",
    "Relaxation",
    "Culture",
    "Beach Escape",
    "Wildlife Safari",
    "Spiritual Retreat",
    "Foodie Tour",
  ];
  const activities = [
    "Hiking",
    "Surfing",
    "Snorkeling",
    "Safari",
    "Camping",
    "Ancient Temples",
    "UNESCO Sites",
    "Local Festivals",
    "Beaches",
    "Spas",
    "Shopping",
    "Nightlife",
  ];

  const handleCheckboxChange = (e, category) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [category]: checked
        ? [...prev[category], value]
        : prev[category].filter((item) => item !== value),
    }));
  };

  const [tourPlan, setTourPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.startDate || !formData.endDate) {
        throw new Error("Please select both start and end dates");
      }

      if (!formData.tripStyles.length) {
        throw new Error("Please select at least one trip style");
      }

      if (!formData.activities.length) {
        throw new Error("Please select at least one activity");
      }

      if (!formData.budget) {
        throw new Error("Please select a budget range");
      }

      // Calculate duration from date range
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);

      // Validate dates
      if (startDate > endDate) {
        throw new Error("End date must be after start date");
      }

      const duration =
        Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

      // Validate duration
      if (duration < 3) {
        throw new Error("Trip must be at least 3 days long");
      }

      // Prepare data for API
      const apiData = {
        tripStyles: formData.tripStyles,
        activities: formData.activities,
        budget: formData.budget,
        duration: duration,
        travelers: parseInt(formData.travelers) || 2,
        transport: formData.transport,
      };

      console.log("Sending data to API:", apiData);

      // Call API
      const response = await fetch(
        "http://localhost:3000/api/generate-tour-plan",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate tour plan");
      }

      setTourPlan(data);
    } catch (error) {
      console.error("Error generating tour plan:", error);
      setError(
        error.message || "Failed to generate tour plan. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 max-w-4xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">
        Plan Your Perfect Sri Lanka Trip! 🌴🐘
      </h1>

      {/* Form Section */}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Start Date
            </label>
            <TextInput
              type="date"
              required
              className="w-full"
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              End Date
            </label>
            <TextInput
              type="date"
              required
              className="w-full"
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Number of Travelers
          </label>
          <TextInput
            type="number"
            min="1"
            required
            className="w-full"
            onChange={(e) =>
              setFormData({ ...formData, travelers: e.target.value })
            }
          />
        </div>

        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
          <h2 className="text-lg font-semibold mb-2 dark:text-white">
            Trip Style
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {tripStyles.map((style) => (
              <label
                key={style}
                className="flex items-center gap-2 dark:text-gray-300"
              >
                <Checkbox
                  value={style}
                  onChange={(e) => handleCheckboxChange(e, "tripStyles")}
                />
                {style}
              </label>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
          <h2 className="text-lg font-semibold mb-2 dark:text-white">
            Must-Do Activities
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {activities.map((activity) => (
              <label
                key={activity}
                className="flex items-center gap-2 dark:text-gray-300"
              >
                <Checkbox
                  value={activity}
                  onChange={(e) => handleCheckboxChange(e, "activities")}
                />
                {activity}
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Budget Range
            </label>
            <Select
              onChange={(e) =>
                setFormData({ ...formData, budget: e.target.value })
              }
            >
              <option value="">Select Budget Range</option>
              <option value="Budget">Backpacker ($)</option>
              <option value="Mid-range">Mid-range ($$)</option>
              <option value="Luxury">Luxury ($$$)</option>
            </Select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Accommodation Type
            </label>
            <Select
              onChange={(e) =>
                setFormData({ ...formData, accommodation: e.target.value })
              }
            >
              <option value="">Select Accommodation Type</option>
              <option value="Homestay">Homestay</option>
              <option value="Beach Resort">Beach Resort</option>
              <option value="Eco-Lodge">Eco-Lodge</option>
              <option value="Boutique Hotel">Boutique Hotel</option>
            </Select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Transport Mode
            </label>
            <Select
              onChange={(e) =>
                setFormData({ ...formData, transport: e.target.value })
              }
            >
              <option value="">Select Transport Mode</option>
              <option value="Tuk-tuk">Tuk-tuk</option>
              <option value="Private Car">Private Car</option>
              <option value="Train">Train</option>
              <option value="Domestic Flight">Domestic Flight</option>
            </Select>
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Food Preferences
          </label>
          <Textarea
            placeholder="Vegan, Street Food Lover, etc."
            rows="3"
            onChange={(e) =>
              setFormData({ ...formData, foodPreferences: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Special Requests
          </label>
          <Textarea
            placeholder="Kid-Friendly, Pet-Friendly, etc."
            rows="3"
            onChange={(e) =>
              setFormData({ ...formData, specialRequests: e.target.value })
            }
          />
        </div>

        <Button
          className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <Spinner size="sm" />
              <span>Generating Your Perfect Tour Plan...</span>
            </div>
          ) : (
            "Get Your Personalized Tour Plan"
          )}
        </Button>
      </form>

      {/* Error Display */}
      {error && (
        <Alert color="failure" className="mt-4">
          {error}
        </Alert>
      )}

      {/* Tour Plan Display */}
      {tourPlan && (
        <div className="mt-8 p-6 rounded-lg bg-white dark:bg-gray-800 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">
            Your Personalized Tour Plan
          </h2>

          {/* Daily Itinerary */}
          <div className="space-y-6">
            {tourPlan.dailyItinerary?.map((day, index) => (
              <div
                key={index}
                className="border-b pb-6 border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xl font-semibold dark:text-white">
                    Day {index + 1}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {day.dayType === "arrival"
                        ? "Arrival"
                        : day.dayType === "departure"
                        ? "Departure"
                        : "Day"}{" "}
                      in
                    </span>

                    <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                      {day.location}
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  {day.activities?.map((activity, actIndex) => (
                    <div key={actIndex} className="flex gap-4">
                      <div className="w-24 text-gray-500 dark:text-gray-400">
                        {activity.time}
                      </div>
                      <div>
                        <h4 className="font-medium dark:text-white">
                          {activity.name}
                        </h4>
                        <p className="text-gray-600 text-sm dark:text-gray-300">
                          {activity.description}
                        </p>
                        {activity.duration && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            ⏱️ Duration: {activity.duration}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Additional Information */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Accommodation Details */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 dark:text-white">
                Accommodation
              </h3>
              <div className="mb-3">
                <p className="font-medium dark:text-white">
                  {formData.accommodation}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {formData.accommodation === "Homestay" &&
                    "Experience local hospitality in a family home"}
                  {formData.accommodation === "Beach Resort" &&
                    "Luxurious stay with beachfront access"}
                  {formData.accommodation === "Eco-Lodge" &&
                    "Sustainable accommodation in natural surroundings"}
                  {formData.accommodation === "Boutique Hotel" &&
                    "Unique and personalized hotel experience"}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  💰 Price: ${formData.accommodation === "Homestay" && "50"}
                  {formData.accommodation === "Beach Resort" &&
                    (formData.budget === "Luxury" ? "300" : "150")}
                  {formData.accommodation === "Eco-Lodge" && "120"}
                  {formData.accommodation === "Boutique Hotel" &&
                    (formData.budget === "Luxury" ? "250" : "150")}
                  {" per night"}
                </p>
              </div>
            </div>

            {/* Transportation Details */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 dark:text-white">
                Transportation
              </h3>
              <div className="mb-3">
                <p className="font-medium dark:text-white">
                  {formData.transport}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {formData.transport === "Private Car" &&
                    "Comfortable car with professional driver"}
                  {formData.transport === "Train" && "Scenic train journey"}
                  {formData.transport === "Tuk-tuk" && "Local three-wheeler"}
                  {formData.transport === "Domestic Flight" &&
                    "Quick and convenient air travel"}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  💰 Price: $
                  {formData.transport === "Private Car" &&
                    (formData.budget === "Luxury" ? "100" : "80")}
                  {formData.transport === "Train" &&
                    (formData.budget === "Mid-range" ? "30" : "20")}
                  {formData.transport === "Tuk-tuk" && "40"}
                  {formData.transport === "Domestic Flight" && "200"}
                  {" per day"}
                </p>
              </div>
            </div>
          </div>

          {/* Budget Summary */}
          {tourPlan.budget && (
            <div className="mt-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 dark:text-white">
                Budget Summary
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(tourPlan.budget).map(([category, amount]) => (
                  <div key={category} className="text-center">
                    <p className="text-gray-600 text-sm dark:text-gray-300">
                      {category}
                    </p>
                    <p className="font-semibold dark:text-white">
                      ${Number(amount) * 3}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600 text-center">
                <p className="text-lg font-bold dark:text-white">
                  Total Estimated Cost: $
                  {Object.values(tourPlan.budget).reduce(
                    (a, b) => Number(a) + Number(b),
                    0
                  ) * 3}
                </p>
              </div>
            </div>
          )}

          {/* Additional Tips */}
          {tourPlan.tips && (
            <div className="mt-6 bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 dark:text-white">
                Travel Tips
              </h3>
              <ul className="list-disc list-inside space-y-2 dark:text-gray-300">
                {tourPlan.tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TravelPreferencesForm;
