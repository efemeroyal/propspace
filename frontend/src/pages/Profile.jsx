import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { authAPI } from "../api/auth";
import InputField from "../components/ui/InputField";
import toast from "react-hot-toast";

export default function Profile() {
  const {
    register: regMetrics,
    handleSubmit: handleMetrics,
    reset,
  } = useForm();
  const {
    register: regSec,
    handleSubmit: handleSec,
    reset: resetSec,
  } = useForm();

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: authAPI.getProfile,
    onSuccess: (data) => reset(data),
  });

  const updateMetrics = useMutation({
    mutationFn: authAPI.updateProfile,
    onSuccess: () => toast.success("Profile configurations updated."),
    onError: (err) => toast.error(err.message),
  });

  const updatePassword = useMutation({
    mutationFn: authAPI.updatePassword,
    onSuccess: () => {
      toast.success("Security configurations changed successfully.");
      resetSec();
    },
    onError: (err) => toast.error(err.message),
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
      <div className="bg-[#162235] border border-[#25354C] p-6 rounded-xl space-y-4">
        <h2 className="text-lg font-bold">Profile Configurations</h2>
        <form
          onSubmit={handleMetrics((data) => updateMetrics.mutate(data))}
          className="space-y-4"
        >
          <InputField
            label="Profile Full Name"
            defaultValue={profile?.name}
            register={regMetrics("name")}
          />
          <InputField
            label="Contact Phone Line"
            defaultValue={profile?.phone}
            register={regMetrics("phone")}
          />
          <InputField
            label="Avatar URL String"
            defaultValue={profile?.avatar}
            register={regMetrics("avatar")}
          />
          <button
            type="submit"
            className="bg-[#F5A623] text-[#0F1B2D] px-4 py-2 rounded-lg font-bold text-sm"
          >
            Save Metrics
          </button>
        </form>
      </div>

      <div className="bg-[#162235] border border-[#25354C] p-6 rounded-xl space-y-4">
        <h2 className="text-lg font-bold">Security Controls</h2>
        <form
          onSubmit={handleSec((data) => updatePassword.mutate(data))}
          className="space-y-4"
        >
          <InputField
            label="Current Password"
            type="password"
            register={regSec("oldPassword", { required: true })}
          />
          <InputField
            label="New Complex Password"
            type="password"
            register={regSec("newPassword", { required: true })}
          />
          <button
            type="submit"
            className="bg-[#1E2E46] border border-[#2A3B54] text-[#F7F4EF] px-4 py-2 rounded-lg font-bold text-sm"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
