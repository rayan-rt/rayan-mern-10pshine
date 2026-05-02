import { useMemo, type ReactNode, useState, useCallback } from "react";
import { noteContext } from "./note.context";
import type {
  INote,
  INoteResponse,
  ICreateNoteData,
  IUpdatedNote,
} from "../types/note.types";
import { ENV_VARS } from "../const_env";
import { logger } from "../utils/logger";

const NoteProvider = ({ children }: { children: ReactNode }) => {
  const [notes, setNotes] = useState<INote[] | null>(null);
  const [note, setNote] = useState<INote | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createNote = useCallback(
    async (data: ICreateNoteData): Promise<INoteResponse> => {
      try {
        setLoading(true);
        const response = await fetch(`${ENV_VARS.BACKEND_URL}/api/v1/notes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
          credentials: "include",
        });

        const result: INoteResponse = await response.json();
        if (!response.ok)
          throw new Error(result.message || "Failed to create note");

        if (result.data) {
          setNotes((prevNotes) =>
            prevNotes
              ? [result.data as INote, ...prevNotes]
              : [result.data as INote],
          );
        }

        return result;
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create note";
        setError(errorMessage);
        logger.error(errorMessage, err);
        return { success: false, message: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const readNotes = useCallback(
    async (search?: string): Promise<INoteResponse> => {
      try {
        setLoading(true);
        const url = new URL(`${ENV_VARS.BACKEND_URL}/api/v1/notes`);
        if (search) {
          url.searchParams.append("search", search);
        }

        const response = await fetch(url.toString(), {
          method: "GET",
          credentials: "include",
        });

        const result: INoteResponse = await response.json();
        if (response.ok && result.data) {
          setNotes(result.data as INote[]);
        }
        return result;
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch notes";
        setError(errorMessage);
        logger.error(errorMessage, err);
        return { success: false, message: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const readNote = useCallback(
    async (noteId: string): Promise<INoteResponse> => {
      try {
        setLoading(true);
        const response = await fetch(
          `${ENV_VARS.BACKEND_URL}/api/v1/notes/${noteId}`,
          {
            credentials: "include",
            method: "GET",
          },
        );

        const result: INoteResponse = await response.json();
        if (response.ok && result.data) {
          setNote(result.data as INote);
        }
        return result;
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch note";
        setError(errorMessage);
        logger.error(errorMessage, err);
        return { success: false, message: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const updateNote = useCallback(
    async (noteId: string, data: IUpdatedNote): Promise<INoteResponse> => {
      try {
        setLoading(true);
        const response = await fetch(
          `${ENV_VARS.BACKEND_URL}/api/v1/notes/${noteId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
            credentials: "include",
          },
        );

        const result: INoteResponse = await response.json();
        if (!response.ok)
          throw new Error(result.message || "Failed to update note");

        if (result.data) {
          const updatedNote = result.data as INote;
          setNotes((prevNotes) =>
            prevNotes
              ? prevNotes.map((n) => (n._id === noteId ? updatedNote : n))
              : null,
          );
          if (note?._id === noteId) {
            setNote(updatedNote);
          }
        }

        return result;
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update note";
        setError(errorMessage);
        logger.error(errorMessage, err);
        return { success: false, message: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [note],
  );

  const deleteNote = useCallback(
    async (noteId: string): Promise<INoteResponse> => {
      try {
        setLoading(true);
        const response = await fetch(
          `${ENV_VARS.BACKEND_URL}/api/v1/notes/${noteId}`,
          {
            method: "DELETE",
            credentials: "include",
          },
        );

        const result: INoteResponse = await response.json();
        if (!response.ok)
          throw new Error(result.message || "Failed to delete note");

        setNotes((prevNotes) =>
          prevNotes ? prevNotes.filter((n) => n._id !== noteId) : null,
        );
        if (note?._id === noteId) {
          setNote(null);
        }

        return result;
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete note";
        setError(errorMessage);
        logger.error(errorMessage, err);
        return { success: false, message: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [note],
  );

  const togglePin = useCallback(
    async (noteId: string, isPinned: boolean): Promise<INoteResponse> => {
      try {
        setLoading(true);
        const response = await fetch(
          `${ENV_VARS.BACKEND_URL}/api/v1/notes/pin/${noteId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isPinned }),
            credentials: "include",
          },
        );

        const result: INoteResponse = await response.json();
        if (!response.ok)
          throw new Error(result.message || "Failed to toggle pin");

        if (result.data) {
          const updatedNote = result.data as INote;
          setNotes((prevNotes) => {
            if (!prevNotes) return null;
            const updated = prevNotes.map((n) =>
              n._id === noteId ? updatedNote : n,
            );
            return updated.sort((a, b) => {
              if (a.isPinned !== b.isPinned) {
                return a.isPinned ? -1 : 1;
              }
              const d1 = new Date(a.updatedAt).getTime();
              const d2 = new Date(b.updatedAt).getTime();
              return d2 - d1;
            });
          });
          if (note?._id === noteId) {
            setNote(updatedNote);
          }
        }

        return result;
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to toggle pin";
        setError(errorMessage);
        logger.error(errorMessage, err);
        return { success: false, message: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [note],
  );

  const value = useMemo(() => {
    return {
      notes,
      note,
      loading,
      error,
      setNotes,
      setNote,
      readNotes,
      readNote,
      createNote,
      updateNote,
      deleteNote,
      togglePin,
    };
  }, [
    notes,
    note,
    loading,
    error,
    readNotes,
    readNote,
    createNote,
    updateNote,
    deleteNote,
    togglePin,
  ]);

  return <noteContext.Provider value={value}>{children}</noteContext.Provider>;
};

export { NoteProvider };
