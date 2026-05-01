import React from "react";
import { nav_links } from "../constants/nav_links";
import { Link } from "react-router-dom";
import { LogoutButton } from ".";
import { X, User } from "lucide-react";

export default function Sidebar({
  setIsOpen,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <>
      <div
        className="fixed inset-0 bg-black/20 z-40 lg:hidden backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />
      <div className="fixed top-0 right-0 h-screen w-64 bg-white shadow-2xl z-50 lg:hidden p-6 flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex justify-end mb-8">
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={24} className="text-slate-600" />
          </button>
        </div>

        <div className="flex flex-col flex-1">
          <ul className="flex flex-col gap-2">
            {nav_links.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  className="text-slate-600 hover:text-blue-600 font-medium transition-colors block p-2 rounded-lg hover:bg-blue-50"
                  onClick={() => setIsOpen(false)}
                >
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-4 pt-6 mt-auto border-t border-slate-100">
          <Link
            to={"/profile"}
            className="flex items-center gap-3 text-slate-700 hover:text-blue-600 p-2 font-medium transition-colors rounded-lg hover:bg-blue-50"
            onClick={() => setIsOpen(false)}
          >
            <User size={20} />
            <span>Profile</span>
          </Link>
          <div className="px-2 pb-2">
            <LogoutButton />
          </div>
        </div>
      </div>
    </>
  );
}
