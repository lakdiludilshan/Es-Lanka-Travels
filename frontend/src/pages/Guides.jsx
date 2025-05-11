import React from "react";
import Sunil from "../assets/Thilak.jpg";
import Rayan from "../assets/Rayan.jpg";

const guides = [
  {
    name: "Sunil Thilakarathna",
    category: "National Guide",
    address: "447/B/1 7th mile post, Hipankanda, Elpitiya",
    nic: "732334550v",
    languages: ["English", "Spanish"],
    license: "SLG-2023-456",
    photo: Sunil,
    topRated: true,
  },
  {
    name: "Rayan Fernando",
    category: "Chauffeur Guide",
    address: "45 Galle Road, Galle",
    nic: "945612378V",
    languages: ["English", "Germen", "French"],
    license: "SLG-2022-789",
    photo: Rayan,
    topRated: false,
  },
];

const Guides = () => {
  return (
    <div className="bg-white dark:bg-slate-900 min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white">
          Meet Our Professional Guides
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {guides.map((guide, idx) => (
            <div
              key={idx}
              className="relative bg-amber-50 dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden flex flex-row"
            >
              {/* Top Rated Badge */}
              {guide.topRated && (
                <div className="absolute top-3 right-3 bg-teal-500 text-white text-xs px-3 py-1 rounded-full z-10 shadow flex items-center gap-1 font-semibold">
                  Top Rated <span>⭐</span>
                </div>
              )}

              {/* Left Side: Image */}
              <div className="w-1/2 h-full">
                <img
                  src={guide.photo}
                  alt={guide.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Right Side: Details */}
              <div className="w-1/2 h-full p-6 flex flex-col justify-center space-y-2">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {guide.name}
                </h2>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Guide Type:</strong> {guide.category}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Address:</strong> {guide.address}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>NIC:</strong> {guide.nic}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Languages:</strong> {guide.languages.join(", ")}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>License No:</strong> {guide.license}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Guides;
