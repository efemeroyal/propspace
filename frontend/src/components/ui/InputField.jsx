export default function InputField({ label, error, register, ...props }) {
  return (
    <div className="w-full flex flex-col gap-1.5">
      <label className="text-sm font-medium text-[#8896AB]">{label}</label>
      <input
        {...register}
        {...props}
        className="w-full px-4 py-3 bg-[#1A2638] border border-[#2A3B54] rounded-lg text-[#F7F4EF] focus:outline-none focus:border-[#F5A623] transition-colors"
      />
      {error && (
        <span className="text-xs text-red-400 mt-0.5">{error.message}</span>
      )}
    </div>
  );
}
