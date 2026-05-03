import { Pin } from "lucide-react";
import type { INote } from "../../types/note.types";
import { useNoteContext } from "../../contexts/note.context";

export default function PinNoteButton({ note }: Readonly<{ note: INote }>) {
  const { togglePin } = useNoteContext();

  const handlePin = async () => {
    await togglePin(note._id, !note.isPinned);
  };

  return (
    <button
      onClick={handlePin}
      className={`p-1.5 rounded-full transition-colors shrink-0 ${
        note.isPinned ? "text-blue-600 bg-blue-50" : "text-gray-400"
      }`}
      title={note.isPinned ? "Pinned Note" : "Note"}
      data-testid="pin-btn"
    >
      <Pin
        className="w-4 h-4"
        style={{ fill: note.isPinned ? "currentColor" : "none" }}
      />
    </button>
  );
}
