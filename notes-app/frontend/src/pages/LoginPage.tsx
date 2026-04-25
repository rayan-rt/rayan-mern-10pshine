import { Link } from "react-router-dom";
import { LoginForm } from "../components";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-5%] right-[-5%] w-[45%] h-[45%] bg-indigo-100/60 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-5%] left-[-5%] w-[45%] h-[45%] bg-blue-100/60 rounded-full blur-3xl animate-pulse duration-1000" />

      <div className="relative w-full max-w-md z-10">
        <div className="bg-white/70 backdrop-blur-xl border border-white/40 p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/50">
          <div className="space-y-2 mb-8 text-center animate-in fade-in slide-in-from-top-4 duration-1000">
            <h1 className="text-4xl font-black tracking-tight text-slate-900">
              Welcome <span className="text-blue-600">Back</span>
            </h1>
            <p className="text-slate-500 font-medium">
              Log in to access your secure dashboard
            </p>
          </div>

          <LoginForm />

          <div className="mt-8 pt-6 border-t border-slate-100 text-center animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-300">
            <p className="text-slate-500 font-medium">
              Don&apos;t have an account?{" "}
              <Link
                to="/signup"
                className="text-blue-600 font-bold hover:text-blue-700 transition-colors"
              >
                Create Account
              </Link>
            </p>
            <p>
              Forgot password?{" "}
              <Link
                to="/forgot-password"
                className="text-blue-600 font-bold hover:text-blue-700 transition-colors"
              >
                Reset Password
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
