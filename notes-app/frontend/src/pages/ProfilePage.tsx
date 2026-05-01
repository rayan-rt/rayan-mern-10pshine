import { useUserContext } from "../contexts/user.context";
import {
  User as UserIcon,
  Mail,
  KeyRound,
  StickyNote,
  Pin,
  Edit3,
} from "lucide-react";
import { Link } from "react-router-dom";
import { DeleteProfileButton } from "../components";

export default function ProfilePage() {
  const { user } = useUserContext();

  if (!user) return null;

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4 animate-in fade-in slide-in-from-bottom-8 duration-700 w-full mb-8">
      {/* auth form like card */}
      <div className="w-full max-w-3xl bg-white/60 backdrop-blur-xl border border-white/40 shadow-2xl rounded-[2.5rem] p-8 md:p-12">
        {/* Header & Avatar */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
          {/* avatar on top left corner */}
          <div className="relative group shrink-0">
            <div className="w-32 h-32 bg-linear-to-br from-blue-600 to-indigo-600 rounded-[2rem] flex items-center justify-center text-white text-5xl font-black shadow-xl shadow-blue-500/30 transform transition-transform group-hover:scale-105">
              {user.username.charAt(0).toUpperCase()}
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-2">
            <h1 className="text-3xl font-bold text-slate-900 line-clamp-1">
              {user.username}
            </h1>
            <div className="flex flex-col sm:flex-row items-center md:items-start gap-2 sm:gap-6 text-slate-500">
              <span className="flex items-center gap-2">
                <Mail size={16} /> {user.email}
              </span>
              <span className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${user.isVerified ? "bg-green-500" : "bg-amber-500"}`}
                />
                {user.isVerified ? "Verified" : "Unverified"}
              </span>
            </div>

            {/* notes count, pinned notes count */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-8 pt-6 border-t border-slate-200/60">
              <div className="flex items-center gap-3 bg-blue-50 text-blue-700 px-5 py-2.5 rounded-2xl">
                <StickyNote size={18} />
                <span className="font-bold">
                  {user.notesCount || 0} span Notes
                </span>
              </div>
              <div className="flex items-center gap-3 bg-amber-50 text-amber-700 px-5 py-2.5 rounded-2xl">
                <Pin size={18} />
                <span className="font-bold">
                  {user.pinnedNotesCount || 0} Pinned
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Sections */}
        <div className="space-y-6">
          {/* change username */}
          <div className="bg-white/50 border border-slate-100 p-6 rounded-3xl transition-all hover:bg-white/80">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-slate-700">
                <UserIcon size={20} className="text-blue-500" />
                <span className="font-semibold text-lg">Username</span>
              </div>

              <Link
                to={"/update-username"}
                className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-xl transition-colors"
              >
                <Edit3 size={16} /> Edit
              </Link>
            </div>

            <p className="mt-2 text-slate-500 font-medium">{user.username}</p>
          </div>

          {/* change password */}
          <div className="bg-white/50 border border-slate-100 p-6 rounded-3xl transition-all hover:bg-white/80">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-slate-700">
                <KeyRound size={20} className="text-indigo-500" />
                <span className="font-semibold text-lg">Password</span>
              </div>

              <Link
                to={"/change-password"}
                className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-xl transition-colors"
              >
                <Edit3 size={16} /> Change
              </Link>
            </div>

            <p className="mt-2 text-slate-500 font-medium tracking-widest text-lg translate-y-1">
              ••••••••
            </p>
          </div>

          {/* Delete account - alert confirmation */}
          <div className="pt-6 border-t border-slate-200/60 mt-8 min-h-[120px]">
            <DeleteProfileButton />
          </div>
        </div>
      </div>
    </div>
  );
}
