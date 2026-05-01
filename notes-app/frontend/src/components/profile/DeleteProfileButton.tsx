import { useState } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { useUserContext } from "../../contexts/user.context";
import { useNavigate } from "react-router-dom";

export default function DeleteProfileButton() {
  const { deleteUser, logout } = useUserContext();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    const result = await deleteUser();
    if (result.success) {
      alert("Account deleted successfully!");
      setShowDeleteConfirm(false);
      // Wait for logout to clear cache
      await logout();
      navigate("/login");
    } else {
      alert(result.message);
    }
  };

  if (!showDeleteConfirm) {
    return (
      <div className="flex justify-center md:justify-start">
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="flex items-center gap-2 text-red-500 hover:text-red-700 hover:bg-red-50 p-3 rounded-2xl font-bold transition-colors"
        >
          <Trash2 size={20} /> Delete Account
        </button>
      </div>
    );
  }

  return (
    <div className="bg-red-50 border border-red-200 p-6 rounded-3xl animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex items-center gap-3 text-red-700 font-bold mb-2">
        <AlertTriangle size={24} /> Are you sure?
      </div>
      <p className="text-red-600/80 mb-5 font-medium max-w-lg mt-1">
        This action cannot be undone. All your notes, pinned links, and account
        data will be permanently wiped from the servers.
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={handleDeleteAccount}
          className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-red-500/20 active:scale-95"
        >
          Yes, delete my account
        </button>
        <button
          onClick={() => setShowDeleteConfirm(false)}
          className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-5 py-2.5 rounded-xl font-bold transition-all active:scale-95"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
