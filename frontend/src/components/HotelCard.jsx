import React from "react";
import { Link } from "react-router-dom";

function HotelCard({ hotel }) {
  if (!hotel) return null;

  const firstImage =
    hotel.imageUrls && hotel.imageUrls.length > 0
      ? hotel.imageUrls[0]
      : "/default-hotel.jpg";

  return (
    <div className="group relative w-full border border-indigo-500 hover:border-2 h-[350px] overflow-hidden rounded-lg sm:w-[430px] transition-all">
      <Link to={`/hotel/${hotel._id}`}>
        <img
          src={firstImage}
          alt={hotel.name || "Hotel"}
          className="h-[260px] w-full object-cover group-hover:h-[200px] transition-all duration-300 z-20"
        />
      </Link>
      <div className="p-3 flex flex-col gap-1">
        <p className="text-lg font-semibold line-clamp-2">
          {hotel.name || "Unknown Hotel"}
        </p>
        <span className="italic text-sm">
          {hotel.location || "No location"}
        </span>
        <p className="text-sm text-gray-500">
          Rating: {hotel.ratings?.averageRating?.toFixed(1) ?? "No rating"}
        </p>
        <Link
          to={`/hotel/${hotel._id}`}
          className="z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-indigo-500
          text-indigo-500 hover:bg-indigo-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md
          !rounded-tl-none m-2"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

export default HotelCard;
