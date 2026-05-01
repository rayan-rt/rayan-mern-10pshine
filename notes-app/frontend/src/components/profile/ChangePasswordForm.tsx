import React, { useState } from "react";
import { useUserContext } from "../../contexts/user.context";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, KeyRound, CheckCircle2, AlertCircle } from "lucide-react";

export default function ChangePasswordForm() {
  const { user, changePassword } = useUserContext();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      setLoading(true);
      setError("");
      setMessage("");
      const res = await changePassword({ oldPassword, newPassword });
      setLoading(false);

      if (res.success) {
        setMessage(res.message);
        setTimeout(() => navigate("/profile"), 2000);
      } else {
        setError(res.message || "Failed to change password");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="w-full max-w-md bg-white/60 backdrop-blur-xl border border-white/40 shadow-2xl rounded-[2.5rem] p-8">
        <Link
          to="/profile"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium mb-6 transition-colors"
        >
          <ArrowLeft size={18} /> Back to Profile
        </Link>

        {/* Icon & Title */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
            <KeyRound size={32} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Change Password
          </h2>
          <p className="text-slate-500 font-medium mt-1">Secure your account</p>
        </div>

        {message && (
          <div className="mb-6 flex items-center gap-2 bg-green-50 text-green-700 p-4 rounded-xl text-sm font-semibold animate-in fade-in">
            <CheckCircle2 size={18} /> {message}
          </div>
        )}

        {error && (
          <div className="mb-6 flex items-center gap-2 bg-red-50 text-red-700 p-4 rounded-xl text-sm font-semibold animate-in fade-in">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">
              Current Password
            </label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3.5 font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all placeholder:text-slate-400 shadow-sm"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3.5 font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all placeholder:text-slate-400 shadow-sm"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !oldPassword || !newPassword}
            className="w-full bg-linear-to-r from-indigo-600 to-purple-600 text-white font-bold px-6 py-4 rounded-2xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? "Updating..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
