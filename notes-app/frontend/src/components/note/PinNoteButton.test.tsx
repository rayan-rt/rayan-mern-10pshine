import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PinNoteButton from "./PinNoteButton";
import { useNoteContext } from "../../contexts/note.context";
import type { INote } from "../../types/note.types";

vi.mock("../../contexts/note.context", () => ({
  useNoteContext: vi.fn(),
}));

describe("PinNoteButton Component", () => {
  const mockTogglePin = vi.fn();

  const mockNote: INote = {
    _id: "test-note-123",
    title: "Test Note",
    content: "Testing content",
    isPinned: false,
    user: "user-abc",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useNoteContext as any).mockReturnValue({
      togglePin: mockTogglePin,
    });
  });

  it("1. Successful Pin Toggle: calls togglePin with inverted state natively", async () => {
    render(<PinNoteButton note={mockNote} />);

    const btn = screen.getByTestId("pin-btn");

    // Act
    fireEvent.click(btn);

    // Assert
    await waitFor(() => {
      expect(mockTogglePin).toHaveBeenCalledTimes(1);
      expect(mockTogglePin).toHaveBeenCalledWith("test-note-123", true); // since initially false
    });
  });
});
