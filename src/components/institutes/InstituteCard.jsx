import React from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  ExternalLink,
  GraduationCap,
  ChevronRight,
} from "lucide-react";

const InstituteCard = ({ institute }) => {
  const hasImage = Boolean(institute.imageUrl);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
      {/* Image or fallback */}
      <div className="w-full h-40 flex items-center justify-center bg-blue-100">
        {hasImage ? (
          <img
            src={institute.imageUrl}
            alt={`${institute.name} image`}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-blue-900 text-center text-lg font-semibold">
            {institute.name}
          </span>
        )}
      </div>

      <div className="flex flex-col justify-between flex-grow p-5">
        {/* Institute Name */}
        <h3 className="font-semibold text-lg text-gray-800 mb-3">
          {institute.name}
        </h3>

        {/* Location */}
        <div className="flex items-start mb-2">
          <MapPin className="w-4 h-4 text-gray-500 mt-0.5 mr-1 flex-shrink-0" />
          <span className="text-sm text-gray-600">
            {institute.location.city}, {institute.location.state}
          </span>
        </div>

        {/* Courses Offered */}
        <div className="flex items-center mb-2">
          <GraduationCap className="w-4 h-4 text-gray-500 mr-1 flex-shrink-0" />
          <span className="text-sm text-gray-600">
            {institute.courses.length} Courses Offered
          </span>
        </div>

        {/* Affiliation */}
        <div className="mb-4">
          <span className="text-xs font-medium bg-blue-50 text-blue-800 px-2 py-1 rounded-full">
            {institute.affilication || "Not Affiliated"}
          </span>
        </div>

        {/* Links */}
        <div className="flex items-center justify-between">
          <Link
            to={`/institutes/${institute._id}`}
            className="flex items-center text-blue-800 font-medium text-sm hover:text-blue-600"
          >
            View Details <ChevronRight className="w-4 h-4 ml-1" />
          </Link>

          <a
            href={institute.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-blue-600"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default InstituteCard;
