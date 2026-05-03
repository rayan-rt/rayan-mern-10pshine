import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import DeleteNoteButton from "./DeleteNoteButton";
import { useNoteContext } from "../../contexts/note.context";
import type { INote } from "../../types/note.types";

vi.mock("../../contexts/note.context", () => ({
  useNoteContext: vi.fn(),
}));

describe("DeleteNoteButton Component", () => {
  const mockDeleteNote = vi.fn();

  const mockNote: INote = {
    _id: "test-note-456",
    title: "Obsolete Note",
    content: "Please delete me",
    isPinned: false,
    user: "user-abc",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useNoteContext as any).mockReturnValue({
      deleteNote: mockDeleteNote,
    });

    // Mock window.confirm
    vi.spyOn(globalThis, "confirm");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("1. Confirms Deletion: calls deleteNote when user confirms window prompt", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).confirm.mockReturnValue(true);
    render(<DeleteNoteButton note={mockNote} />);

    const btn = screen.getByTestId("delete-btn");
    fireEvent.click(btn);

    expect(globalThis.confirm).toHaveBeenCalledWith(
      "Are you sure you want to permanently delete this note?",
    );
    await waitFor(() => {
      expect(mockDeleteNote).toHaveBeenCalledTimes(1);
      expect(mockDeleteNote).toHaveBeenCalledWith("test-note-456");
    });
  });

  it("2. Cancels Deletion: aborts transaction when returning false", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).confirm.mockReturnValue(false);
    render(<DeleteNoteButton note={mockNote} />);

    const btn = screen.getByTestId("delete-btn");
    fireEvent.click(btn);

    expect(globalThis.confirm).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(mockDeleteNote).not.toHaveBeenCalled();
    });
  });
});
