import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import CreateNoteForm from "./CreateNoteForm";
import { useNoteContext } from "../../contexts/note.context";
import { BrowserRouter } from "react-router-dom";

// Mock React Quill to render a stable vanilla textarea instead of dragging heavy DOM extensions that break JSDom
vi.mock("react-quill-new", () => ({
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

describe("CreateNoteForm Component", () => {
  const mockCreateNote = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useNoteContext as any).mockReturnValue({
      createNote: mockCreateNote,
    });
  });

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <CreateNoteForm />
      </BrowserRouter>,
    );

  it("1. Successful Creation: submits validated note to backend", async () => {
    mockCreateNote.mockResolvedValue({ success: true, message: "Created" });
    renderComponent();

    fireEvent.change(
      screen.getByPlaceholderText("Enter the title of your note"),
      {
        target: { value: "My Great Note" },
      },
    );

    // Changing the mocked textarea representing Quill
    fireEvent.change(screen.getByTestId("mock-quill"), {
      target: { value: "<p>This is a solid note content</p>" },
    });

    const submitButton = screen.getByRole("button", { name: /save note/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCreateNote).toHaveBeenCalledTimes(1);
      expect(mockCreateNote).toHaveBeenCalledWith({
        title: "My Great Note",
        content: "<p>This is a solid note content</p>",
      });
    });
  });

  it("2. Handles Invalid Inputs: prevents submission on empty data", async () => {
    renderComponent();

    const submitButton = screen.getByRole("button", { name: /save note/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Title is required")).toBeInTheDocument();
      expect(mockCreateNote).not.toHaveBeenCalled();
    });
  });
});
