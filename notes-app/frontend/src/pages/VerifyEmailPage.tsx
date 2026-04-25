import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, ShieldCheck, Loader2, ArrowLeft } from "lucide-react";
import { useUserContext } from "../contexts/user.context";
import { useNavigate, Link } from "react-router-dom";
import { cn } from "../utils/cn";
// --

const verifySchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be exactly 6 characters"),
});

type VerifyData = z.infer<typeof verifySchema>;

export default function VerifyEmailPage() {
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
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-5%] left-[-5%] w-[45%] h-[45%] bg-emerald-100/60 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[45%] h-[45%] bg-blue-100/60 rounded-full blur-3xl animate-pulse duration-1000" />

      <div className="relative w-full max-w-md z-10">
        <div className="bg-white/70 backdrop-blur-xl border border-white/40 p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/50">
          <div className="space-y-2 mb-8 text-center animate-in fade-in slide-in-from-top-4 duration-1000">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl mb-2">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              Verify <span className="text-blue-600">Email</span>
            </h1>
            <p className="text-slate-500 font-medium px-4">
              We've sent a 6-digit verification code to your inbox.
            </p>
          </div>

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

          <div className="mt-8 pt-6 border-t border-slate-100 text-center animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-300">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-slate-500 font-bold hover:text-blue-600 transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
