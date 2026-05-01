import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import ChangePasswordForm from "./ChangePasswordForm";
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

describe("ChangePasswordForm", () => {
  const mockChangePassword = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useUserContext as any).mockReturnValue({
      user: { _id: "1", username: "testuser" },
      changePassword: mockChangePassword,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <ChangePasswordForm />
      </BrowserRouter>,
    );

  it("1. old password wrong: displays error message", async () => {
    mockChangePassword.mockResolvedValue({
      success: false,
      message: "Invalid old password",
    });
    renderComponent();

    fireEvent.change(screen.getByLabelText(/Current Password/i), {
      target: { value: "wrong" },
    });
    fireEvent.change(screen.getByLabelText(/New Password/i), {
      target: { value: "newpass" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Change Password/i }));

    await waitFor(() => {
      expect(screen.getByText("Invalid old password")).toBeInTheDocument();
    });
  });

  it("2. pass case: updates successfully and navigates", async () => {
    mockChangePassword.mockResolvedValue({
      success: true,
      message: "Password updated successfully",
    });
    renderComponent();

    fireEvent.change(screen.getByLabelText(/Current Password/i), {
      target: { value: "oldpass" },
    });
    fireEvent.change(screen.getByLabelText(/New Password/i), {
      target: { value: "newpass" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Change Password/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Password updated successfully"),
      ).toBeInTheDocument();
    });

    vi.advanceTimersByTime(2000);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/profile");
    });
  });
});
