import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { propertiesAPI } from "../api/properties";
import PropertyCard from "../components/ui/PropertyCard";
import InputField from "../components/ui/InputField";
import toast from "react-hot-toast";
import { BiLoaderAlt } from "react-icons/bi";
import { IoClose } from "react-icons/io5";

export default function Dashboard() {
  const queryClient = useQueryClient();
  const [editingProperty, setEditingProperty] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // 1. Read Private Feed Mutation
  const { data: myProperties, isLoading } = useQuery({
    queryKey: ["my-properties"],
    queryFn: propertiesAPI.getMine,
  });

  // 2. Update Mutation (The missing piece)
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => propertiesAPI.update(id, data),
    onSuccess: () => {
      toast.success("Listing updated successfully!");
      queryClient.invalidateQueries(["my-properties"]); // Refresh state
      setEditingProperty(null); // Close Modal
    },
    onError: (err) =>
      toast.error(err.message || "Failed to update property details."),
  });

  // 3. Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: propertiesAPI.delete,
    onSuccess: () => {
      toast.success("Listing permanently removed.");
      queryClient.invalidateQueries(["my-properties"]);
    },
    onError: (err) => toast.error(err.message),
  });

  // Triggered when user clicks the edit icon on a PropertyCard
  const handleEditClick = (property) => {
    setEditingProperty(property);
    reset({
      title: property.title,
      description: property.description,
      price: property.price,
      propertyType: property.propertyType,
      city: property?.city,
      country: property?.country,
      imageUrl: property.imageUrl,
      "location.city": property.location?.city,
      "location.country": property.location?.country,
    });
  };

  const onUpdateSubmit = (data) => {
    // Reconstruct the nested object structure to match schema demands
    const formattedData = {
      title: data.title,
      description: data.description,
      price: Number(data.price),
      propertyType: data.propertyType,
      imageUrl: data.imageUrl,
      location: {
        city: data["location.city"],
        country: data["location.country"],
      },
    };
    updateMutation.mutate({ id: editingProperty._id, data: formattedData });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[#25354C] pb-5">
        <div>
          <h1 className="text-2xl font-black">My Listings Portfolio</h1>
          <p className="text-sm text-[#8896AB] font-light">
            Manage your created market property cards
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <BiLoaderAlt className="animate-spin text-[#F5A623]" size={36} />
        </div>
      ) : myProperties?.length === 0 ? (
        <div className="bg-[#162235] border border-[#25354C] p-12 rounded-xl text-center text-[#8896AB]">
          You have not created any property listings yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myProperties?.map((prop) => (
            <PropertyCard
              key={prop._id}
              property={prop}
              isOwner={true}
              onEdit={handleEditClick}
              onDelete={(id) => {
                if (confirm("Confirm permanent removal?"))
                  deleteMutation.mutate(id);
              }}
            />
          ))}
        </div>
      )}

      {/* UPDATE MODAL DIALOG DIALOG OVERLAY */}
      {editingProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F1B2D]/80 backdrop-blur-sm p-4">
          <div className="bg-[#162235] border border-[#25354C] w-full max-w-lg rounded-2xl p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingProperty(null)}
              className="absolute top-4 right-4 text-[#8896AB] hover:text-[#F7F4EF] transition-colors"
            >
              <IoClose size={24} />
            </button>

            <div className="mb-4">
              <h2 className="text-xl font-bold">Edit Property Details</h2>
              <p className="text-xs text-[#8896AB]">
                Modify metrics for your listing asset
              </p>
            </div>

            <form onSubmit={handleSubmit(onUpdateSubmit)} className="space-y-4">
              <InputField
                label="Property Listing Title"
                error={errors.title}
                register={register("title", { required: "Title is required" })}
              />

              <div className="w-full flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#8896AB]">
                  Description
                </label>
                <textarea
                  {...register("description", {
                    required: "Description is required",
                  })}
                  rows={3}
                  className="w-full px-4 py-3 bg-[#1A2638] border border-[#2A3B54] rounded-lg text-[#F7F4EF] focus:outline-none focus:border-[#F5A623] transition-colors text-sm"
                />
                {errors.description && (
                  <span className="text-xs text-red-400">
                    {errors.description.message}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Price (USD)"
                  type="number"
                  error={errors.price}
                  register={register("price", {
                    required: "Price is required",
                  })}
                />
                <div className="w-full flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[#8896AB]">
                    Property Type
                  </label>
                  <select
                    {...register("propertyType", { required: true })}
                    className="w-full px-4 py-3 bg-[#1A2638] border border-[#2A3B54] rounded-lg text-[#F7F4EF] focus:outline-none focus:border-[#F5A623] transition-colors text-sm"
                  >
                    <option value="Apartment">Apartment</option>
                    <option value="House">House</option>
                    <option value="Studio">Studio</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="City"
                  error={errors["location.city"]}
                  register={register("location.city", {
                    required: "City required",
                  })}
                />
                <InputField
                  label="Country"
                  error={errors["location.country"]}
                  register={register("location.country", {
                    required: "Country required",
                  })}
                />
              </div>

              <InputField
                label="Image URL String"
                error={errors.imageUrl}
                register={register("imageUrl", {
                  required: "Image path is asset baseline",
                })}
              />

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingProperty(null)}
                  className="px-4 py-2 bg-[#1E2E46] hover:bg-[#2A3B54] text-sm font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="px-4 py-2 bg-[#F5A623] hover:bg-[#E0921B] text-[#0F1B2D] text-sm font-bold rounded-lg transition-all"
                >
                  {updateMutation.isPending ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
