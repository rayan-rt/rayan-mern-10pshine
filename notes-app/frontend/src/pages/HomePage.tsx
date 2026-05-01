import { User, Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8 px-4 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Hero Section */}
      <div className="space-y-4 max-w-2xl">
        <h1 className="text-5xl md:text-6xl font-black tracking-tight text-slate-900">
          Welcome to{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600 drop-shadow-sm">
            Shine
          </span>{" "}
          Notes
        </h1>
        <p className="text-xl text-slate-200 font-medium max-w-lg mx-auto">
          Capture your thoughts, organize your daily workflow, and stay
          productive seamlessly.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mt-6 w-full sm:w-auto px-6 sm:px-0">
        <Link
          to="/create-note"
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white px-8 py-3.5 rounded-2xl font-bold hover:opacity-90 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/30 active:scale-95"
        >
          <Plus size={22} />
          <span>Create a Note</span>
        </Link>
        <Link
          to={"/profile"}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-slate-700 border-2 border-slate-200 px-8 py-3.5 rounded-2xl font-bold hover:bg-slate-50 hover:border-slate-300 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/50 active:scale-95"
        >
          <User size={22} className="text-slate-500" />
          <span>Profile</span>
        </Link>
      </div>
    </div>
  );
}
