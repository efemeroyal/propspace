import { HiOutlineMapPin, HiOutlineHome } from "react-icons/icons/hi2";
import { FiTrash2, FiEdit3 } from "react-icons/fi";

export default function PropertyCard({ property, isOwner, onEdit, onDelete }) {
  return (
    <div className="bg-[#162235] border border-[#25354C] rounded-xl overflow-hidden group hover:border-[#F5A623]/40 transition-all duration-300 flex flex-col h-full">
      {/* Image Container with Signature Amber Pill */}
      <div className="relative h-56 w-full overflow-hidden bg-[#1A2638]">
        <img
          src={
            property.imageUrl ||
            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80"
          }
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Signature Element: Price Pill bottom-left overlay */}
        <div className="absolute bottom-3 left-3 bg-[#F5A623] text-[#0F1B2D] text-xs font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-md shadow-lg">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: property.currency || "USD",
            maximumFractionDigits: 0,
          }).format(property.price)}
        </div>
        <div className="absolute top-3 right-3 bg-[#0F1B2D]/80 backdrop-blur-sm text-[#F7F4EF] text-xs px-2.5 py-1 rounded-full font-medium border border-[#25354C]">
          {property.propertyType}
        </div>
      </div>

      {/* Details Box */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-[#F7F4EF] tracking-tight line-clamp-1 mb-2">
            {property.title}
          </h3>
          <p className="text-sm text-[#8896AB] line-clamp-2 mb-4 font-light">
            {property.description}
          </p>
        </div>

        <div>
          <div className="flex items-center gap-1.5 text-xs text-[#8896AB] mb-4">
            <HiOutlineMapPin className="text-[#F5A623] shrink-0" size={16} />
            <span className="truncate">
              {property.location?.city}, {property.location?.country}
            </span>
          </div>

          {isOwner && (
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#25354C]">
              <button
                onClick={() => onEdit(property)}
                className="p-2 text-[#8896AB] hover:text-[#F5A623] hover:bg-[#1A2638] rounded-md transition-colors"
              >
                <FiEdit3 size={16} />
              </button>
              <button
                onClick={() => onDelete(property._id)}
                className="p-2 text-[#8896AB] hover:text-red-400 hover:bg-[#1A2638] rounded-md transition-colors"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
