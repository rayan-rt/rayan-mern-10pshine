import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import UpdateUsernameForm from "./UpdateUsernameForm";
import { useUserContext } from "../../contexts/user.context";

vi.mock("../../contexts/user.context", () => ({
  useUserContext: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("UpdateUsernameForm", () => {
  const mockUpdateProfile = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useUserContext as any).mockReturnValue({
      user: { _id: "1", username: "testuser" },
      updateProfile: mockUpdateProfile,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <UpdateUsernameForm />
      </BrowserRouter>,
    );

  it("1. new username already exist: displays error message", async () => {
    mockUpdateProfile.mockResolvedValue({
      success: false,
      message: "Username already exists",
    });
    renderComponent();

    fireEvent.change(screen.getByLabelText(/New Username/i), {
      target: { value: "existinguser" },
    });

    // The button disables if identical to current username, "existinguser" is fine.
    fireEvent.click(screen.getByRole("button", { name: /Update Username/i }));

    await vi.waitFor(() => {
      expect(screen.getByText("Username already exists")).toBeInTheDocument();
    });
  });

  it("2. pass case: updates successfully and navigates", async () => {
    vi.useFakeTimers();
    mockUpdateProfile.mockResolvedValue({
      success: true,
      message: "Username updated successfully",
    });
    renderComponent();

    fireEvent.change(screen.getByLabelText(/New Username/i), {
      target: { value: "newuser" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Update Username/i }));

    await vi.waitFor(() => {
      expect(
        screen.getByText("Username updated successfully"),
      ).toBeInTheDocument();
    });

    vi.advanceTimersByTime(2000);

    await vi.waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/profile");
    });
    vi.useRealTimers();
  });
});
