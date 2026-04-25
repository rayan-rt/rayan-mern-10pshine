import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import LogoutButton from "./LogoutButton";
import { useUserContext } from "../../contexts/user.context";
import { BrowserRouter } from "react-router-dom";

vi.mock("../../contexts/user.context", () => ({
  useUserContext: vi.fn(),
}));

describe("LogoutButton Component", () => {
  const mockLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useUserContext as any).mockReturnValue({
      logout: mockLogout,
    });
  });

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <LogoutButton />
      </BrowserRouter>,
    );

  it("1. Successful Logout: calls logout function on click", async () => {
    mockLogout.mockResolvedValue({ success: true });
    renderComponent();

    const button = screen.getByRole("button", { name: /logout/i });
    fireEvent.click(button);

    // Initial loading state
    expect(button).toBeDisabled();
    expect(screen.getByTestId("loader")).toBeInTheDocument();

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledTimes(1);
      expect(button).not.toBeDisabled();
    });
  });

  it("2. Server Error: handles logout failure gracefully", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockLogout.mockRejectedValue(new Error("Server Error"));
    renderComponent();

    const button = screen.getByRole("button", { name: /logout/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledTimes(1);
      expect(button).not.toBeDisabled();
      expect(consoleSpy).toHaveBeenCalledWith(
        "Logout failed",
        expect.any(Error),
      );
    });
    consoleSpy.mockRestore();
  });

  it("3. Suspicious Scenario: handles logout when session might be missing", async () => {
    // If no cookies/session, backend might return 401 or fail.
    // The component should still stop the loading state.
    mockLogout.mockResolvedValue({
      success: false,
      message: "No active session",
    });
    renderComponent();

    const button = screen.getByRole("button", { name: /logout/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledTimes(1);
      expect(button).not.toBeDisabled();
    });
  });
});
