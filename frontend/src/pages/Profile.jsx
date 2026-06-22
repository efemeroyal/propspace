import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { authAPI } from "../api/auth";
import InputField from "../components/ui/InputField";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";

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
    watch,
    formState: { errors },
  } = useForm();

  // Dynamic password visibility states
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Watch the new password field to compare it with the confirmation field
  const newPasswordValue = watch("newPassword");

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
      toast.success("Password updated successfully.");
      resetSec(); // Clears all password fields
      setShowOldPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    },
    onError: (err) => {
      // Catch backend errors (like wrong old password) gracefully without breaking
      toast.error(
        err.message || "Failed to update password. Verify current password.",
      );
    },
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {/* LEFT COLUMN: PROFILE METRICS SETTINGS */}
      <div className="bg-[#162235] border border-[#25354C] p-6 rounded-xl space-y-4 h-fit">
        <h2 className="text-lg font-bold">Profile Settings</h2>
        <form
          onSubmit={handleMetrics((data) => updateMetrics.mutate(data))}
          className="space-y-4"
        >
          <InputField
            label="Username"
            defaultValue={profile?.username}
            register={regMetrics("username")}
          />
          <InputField
            label="Email Address"
            defaultValue={profile?.email}
            register={regMetrics("email")}
          />
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
            disabled={updateMetrics.isPending}
            className="bg-[#F5A623] hover:bg-[#E0921B] disabled:bg-[#F5A623]/50 text-[#0F1B2D] px-4 py-2 rounded-lg font-bold text-sm transition-colors"
          >
            {updateMetrics.isPending ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      {/* RIGHT COLUMN: SECURITY & PASSWORD CHANGE */}
      <div className="bg-[#162235] border border-[#25354C] p-6 rounded-xl space-y-4 h-fit">
        <h2 className="text-lg font-bold">Change Password</h2>
        <form
          onSubmit={handleSec((data) => {
            // Send only what the backend requires (oldPassword, newPassword)
            updatePassword.mutate({
              oldPassword: data.oldPassword,
              newPassword: data.newPassword,
            });
          })}
          className="space-y-4"
        >
          {/* Current Password Field (Left completely blank intentionally) */}
          <div className="relative">
            <InputField
              label="Current Password"
              type={showOldPassword ? "text" : "password"}
              error={errors.oldPassword}
              register={regSec("oldPassword", {
                required: "You must enter your current password",
              })}
            />
            <button
              type="button"
              onClick={() => setShowOldPassword(!showOldPassword)}
              className="absolute right-4 bottom-3.5 text-[#8896AB] hover:text-[#F7F4EF] transition-colors"
            >
              {showOldPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>

          {/* New Password Input Field */}
          <div className="relative">
            <InputField
              label="New Complex Password"
              type={showNewPassword ? "text" : "password"}
              error={errors.newPassword}
              register={regSec("newPassword", {
                required: "New password is required",
                minLength: {
                  value: 6,
                  message: "Must be at least 6 characters",
                },
              })}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-4 bottom-3.5 text-[#8896AB] hover:text-[#F7F4EF] transition-colors"
            >
              {showNewPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>

          {/* Confirm New Password Input Field */}
          <div className="relative">
            <InputField
              label="Confirm New Password"
              type={showConfirmPassword ? "text" : "password"}
              error={errors.confirmPassword}
              register={regSec("confirmPassword", {
                required: "Please confirm your new password",
                validate: (value) =>
                  value === newPasswordValue || "The passwords do not match",
              })}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 bottom-3.5 text-[#8896AB] hover:text-[#F7F4EF] transition-colors"
            >
              {showConfirmPassword ? (
                <FiEyeOff size={18} />
              ) : (
                <FiEye size={18} />
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={updatePassword.isPending}
            className="w-full bg-[#1E2E46] hover:bg-[#2A3B54] disabled:bg-[#1E2E46]/50 border border-[#2A3B54] text-[#F7F4EF] px-4 py-2 rounded-lg font-bold text-sm transition-colors mt-2"
          >
            {updatePassword.isPending ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
