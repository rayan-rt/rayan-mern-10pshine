import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import EditNoteForm from "./EditNoteForm";
import { useNoteContext } from "../../contexts/note.context";
import { BrowserRouter } from "react-router-dom";
import type { INote } from "../../types/note.types";

vi.mock("react-quill-new", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ value, onChange, "data-testid": testId }: any) => (
    <textarea
      data-testid={testId || "mock-quill"}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

vi.mock("../../contexts/note.context", () => ({
  useNoteContext: vi.fn(),
}));

describe("EditNoteForm Component", () => {
  const mockUpdateNote = vi.fn();

  const existingNote: INote = {
    _id: "test-note-789",
    title: "Original Title",
    content: "<p>Original Content</p>",
    isPinned: false,
    user: "user-abc",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useNoteContext as any).mockReturnValue({
      updateNote: mockUpdateNote,
    });
  });

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <EditNoteForm note={existingNote} />
      </BrowserRouter>,
    );

  it("1. Successfully updates the note", async () => {
    mockUpdateNote.mockResolvedValue({ success: true });
    renderComponent();

    const titleInput = screen.getByPlaceholderText(
      "Enter the title of your note",
    );
    expect(titleInput).toHaveValue("Original Title");

    fireEvent.change(titleInput, { target: { value: "New Edited Title" } });

    // Change mocked quill
    const quillInput = screen.getByTestId("mock-quill");
    expect(quillInput).toHaveValue("<p>Original Content</p>");

    fireEvent.change(quillInput, {
      target: { value: "<p>Newly added texts</p>" },
    });

    const submitBtn = screen.getByRole("button", { name: /save changes/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockUpdateNote).toHaveBeenCalledTimes(1);
      expect(mockUpdateNote).toHaveBeenCalledWith("test-note-789", {
        title: "New Edited Title",
        content: "<p>Newly added texts</p>",
      });
    });
  });

  it("2. Renders server error smoothly on failed submission", async () => {
    mockUpdateNote.mockResolvedValue({
      success: false,
      message: "Unauthorized edit",
    });
    renderComponent();

    const submitBtn = screen.getByRole("button", { name: /save changes/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Unauthorized edit")).toBeInTheDocument();
    });
  });
});
