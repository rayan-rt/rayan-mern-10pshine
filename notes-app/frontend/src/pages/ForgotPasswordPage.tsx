import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, ArrowLeft, Loader2, KeyRound, CheckCircle2 } from "lucide-react";
import { useUserContext } from "../contexts/user.context";
import { Link } from "react-router-dom";
import { cn } from "../utils/cn";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const { forgotPassword } = useUserContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await forgotPassword(data.email);
      if (res.success) {
        setIsSubmitted(true);
      } else {
        setError(res.message);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-5%] right-[-5%] w-[45%] h-[45%] bg-blue-100/60 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-5%] left-[-5%] w-[45%] h-[45%] bg-indigo-100/60 rounded-full blur-3xl animate-pulse duration-1000" />

      <div className="relative w-full max-w-md z-10">
        <div className="bg-white/70 backdrop-blur-xl border border-white/40 p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/50">
          {!isSubmitted ? (
            <>
              <div className="space-y-2 mb-8 text-center animate-in fade-in slide-in-from-top-4 duration-1000">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl mb-2">
                  <KeyRound size={32} />
                </div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900">
                  Forgot <span className="text-blue-600">Password?</span>
                </h1>
                <p className="text-slate-500 font-medium px-4">
                  No worries! Enter your email and we'll send you reset
                  instructions.
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

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 ml-1">
                    Email Address
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
                    "Send Reset Link"
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4 animate-in zoom-in duration-500">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">
                Check Your Email
              </h2>
              <p className="text-slate-500 font-medium mb-8">
                We've sent a password reset link to your email address. Please
                check your inbox and spam folder.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="text-blue-600 font-bold hover:underline"
              >
                Didn't receive the email? Try again
              </button>
            </div>
          )}

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
