import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { propertiesAPI } from "../api/properties";
import PropertyCard from "../components/ui/PropertyCard";
import { BiLoaderAlt, BiSearch } from "react-icons/bi";

export default function PublicFeed() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All"); // Tracks the selected category badge

  // Available filters matching your database schema options
  const filterBadges = ["All", "Apartment", "House", "Studio"];

  // Read Property Feed, passing state arguments directly into the dependency array
  const {
    data: properties,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["properties", selectedType, searchQuery],
    queryFn: () =>
      propertiesAPI.getAll({
        type: selectedType === "All" ? "" : selectedType,
        search: searchQuery,
      }),
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* HERO SEARCH HEADER & BADGES */}
      <div className="bg-[#162235] border border-[#25354C] rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl">
        <div className="max-w-xl">
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[#F7F4EF]">
            Find Your Next Space
          </h1>
          <p className="text-xs md:text-sm text-[#8896AB] mt-1 font-light">
            Explore trusted property listings across modern African cities.
          </p>
        </div>

        {/* SEARCH AND BADGE FILTERS INTERACTION PANEL */}
        <div className="space-y-4">
          {/* Custom Search Input Box */}
          <div className="relative flex items-center bg-[#1A2638] border border-[#2A3B54] rounded-xl focus-within:border-[#F5A623] transition-colors overflow-hidden max-w-md">
            <div className="pl-4 text-[#8896AB]">
              <BiSearch size={20} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, city, description..."
              className="w-full px-3 py-3.5 bg-transparent text-[#F7F4EF] focus:outline-none text-sm placeholder-[#8896AB]/30"
            />
          </div>

          {/* CHIP/BADGE SELECTION GRID */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#8896AB]">
              Filter Category
            </label>
            <div className="flex flex-wrap gap-2.5 mt-2">
              {filterBadges.map((badge) => {
                const isActive = selectedType === badge;
                return (
                  <button
                    key={badge}
                    type="button"
                    onClick={() => setSelectedType(badge)}
                    className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all border ${
                      isActive
                        ? "bg-[#F5A623] border-[#F5A623] text-[#0F1B2D] shadow-lg shadow-[#F5A623]/10 scale-[1.03]"
                        : "bg-[#1A2638] border-[#2A3B54] text-[#8896AB] hover:text-[#F7F4EF] hover:border-[#8896AB]/40"
                    }`}
                  >
                    {badge}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* RENDER PIPELINE STATES (As specified by evaluation guidelines) */}
      {isLoading ? (
        <div className="flex justify-center py-24">
          <BiLoaderAlt className="animate-spin text-[#F5A623]" size={40} />
        </div>
      ) : isError ? (
        <div className="bg-[#162235]/50 border border-red-500/20 text-red-400 p-6 rounded-xl text-center text-sm font-medium">
          Error syncing with backend cluster. Ensure API connection points are
          running.
        </div>
      ) : properties?.length === 0 ? (
        <div className="bg-[#162235] border border-[#25354C] p-16 rounded-xl text-center text-[#8896AB] font-light">
          No available listings fit your active badge search filters.
        </div>
      ) : (
        /* GRID LAYOUT LISTINGS CONTAINER */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
          {properties?.map((prop) => (
            <PropertyCard key={prop._id} property={prop} />
          ))}
        </div>
      )}
    </div>
  );
}
