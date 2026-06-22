import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { propertiesAPI } from "../api/properties";
import FilterSidebar from "../components/FilterSidebar";
import PropertyCard from "../components/ui/PropertyCard";
import { BiLoaderAlt } from "react-icons/bi";

export default function PublicFeed() {
  const [filters, setFilters] = useState({ city: "", type: "", maxPrice: "" });

  const queryParams = new URLSearchParams(
    Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== "")),
  ).toString();

  const {
    data: properties,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["properties", queryParams],
    queryFn: () => propertiesAPI.getAll(queryParams),
  });

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <FilterSidebar filters={filters} setFilters={setFilters} />

      <div className="flex-1">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-[#F7F4EF] tracking-tight sm:text-3xl">
            Find Your Next Space
          </h1>
          <p className="text-sm text-[#8896AB] mt-1 font-light">
            Explore trusted property listings across modern African cities.
          </p>
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-[#8896AB] gap-3">
            <BiLoaderAlt className="animate-spin text-[#F5A623]" size={36} />
            <p className="text-sm tracking-wide">Loading listings...</p>
          </div>
        )}

        {isError && (
          <div className="bg-red-950/20 border border-red-900/50 text-red-300 p-4 rounded-xl text-center text-sm py-8">
            Failed to retrieve listings pipeline. Check network parameters.
          </div>
        )}

        {!isLoading && !isError && properties?.length === 0 && (
          <div className="bg-[#162235] border border-[#25354C] p-12 rounded-xl text-center text-[#8896AB]">
            <p className="text-base font-medium text-[#F7F4EF]">
              No property matches found
            </p>
            <p className="text-xs mt-1 font-light">
              Adjust your search parameters on the filter matrix dashboard.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {properties?.map((property) => (
            <PropertyCard
              key={property._id}
              property={property}
              isOwner={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
