import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { EditNoteForm } from "../components";
import { useNoteContext } from "../contexts/note.context";

export default function EditNotePage() {
  const { id } = useParams();
  const { note, readNote, loading } = useNoteContext();

  useEffect(() => {
    if (id) {
      readNote(id);
    }
  }, [id, readNote]);

  let content;

  if (loading && (!note || note._id !== id)) {
    content = (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  } else if (note && note._id === id) {
    content = <EditNoteForm note={note} />;
  } else {
    content = (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium text-gray-900">Note not found</h3>
        <p className="mt-2 text-gray-500">
          We couldn't find the note you're looking to edit.
        </p>
        <div className="mt-6">
          <Link
            to="/notes"
            className="text-blue-600 font-medium hover:underline"
          >
            Return to Notes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 relative overflow-hidden">
      <div className="mb-8 border-b pb-6 animate-in fade-in slide-in-from-top-4 duration-1000">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
          Edit your <span className="text-blue-600">Shine</span> Note
        </h1>
        <p className="mt-3 text-lg text-gray-500 max-w-2xl">
          Modify your thoughts and securely save your changes.
        </p>
      </div>

      <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
        {content}
      </div>
    </div>
  );
}
