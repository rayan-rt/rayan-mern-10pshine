import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { useUserContext } from "../../contexts/user.context";
import { BrowserRouter } from "react-router-dom";

// Mock the context hook
vi.mock("../../contexts/user.context", () => ({
  useUserContext: vi.fn(),
}));

describe("ForgotPasswordForm Component", () => {
  const mockForgotPassword = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useUserContext as any).mockReturnValue({
      forgotPassword: mockForgotPassword,
      loading: false,
    });
  });

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <ForgotPasswordForm />
      </BrowserRouter>,
    );

  it("1. Validation: shows error for invalid email", async () => {
    renderComponent();

    fireEvent.change(screen.getByPlaceholderText(/john@example.com/i), {
      target: { value: "not-an-email" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /send reset link/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    });
  });

  it("2. Context Interaction: calls forgotPassword with correct email", async () => {
    mockForgotPassword.mockResolvedValue({ success: true });
    renderComponent();

    fireEvent.change(screen.getByPlaceholderText(/john@example.com/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /send reset link/i }));

    await waitFor(() => {
      expect(mockForgotPassword).toHaveBeenCalledWith("test@example.com");
    });
  });

  it("3. UI Feedback: shows success message on submission", async () => {
    mockForgotPassword.mockResolvedValue({ success: true });
    renderComponent();

    fireEvent.change(screen.getByPlaceholderText(/john@example.com/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /send reset link/i }));

    await waitFor(() => {
      expect(screen.getByText(/check your email/i)).toBeInTheDocument();
      expect(
        screen.getByText(/we've sent a password reset link/i),
      ).toBeInTheDocument();
    });
  });

  it("4. UI Feedback: shows error on request failure", async () => {
    mockForgotPassword.mockResolvedValue({
      success: false,
      message: "Email not found",
    });
    renderComponent();

    fireEvent.change(screen.getByPlaceholderText(/john@example.com/i), {
      target: { value: "unknown@example.com" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /send reset link/i }));

    await waitFor(() => {
      expect(screen.getByText(/email not found/i)).toBeInTheDocument();
    });
  });
});
