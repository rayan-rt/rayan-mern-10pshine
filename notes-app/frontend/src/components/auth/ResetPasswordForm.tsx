import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Lock, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import { useUserContext } from "../../contexts/user.context";
import { useNavigate, useParams, Link } from "react-router-dom";
import { cn } from "../../utils/cn";

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordForm() {
  const { resetPassword } = useUserContext();
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordData) => {
    if (!token) {
      setError("Reset token is missing. Please check your email link.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await resetPassword(token, data.password);
      if (res.success) {
        setIsSuccess(true);
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setError(res.message);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-4 animate-in zoom-in duration-500">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full mb-6">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Success!</h2>
        <p className="text-slate-500 font-medium mb-8">
          Your password has been reset successfully. Redirecting you to the
          login page now...
        </p>
        <Link
          to="/login"
          className="inline-flex py-3 px-8 rounded-2xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
        >
          Go to Login
        </Link>
      </div>
    );
  }

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

      {/* Password Field */}
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-slate-700 ml-1">
          New Password
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
            <Lock size={18} />
          </div>
          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className={cn(
              "block w-full pl-10 pr-10 py-3 bg-white/50 backdrop-blur-sm border border-slate-200 rounded-2xl",
              "focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all",
              "placeholder:text-slate-400 text-slate-700",
              errors.password &&
                "border-red-300 focus:border-red-500 focus:ring-red-500/10",
            )}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-red-500 ml-1 font-medium">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-slate-700 ml-1">
          Confirm Password
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
            <Lock size={18} />
          </div>
          <input
            {...register("confirmPassword")}
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className={cn(
              "block w-full pl-10 pr-3 py-3 bg-white/50 backdrop-blur-sm border border-slate-200 rounded-2xl",
              "focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all",
              "placeholder:text-slate-400 text-slate-700",
              errors.confirmPassword &&
                "border-red-300 focus:border-red-500 focus:ring-red-500/10",
            )}
          />
        </div>
        {errors.confirmPassword && (
          <p className="text-xs text-red-500 ml-1 font-medium">
            {errors.confirmPassword.message}
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
          "Reset Password"
        )}
      </button>
    </form>
  );
}
