import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { authAPI } from "../api/auth";
import InputField from "../components/ui/InputField";

export default function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const mutation = useMutation({
    mutationFn: authAPI.register,
    onSuccess: () => {
      toast.success("Registration successful! Please sign in.");
      navigate("/login");
    },
    onError: (err) => {
      toast.error(err.message || "Registration sequence aborted by server.");
    },
  });

  return (
    <div className="max-w-md w-full mx-auto bg-[#162235] border border-[#25354C] rounded-2xl p-8 mt-6 shadow-2xl">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-extrabold tracking-tight">
          Create Credentials
        </h2>
        <p className="text-xs text-[#8896AB] mt-1">
          Join PropSpace to manage premium property portfolios
        </p>
      </div>

      <form
        onSubmit={handleSubmit((data) => {
          // Strip out confirmPassword so clean sanitation payloads hit the backend API
          const { confirmPassword, ...cleanPayload } = data;
          mutation.mutate(cleanPayload);
        })}
        className="space-y-4"
      >
        <InputField
          label="Username Identity"
          type="text"
          error={errors.username}
          register={register("username", {
            required: "Username handle is mandatory",
            minLength: { value: 3, message: "Must be at least 3 characters" },
          })}
        />

        <InputField
          label="Email Address"
          type="email"
          error={errors.email}
          register={register("email", {
            required: "Email anchor is mandatory",
            pattern: {
              value: /^\S+@\S+\.\S+$/i,
              message: "Invalid email structure format",
            },
          })}
        />

        <InputField
          label="Secure Password"
          type="password"
          error={errors.password}
          register={register("password", {
            required: "Secure password string is mandatory",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters long",
            },
          })}
        />

        <InputField
          label="Confirm Password"
          type="password"
          error={errors.confirmPassword}
          register={register("confirmPassword", {
            required: "Re-entry verification required",
            validate: (value) =>
              value === getValues("password") || "The passwords do not match",
          })}
        />

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-[#F5A623] hover:bg-[#E0921B] disabled:bg-[#F5A623]/50 text-[#0F1B2D] py-3 rounded-lg font-bold transition-all mt-2"
        >
          {mutation.isPending ? "Salting & Registering..." : "Register Account"}
        </button>
      </form>

      <p className="text-xs text-center text-[#8896AB] mt-6">
        Already possess an identity?{" "}
        <Link to="/login" className="text-[#F5A623] hover:underline">
          Access terminal login
        </Link>
      </p>
    </div>
  );
}
