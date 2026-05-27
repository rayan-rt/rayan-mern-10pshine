import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { NoteCard } from "../components";
import { useNoteContext } from "../contexts/note.context";
import { Search, Plus, ArrowUpFromLine } from "lucide-react";

export default function NotesPage() {
  const { notes, readNotes, loading } = useNoteContext();
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Optimization: Debounce API call heavily to prevent spam
    const timer = setTimeout(() => {
      readNotes(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search, readNotes]);

  let content;

  if (loading && !notes) {
    content = (
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  } else if (notes && notes.length > 0) {
    content = (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {notes.map((note) => (
          <NoteCard key={note._id} note={note} />
        ))}
      </div>
    );
  } else {
    content = (
      <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-gray-200 border-dashed">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-600 mb-4">
          <Search className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">No notes found</h3>
        <p className="mt-2 text-base text-gray-500">
          {search
            ? "Try adjusting your search terms."
            : "Get started by creating a new note to organize your life."}
        </p>
        {!search && (
          <div className="mt-8">
            <Link
              to="/create-note"
              className="inline-flex items-center px-5 py-2.5 bg-white border border-gray-300 shadow-sm rounded-xl font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2 text-gray-400" />
              New Note
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Your <span className="text-blue-600">Shine</span> Notes
          </h1>
          <p className="mt-2 text-gray-500 text-lg">
            Manage and organize your personal thoughts securely.
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            to="/create-note"
            className="inline-flex items-center px-5 py-2.5 bg-blue-600 border border-transparent rounded-xl font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-sm shadow-blue-200"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Note
          </Link>
          <Link
            to="/export-all"
            className="inline-flex items-center px-5 py-2.5 bg-blue-600 border border-transparent rounded-xl font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-sm shadow-blue-200"
          >
            <ArrowUpFromLine className="w-5 h-5 mr-2" />
            Export All
          </Link>
        </div>
      </div>

      <div className="mb-10 relative max-w-xl">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search notes by title or contents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="block w-full pl-11 pr-4 py-3.5 border border-gray-300 rounded-2xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out text-base shadow-sm"
        />
      </div>

      {content}
    </div>
  );
}
