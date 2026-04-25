import { KeyRound } from "lucide-react";
import { ResetPasswordForm } from "../components";

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-5%] left-[-5%] w-[45%] h-[45%] bg-blue-100/60 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[45%] h-[45%] bg-indigo-100/60 rounded-full blur-3xl animate-pulse duration-1000" />

      <div className="relative w-full max-w-md z-10">
        <div className="bg-white/70 backdrop-blur-xl border border-white/40 p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/50">
          <div className="space-y-2 mb-8 text-center animate-in fade-in slide-in-from-top-4 duration-1000">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl mb-2">
              <KeyRound size={32} />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              New <span className="text-blue-600">Password</span>
            </h1>
            <p className="text-slate-500 font-medium px-4">
              Please enter your new password below to reset your account.
            </p>
          </div>

          <ResetPasswordForm />
        </div>
      </div>
    </div>
  );
}
