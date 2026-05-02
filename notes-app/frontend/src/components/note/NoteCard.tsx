import { Trash2, Edit3, Pin, Calendar } from "lucide-react";
import type { INote } from "../../types/note.types";
import DOMPurify from "dompurify";

export default function NoteCard({ note }: Readonly<{ note: INote }>) {
  // Human-readable generic date formatter
  const dateFormatted = new Date(note.updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className={`relative bg-white border ${
        note.isPinned
          ? "border-blue-300 shadow-md ring-1 ring-blue-100"
          : "border-gray-200 shadow-sm"
      } rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-72`}
    >
      {/* Card Header */}
      <div className="px-5 pt-5 pb-3 flex justify-between items-start gap-4">
        <h3
          className="font-bold text-lg text-gray-900 line-clamp-1 flex-1"
          title={note.title}
        >
          {note.title}
        </h3>
        <button
          className={`p-1.5 rounded-full transition-colors shrink-0 ${
            note.isPinned ? "text-blue-600 bg-blue-50" : "text-gray-400"
          }`}
          title={note.isPinned ? "Pinned Note" : "Note"}
        >
          <Pin
            className="w-4 h-4"
            style={{ fill: note.isPinned ? "currentColor" : "none" }}
          />
        </button>
      </div>

      {/* Card Body - Content parsing DOMPurify carefully securing HTML */}
      <div className="px-5 flex-1 overflow-hidden relative text-gray-600 text-sm">
        <div
          className="prose prose-sm prose-blue line-clamp-6 text-gray-600 wrap-break-word leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(note.content),
          }}
        />
        {/* Gradient Fade to obscure overflowing text cleanly */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-white to-transparent pointer-events-none" />
      </div>

      {/* Card Footer */}
      <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50 mt-auto">
        <div className="flex items-center text-xs text-gray-400 font-medium tracking-wide">
          <Calendar className="w-3.5 h-3.5 mr-1.5 opacity-80" />
          {dateFormatted}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            className="p-1.5 text-gray-400 rounded-lg focus:outline-none cursor-default"
            title="Edit Note"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            className="p-1.5 text-gray-400 rounded-lg focus:outline-none cursor-default"
            title="Delete Note"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
