import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import ExportAllNotePage from "./ExportAllNotePage";
import { useNoteContext } from "../contexts/note.context";
import { BrowserRouter } from "react-router-dom";
import JSZip from "jszip";

// Mock context to provide test notes
vi.mock("../contexts/note.context", () => ({
  useNoteContext: vi.fn(),
}));

// Mock JSZip library
vi.mock("jszip", () => {
  const mockFolder = {
    file: vi.fn().mockReturnThis(),
  };
  const mockZip = {
    folder: vi.fn().mockReturnValue(mockFolder),
    generateAsync: vi
      .fn()
      .mockResolvedValue(
        new Blob(["mock-zip-content"], { type: "application/zip" }),
      ),
  };

  // Use function instead of arrow function for constructor behavior
  const JSZipMock = vi.fn(function () {
    return mockZip;
  });

  return {
    default: JSZipMock,
  };
});

describe("ExportAllNotePage Component", () => {
  const mockNotes = [
    {
      _id: "note-1",
      title: "Note One",
      content: "Content One",
      updatedAt: "2024-05-25T10:00:00.000Z",
    },
    {
      _id: "note-2",
      title: "Note Two",
      content: "Content Two",
      updatedAt: "2024-05-25T11:00:00.000Z",
    },
  ];

  beforeEach(() => {
    vi.mocked(useNoteContext).mockReturnValue({
      notes: mockNotes,
      readNotes: vi.fn(),
      loading: false,
    } as any);

    // Mock URL and global browser APIs
    globalThis.URL.createObjectURL = vi
      .fn()
      .mockReturnValue("blob:mock-zip-url");
    globalThis.URL.revokeObjectURL = vi.fn();

    // Mock anchor tag behavior
    const mockAnchor = document.createElement("a");
    vi.spyOn(mockAnchor, "click").mockImplementation(() => {});
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, "createElement").mockImplementation(
      (tagName: string) => {
        if (tagName === "a") return mockAnchor as unknown as HTMLAnchorElement;
        return originalCreateElement(tagName);
      },
    );

    // Spy on body interactions without preventing them
    vi.spyOn(document.body, "appendChild");
    vi.spyOn(document.body, "removeChild");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should handle the full select-all and zip export flow", async () => {
    render(
      <BrowserRouter>
        <ExportAllNotePage />
      </BrowserRouter>,
    );

    // 1. Initial State: Export button should be disabled
    const exportBtn = screen.getByText(/Export 0 Notes/i);
    expect(exportBtn).toBeDefined();
    expect(exportBtn.closest("button")).toHaveProperty("disabled", true);

    // 2. Action: Click Select All
    const selectAllBtn = screen.getByText("Select All");
    fireEvent.click(selectAllBtn);

    // 3. Update State: Verify button reflects selection
    expect(screen.getByText("Deselect All")).toBeDefined();
    const activeExportBtn = screen.getByText(/Export 2 Notes/i);
    expect(activeExportBtn.closest("button")).toHaveProperty("disabled", false);

    // 4. Action: Trigger Export
    fireEvent.click(activeExportBtn);

    // 5. Verification: Zipping process triggered
    await waitFor(() => {
      expect(JSZip).toHaveBeenCalled();
      expect(globalThis.URL.createObjectURL).toHaveBeenCalled();
    });

    // Verify click was triggered on the hidden download link
    const anchor = document.createElement("a");
    expect(anchor.click).toHaveBeenCalled();
    expect(anchor.download).toContain("10pShine_Notes");
    expect(anchor.download).toContain(".zip");
  });

  it("should toggle individual note selection correctly", () => {
    render(
      <BrowserRouter>
        <ExportAllNotePage />
      </BrowserRouter>,
    );

    const firstNoteItem = screen.getByText("Note One");
    fireEvent.click(firstNoteItem);

    expect(screen.getByText(/Export 1 Notes/i)).toBeDefined();

    // Toggle off
    fireEvent.click(firstNoteItem);
    expect(screen.getByText(/Export 0 Notes/i)).toBeDefined();
  });
});
