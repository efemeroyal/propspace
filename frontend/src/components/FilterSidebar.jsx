export default function FilterSidebar({ filters, setFilters }) {
  const propertyTypes = ["Apartment", "House", "Studio"];

  return (
    <div className="w-full lg:w-64 bg-[#162235] border border-[#25354C] rounded-xl p-5 shrink-0 h-fit space-y-6">
      <div>
        <h3 className="text-xs font-bold text-[#8896AB] uppercase tracking-wider mb-3">
          Search City
        </h3>
        <input
          type="text"
          value={filters.city}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, city: e.target.value }))
          }
          placeholder="e.g. Lagos, Nairobi..."
          className="w-full px-3 py-2 bg-[#0F1B2D] border border-[#25354C] rounded-lg text-sm text-[#F7F4EF] focus:outline-none focus:border-[#F5A623]"
        />
      </div>

      <div>
        <h3 className="text-xs font-bold text-[#8896AB] uppercase tracking-wider mb-3">
          Property Type
        </h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2.5 text-sm cursor-pointer text-[#F7F4EF]">
            <input
              type="radio"
              name="type"
              checked={filters.type === ""}
              onChange={() => setFilters((prev) => ({ ...prev, type: "" }))}
              className="accent-[#F5A623]"
            />
            All Properties
          </label>
          {propertyTypes.map((t) => (
            <label
              key={t}
              className="flex items-center gap-2.5 text-sm cursor-pointer text-[#F7F4EF]"
            >
              <input
                type="radio"
                name="type"
                checked={filters.type === t}
                onChange={() => setFilters((prev) => ({ ...prev, type: t }))}
                className="accent-[#F5A623]"
              />
              {t}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-[#8896AB] uppercase tracking-wider mb-3">
          Max Price
        </h3>
        <input
          type="number"
          value={filters.maxPrice}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, maxPrice: e.target.value }))
          }
          placeholder="Any Price"
          className="w-full px-3 py-2 bg-[#0F1B2D] border border-[#25354C] rounded-lg text-sm text-[#F7F4EF] focus:outline-none focus:border-[#F5A623]"
        />
      </div>
    </div>
  );
}
