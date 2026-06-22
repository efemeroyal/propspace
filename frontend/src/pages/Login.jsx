import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { authAPI } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import InputField from "../components/ui/InputField";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);

  const mutation = useMutation({
    mutationFn: authAPI.login,
    onSuccess: (data) => {
      login(data.token);
      toast.success("Welcome back to PropSpace!");
      navigate("/dashboard");
    },
    onError: (err) => {
      toast.error(err.message || "Authentication sequence failed.");
    },
  });

  return (
    <div className="max-w-md w-full mx-auto bg-[#162235] border border-[#25354C] rounded-2xl p-8 mt-12 shadow-2xl">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-extrabold tracking-tight">
          Access Terminal
        </h2>
        <p className="text-xs text-[#8896AB] mt-1">
          Sign in to manage your premium property assets
        </p>
      </div>

      <form
        onSubmit={handleSubmit((data) => mutation.mutate(data))}
        className="space-y-4"
      >
        <InputField
          label="Email Address"
          type="email"
          error={errors.email}
          register={register("email", {
            required: "Email identity is mandatory",
          })}
          placeholder="yourname@example.com"
        />

        <InputField
          label="Account Password"
          type={showPassword ? "text" : "password"}
          error={errors.password}
          register={register("password", {
            required: "Verification credential required",
          })}
          placeholder="••••••••"
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

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-[#F5A623] hover:bg-[#E0921B] disabled:bg-[#F5A623]/50 text-[#0F1B2D] py-3 rounded-lg font-bold transition-all mt-2"
        >
          {mutation.isPending ? "Validating State..." : "Sign In"}
        </button>
      </form>

      <p className="text-xs text-center text-[#8896AB] mt-6">
        No account registered?{" "}
        <Link to="/register" className="text-[#F5A623] hover:underline">
          Register here
        </Link>
      </p>
    </div>
  );
}
