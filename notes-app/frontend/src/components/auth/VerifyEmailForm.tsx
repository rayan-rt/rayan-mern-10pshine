import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, ShieldCheck, Loader2 } from "lucide-react";
import { useUserContext } from "../../contexts/user.context";
import { useNavigate } from "react-router-dom";
import { cn } from "../../utils/cn";

const verifySchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be exactly 6 characters"),
});

type VerifyData = z.infer<typeof verifySchema>;

export default function VerifyEmailForm() {
  const { verifyEmail, loading, user } = useUserContext();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyData>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      email: user?.email || "",
      otp: "",
    },
  });

  const onSubmit = async (data: VerifyData) => {
    setError(null);
    try {
      const res = await verifyEmail(data);
      if (res.success) {
        navigate("/");
      } else {
        setError(res.message);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Verification failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-700"
    >
      {error && (
        <div className="p-3 text-sm font-medium text-red-500 bg-red-50 border border-red-100 rounded-xl animate-shake">
          {error}
        </div>
      )}

      {/* Email Field */}
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-slate-700 ml-1">
          Email you used for registration
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
            <Mail size={18} />
          </div>
          <input
            {...register("email")}
            type="email"
            placeholder="john@example.com"
            required
            className={cn(
              "block w-full pl-10 pr-3 py-3 bg-white/50 backdrop-blur-sm border border-slate-200 rounded-2xl",
              "focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all",
              "placeholder:text-slate-400 text-slate-700",
              errors.email &&
                "border-red-300 focus:border-red-500 focus:ring-red-500/10",
            )}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-red-500 ml-1 font-medium">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* OTP Field */}
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-slate-700 ml-1">
          Verification Code
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
            <ShieldCheck size={18} />
          </div>
          <input
            {...register("otp")}
            type="text"
            maxLength={6}
            placeholder="123456"
            required
            className={cn(
              "block w-full pl-10 pr-3 py-3 bg-white/50 backdrop-blur-sm border border-slate-200 rounded-2xl",
              "focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all",
              "placeholder:text-slate-400 text-slate-700 tracking-[0.5em] font-mono",
              errors.otp &&
                "border-red-300 focus:border-red-500 focus:ring-red-500/10",
            )}
          />
        </div>
        {errors.otp && (
          <p className="text-xs text-red-500 ml-1 font-medium">
            {errors.otp.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className={cn(
          "w-full py-4 px-6 rounded-2xl font-bold text-white transition-all transform active:scale-[0.98]",
          "bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700",
          "shadow-xl shadow-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/30",
          "disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2",
        )}
      >
        {loading ? (
          <Loader2 className="animate-spin" size={20} />
        ) : (
          "Verify & Continue"
        )}
      </button>
    </form>
  );
}
