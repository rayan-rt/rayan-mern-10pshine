import { StickyNote } from "lucide-react";
import { useUserContext } from "../contexts/user.context";
import { LogoutButton } from "./auth";

export default function Navbar() {
  const { user } = useUserContext();

  if (!user) return null;

  return (
    <nav className="mb-8 animate-in fade-in slide-in-from-top-6 duration-1000">
      <div className="bg-white/60 backdrop-blur-xl border border-white/40 px-6 py-4 rounded-[2.5rem] shadow-2xl shadow-blue-500/5 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-linear-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
            <StickyNote size={24} />
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900 hidden sm:block">
            <span className="text-blue-600">Shine</span> Note
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 md:gap-8">
          <div className="w-px h-8 bg-slate-200 hidden md:block" />

          <LogoutButton />
        </div>
      </div>
    </nav>
  );
}
