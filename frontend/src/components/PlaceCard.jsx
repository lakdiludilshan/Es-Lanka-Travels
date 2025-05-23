import React from "react";
import { Link } from "react-router-dom";

function PlaceCard({ place }) {
  if (!place) {
    return null; 
  }

  return (
    <div className="group relative w-full border border-teal-500 hover:border-2 h-[350px] overflow-hidden rounded-lg
    sm:w-[430px] transition-all">
      <Link to={`/place/${place._id}`}>
        <img
          src={place.imageUrl || "/default-placeholder.jpg"}
          alt={place.name || "Unknown Place"}
          className="h-[260px] w-full object-cover group-hover:h-[200px] transition-all duration-300 z-20"
        />
      </Link>
      <div className="p-3 flex flex-col gap-1">
        <p className="text-lg font-semibold line-clamp-2">{place.name || "Unknown Place"}</p>
        <span className="italic text-sm">{place.category || "No category"}</span>

        <p className="text-sm text-gray-500">
          Rating: {place.ratings.averageRating !== undefined ? place.ratings.averageRating : "No rating"}
        </p>

        <Link to={`/place/${place._id}`}
          className="z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-teal-500
          text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md
          !rounded-tl-none m-2">
            View Details
        </Link>
      </div>
    </div>
  );
}

export default PlaceCard;
