import { Link } from "react-router-dom";
import { Form } from "../components";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-100/50 rounded-full blur-3xl animate-pulse duration-700" />

      <div className="relative w-full max-w-md z-10">
        <div className="bg-white/70 backdrop-blur-xl border border-white/40 p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/50">
          <div className="space-y-2 mb-8 text-center animate-in fade-in slide-in-from-top-4 duration-1000">
            <h1 className="text-4xl font-black tracking-tight text-slate-900">
              Create an <span className="text-blue-600">Account</span>
            </h1>
            <p className="text-slate-500 font-medium">
              Join us to start managing your notes efficiently
            </p>
          </div>

          <Form type="signup" />

          <div className="mt-8 pt-6 border-t border-slate-100 text-center animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-300">
            <p className="text-slate-500 font-medium">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 font-bold hover:text-blue-700 transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
