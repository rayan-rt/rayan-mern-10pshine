import { useState } from "react";
import { LogOut, Loader2 } from "lucide-react";
import { useUserContext } from "../../contexts/user.context";
import { cn } from "../../utils/cn";

interface LogoutButtonProps {
  className?: string;
}

export default function LogoutButton({ className }: LogoutButtonProps) {
  const { logout } = useUserContext();
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

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={cn(
        "group relative flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all transform active:scale-95",
        "bg-red-500 text-white hover:bg-red-600",
        "shadow-lg shadow-red-500/10 hover:shadow-red-500/30",
        "disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden",
        className,
      )}
    >
      {isLoggingOut ? (
        <Loader2 size={18} className="animate-spin" data-testid="loader" />
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
      <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
    </button>
  );
}
