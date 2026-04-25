import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Loader2, Mail, Lock, User } from "lucide-react";
import { useUserContext } from "../../contexts/user.context";
import { useNavigate } from "react-router-dom";
import { cn } from "../../utils/cn";

const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignupData = z.infer<typeof signupSchema>;

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { register: registerUser, loading } = useUserContext();
  const [formError, setFormError] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignupData) => {
    setFormError(null);
    try {
      const res = await registerUser(data);
      if (res.success) {
        navigate("/verify-email");
      } else {
        setFormError(res.message);
      }
    } catch (err: unknown) {
      setFormError(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700"
    >
      {formError && (
        <div className="p-3 text-sm font-medium text-red-500 bg-red-50 border border-red-100 rounded-xl animate-shake">
          {formError}
        </div>
      )}

      {/* Username Field */}
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-slate-700 ml-1">
          Username
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
            <User size={18} />
          </div>
          <input
            {...registerField("username")}
            type="text"
            placeholder="johndoe"
            required
            className={cn(
              "block w-full pl-10 pr-3 py-3 bg-white/50 backdrop-blur-sm border border-slate-200 rounded-2xl",
              "focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all",
              "placeholder:text-slate-400 text-slate-700",
              errors.username &&
                "border-red-300 focus:border-red-500 focus:ring-red-500/10",
            )}
          />
        </div>
        {errors.username && (
          <p className="text-xs text-red-500 ml-1 font-medium">
            {errors.username.message}
          </p>
        )}
      </div>

      {/* Email Field */}
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-slate-700 ml-1">
          Email Address
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
            <Mail size={18} />
          </div>
          <input
            {...registerField("email")}
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

      {/* Password Field */}
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-slate-700 ml-1">
          Password
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
            <Lock size={18} />
          </div>
          <input
            {...registerField("password")}
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            required
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
          "Create Account"
        )}
      </button>
    </form>
  );
}
