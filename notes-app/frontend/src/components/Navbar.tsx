import { Menu, StickyNote, User } from "lucide-react";
import { useUserContext } from "../contexts/user.context";
import { LogoutButton } from "./auth";
import { nav_links } from "../constants/nav_links";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Sidebar } from ".";

export default function Navbar() {
  const { user } = useUserContext();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  return (
    <>
      <nav className="mb-8 animate-in fade-in slide-in-from-top-6 duration-1000">
        <div className="bg-white/60 backdrop-blur-xl border border-white/40 px-6 py-4 rounded-[2.5rem] shadow-2xl shadow-blue-500/5 flex items-center justify-between">
          {/* mobile */}
          <nav className="w-full flex items-center justify-between lg:hidden">
            <Link to={"/"}>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-linear-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                  <StickyNote size={24} />
                </div>
                <span className="text-2xl font-black tracking-tight text-slate-900 hidden sm:block">
                  <span className="text-blue-600">Shine</span> Note
                </span>
              </div>
            </Link>

            <div>
              <Menu
                onClick={() => setIsOpen((prev) => !prev)}
                size={24}
                className="text-slate-600 hover:text-blue-600 transition-colors"
              />
            </div>
          </nav>

          {/* Brand */}
          <Link to={"/"} className="hidden lg:block">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-linear-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                <StickyNote size={24} />
              </div>
              <span className="text-2xl font-black tracking-tight text-slate-900 hidden sm:block">
                <span className="text-blue-600">Shine</span> Note
              </span>
            </div>
          </Link>

          <nav className="hidden lg:items-center w-full lg:justify-between lg:flex flex-1 ml-8">
            <ul className="flex items-center gap-6">
              {nav_links.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-slate-600 hover:text-blue-600 font-medium transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Actions */}
            <div className="flex items-center gap-4 md:gap-8">
              <Link
                to={"/profile"}
                className="flex items-center gap-2 bg-blue-500/50 px-4 py-1.5 rounded-2xl hover:bg-blue-500/70 transition-colors hover:shadow-lg hover:shadow-blue-500/20"
              >
                <User size={20} />
                <span className="text-slate-800">Profile</span>
              </Link>
              <LogoutButton />
            </div>
          </nav>
        </div>
      </nav>

      {isOpen && <Sidebar setIsOpen={setIsOpen} />}
    </>
  );
}
