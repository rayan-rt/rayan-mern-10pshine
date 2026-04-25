import { KeyRound, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { ForgotPasswordForm } from "../components";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-5%] right-[-5%] w-[45%] h-[45%] bg-blue-100/60 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-5%] left-[-5%] w-[45%] h-[45%] bg-indigo-100/60 rounded-full blur-3xl animate-pulse duration-1000" />

      <div className="relative w-full max-w-md z-10">
        <div className="bg-white/70 backdrop-blur-xl border border-white/40 p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/50">
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

          <ForgotPasswordForm />

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
