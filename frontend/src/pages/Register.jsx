import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { authAPI } from "../api/auth";
import InputField from "../components/ui/InputField";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const passwordValues = watch("password");

  const mutation = useMutation({
    mutationFn: authAPI.register,
    onSuccess: () => {
      toast.success("Registration successful! Please sign in.");
      navigate("/login");
    },
    onError: (err) => toast.error(err.message || "Registration failed."),
  });

  return (
    <div className="max-w-md w-full mx-auto bg-[#162235] border border-[#25354C] rounded-2xl p-8 mt-6 shadow-2xl">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-extrabold tracking-tight">
          Create Account
        </h2>
        <p className="text-xs text-[#8896AB] mt-1">
          Join PropSpace to manage premium property portfolios
        </p>
      </div>

      <form
        onSubmit={handleSubmit((data) => {
          const { confirmPassword, ...cleanPayload } = data;
          mutation.mutate(cleanPayload);
        })}
        className="space-y-4"
      >
        <InputField
          label="Username"
          type="text"
          error={errors.username}
          register={register("username", {
            required: "Username is mandatory",
            minLength: { value: 3, message: "Must be at least 3 characters" },
          })}
        />
        <InputField
          label="Email Address"
          type="email"
          error={errors.email}
          register={register("email", {
            required: "Email is mandatory",
            pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" },
          })}
        />

        <InputField
          label="Password"
          type={showPassword ? "text" : "password"}
          error={errors.password}
          register={register("password", {
            required: "Password is mandatory",
            minLength: { value: 6, message: "Must be at least 6 characters" },
          })}
          suffix={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-[#8896AB] hover:text-[#F7F4EF] transition-colors"
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          }
        />

        <InputField
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          error={errors.confirmPassword}
          register={register("confirmPassword", {
            required: "Re-entry verification required",
            validate: (value) =>
              value === passwordValues || "The passwords do not match",
          })}
          suffix={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-[#8896AB] hover:text-[#F7F4EF] transition-colors"
            >
              {showConfirmPassword ? (
                <FiEyeOff size={18} />
              ) : (
                <FiEye size={18} />
              )}
            </button>
          }
        />

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-[#F5A623] hover:bg-[#E0921B] text-[#0F1B2D] py-3 rounded-lg font-bold transition-all mt-2"
        >
          {mutation.isPending ? "Registering..." : "Register Account"}
        </button>
      </form>
      <p className="text-xs text-center text-[#8896AB] mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-[#F5A623] hover:underline">
          Log In
        </Link>
      </p>
    </div>
  );
}
