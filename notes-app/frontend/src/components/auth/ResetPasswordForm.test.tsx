import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";

import { describe, it, expect, vi, beforeEach } from "vitest";
import ResetPasswordForm from "./ResetPasswordForm";
import { useUserContext } from "../../contexts/user.context";
import { BrowserRouter } from "react-router-dom";

vi.mock("../../contexts/user.context", () => ({
  useUserContext: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const actual = (await vi.importActual("react-router-dom")) as any;

  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ token: "mock-token" }),
  };
});

describe("ResetPasswordForm Component", () => {
  const mockResetPassword = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useUserContext as any).mockReturnValue({
      resetPassword: mockResetPassword,
      loading: false,
    });
  });

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <ResetPasswordForm />
      </BrowserRouter>,
    );

  it("1. Validation: shows error when passwords do not match", async () => {
    renderComponent();

    // Using getAllByPlaceholderText because both fields have same placeholder in my implementation
    const passFields = screen.getAllByPlaceholderText(/••••••••/i);
    fireEvent.change(passFields[0], { target: { value: "password123" } });
    fireEvent.change(passFields[1], { target: { value: "password456" } });

    fireEvent.submit(screen.getByRole("button", { name: /reset password/i }));

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  it("2. Context Interaction: calls resetPassword with correct data", async () => {
    mockResetPassword.mockResolvedValue({ success: true });
    renderComponent();

    const passFields = screen.getAllByPlaceholderText(/••••••••/i);
    fireEvent.change(passFields[0], { target: { value: "newpassword123" } });
    fireEvent.change(passFields[1], { target: { value: "newpassword123" } });

    fireEvent.submit(screen.getByRole("button", { name: /reset password/i }));

    await waitFor(() => {
      expect(mockResetPassword).toHaveBeenCalledWith(
        "mock-token",
        "newpassword123",
      );
    });
  });

  it("3. UI Feedback: shows success message on success", async () => {
    mockResetPassword.mockResolvedValue({ success: true });
    renderComponent();

    const passFields = screen.getAllByPlaceholderText(/••••••••/i);
    fireEvent.change(passFields[0], { target: { value: "newpassword123" } });
    fireEvent.change(passFields[1], { target: { value: "newpassword123" } });

    fireEvent.submit(screen.getByRole("button", { name: /reset password/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/your password has been reset successfully/i),
      ).toBeInTheDocument();
    });
  });

  it("4. Redirection Logic: navigates to login after success", async () => {
    vi.useFakeTimers();
    mockResetPassword.mockResolvedValue({ success: true });
    renderComponent();

    const passFields = screen.getAllByPlaceholderText(/••••••••/i);
    fireEvent.change(passFields[0], { target: { value: "newpassword123" } });
    fireEvent.change(passFields[1], { target: { value: "newpassword123" } });

    fireEvent.submit(screen.getByRole("button", { name: /reset password/i }));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(3000);
    });

    expect(mockNavigate).toHaveBeenCalledWith("/login");
    vi.useRealTimers();
  });
});
