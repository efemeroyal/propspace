import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { propertiesAPI } from "../api/properties";
import PropertyCard from "../components/ui/PropertyCard";
import toast from "react-hot-toast";
import { BiLoaderAlt } from "react-icons/bi";

export default function Dashboard() {
  const queryClient = useQueryClient();

  const { data: myProperties, isLoading } = useQuery({
    queryKey: ["my-properties"],
    queryFn: propertiesAPI.getMine,
  });

  const deleteMutation = useMutation({
    mutationFn: propertiesAPI.delete,
    onSuccess: () => {
      toast.success("Listing permanently removed.");
      queryClient.invalidateQueries(["my-properties"]);
    },
    onError: (err) => toast.error(err.message),
  });

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
              onDelete={(id) => {
                if (confirm("Confirm permanent removal?"))
                  deleteMutation.mutate(id);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
