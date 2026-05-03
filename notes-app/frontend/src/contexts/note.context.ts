import { createContext, useContext } from "react";
import type { INoteContext } from "../types/note.types";
// --

const noteContext = createContext<INoteContext | undefined>(undefined);

const useNoteContext = () => {
  const context = useContext(noteContext);
  if (context === undefined) {
    throw new Error("useNoteContext must be used within a NoteProvider");
  }
  return context;
};

export { noteContext, useNoteContext };
