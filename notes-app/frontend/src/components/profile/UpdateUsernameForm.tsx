import React, { useState } from "react";
import { useUserContext } from "../../contexts/user.context";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, User, CheckCircle2 } from "lucide-react";

export default function UpdateUsernameForm() {
  const { user, updateProfile } = useUserContext();
  const [newUsername, setNewUsername] = useState(user?.username || "");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpdateUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newUsername !== user?.username && user) {
      setLoading(true);
      const res = await updateProfile({ username: newUsername });
      setLoading(false);
      if (res.success) {
        setMessage(res.message);
        setTimeout(() => navigate("/profile"), 2000);
      } else {
        setMessage(res.message || "Failed to update username");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="w-full max-w-md bg-white/60 backdrop-blur-xl border border-white/40 shadow-2xl rounded-[2.5rem] p-8">
        <Link
          to="/profile"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium mb-6 transition-colors"
        >
          <ArrowLeft size={18} /> Back to Profile
        </Link>

        {/* Icon & Title */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
            <User size={32} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Update Username
          </h2>
          <p className="text-slate-500 font-medium mt-1">
            Choose a new display name
          </p>
        </div>

        {message && (
          <div className="mb-6 flex items-center gap-2 bg-blue-50 text-blue-700 p-4 rounded-xl text-sm font-semibold">
            <CheckCircle2 size={18} /> {message}
          </div>
        )}

        <form onSubmit={handleUpdateUsername} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="newUsername"
              className="text-sm font-bold text-slate-700 ml-1"
            >
              New Username
            </label>
            <input
              id="newUsername"
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3.5 font-medium text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all placeholder:text-slate-400 shadow-sm"
              placeholder="e.g. johndoe"
              required
            />
          </div>

          <button
            type="submit"
            disabled={
              loading || newUsername === user?.username || !newUsername.trim()
            }
            className="w-full bg-linear-to-r from-blue-600 to-indigo-600 text-white font-bold px-6 py-4 rounded-2xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Updating..." : "Update Username"}
          </button>
        </form>
      </div>
    </div>
  );
}
