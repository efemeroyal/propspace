export default function InputField({
  label,
  error,
  register,
  suffix,
  ...props
}) {
  return (
    <div className="w-full flex flex-col gap-1.5">
      <label className="text-sm font-medium text-[#8896AB]">{label}</label>

      {/* Flex container groups the input line and its suffix element safely */}
      <div className="relative flex items-center bg-[#1A2638] border border-[#2A3B54] rounded-lg focus-within:border-[#F5A623] transition-colors overflow-hidden">
        <input
          {...register}
          {...props}
          className="w-full px-4 py-3 bg-transparent text-[#F7F4EF] focus:outline-none text-sm placeholder-[#8896AB]/40"
        />
        {suffix && (
          <div className="pr-4 flex items-center justify-center shrink-0">
            {suffix}
          </div>
        )}
      </div>

      {/* Error container sits cleanly underneath the input block without affecting icon spacing */}
      {error && (
        <span className="text-xs text-red-400 mt-0.5 pl-1">
          {error.message}
        </span>
      )}
    </div>
  );
}
