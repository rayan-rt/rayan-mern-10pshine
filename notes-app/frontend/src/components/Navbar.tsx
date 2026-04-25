import { LogOut, User, StickyNote, Loader2 } from "lucide-react";
import { useUserContext } from "../contexts/user.context";
import { cn } from "../utils/cn";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useUserContext();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

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

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={cn(
              "group relative flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all transform active:scale-95",
              "bg-red-400 text-white hover:bg-red-600",
              "shadow-lg shadow-slate-900/10 hover:shadow-red-500/30",
              "disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden",
            )}
          >
            {isLoggingOut ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                <LogOut
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
                <span className="hidden sm:inline">Logout</span>
              </>
            )}

            {/* Background shimmer */}
            <div className="absolute inset-0 bg-white/10 translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
          </button>
        </div>
      </div>
    </nav>
  );
}
