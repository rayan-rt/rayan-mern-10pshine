import { Trash2 } from "lucide-react";
import type { INote } from "../../types/note.types";
import { useNoteContext } from "../../contexts/note.context";

export default function DeleteNoteButton({ note }: Readonly<{ note: INote }>) {
  const { deleteNote } = useNoteContext();

  const handleDelete = async () => {
    if (
      window.confirm("Are you sure you want to permanently delete this note?")
    ) {
      await deleteNote(note._id);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="p-1.5 text-gray-400 rounded-lg focus:outline-none cursor-pointer"
      title="Delete Note"
      data-testid="delete-btn"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
