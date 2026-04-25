import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import VerifyEmailForm from "./VerifyEmailForm";
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
  };
});

describe("VerifyEmailForm Component", () => {
  const mockVerifyEmail = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useUserContext as any).mockReturnValue({
      verifyEmail: mockVerifyEmail,
      loading: false,
      user: { email: "prefill@example.com" },
    });
  });

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <VerifyEmailForm />
      </BrowserRouter>,
    );

  it("1. Context Interaction: calls verifyEmail with correct data", async () => {
    mockVerifyEmail.mockResolvedValue({ success: true });
    renderComponent();

    fireEvent.change(screen.getByPlaceholderText(/john@example.com/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/123456/i), {
      target: { value: "123456" },
    });

    fireEvent.submit(
      screen.getByRole("button", { name: /verify & continue/i }),
    );

    await waitFor(() => {
      expect(mockVerifyEmail).toHaveBeenCalledWith({
        email: "test@example.com",
        otp: "123456",
      });
    });
  });

  it("2. UI Feedback: shows error on verification failure", async () => {
    mockVerifyEmail.mockResolvedValue({
      success: false,
      message: "Invalid OTP",
    });
    renderComponent();

    fireEvent.change(screen.getByPlaceholderText(/123456/i), {
      target: { value: "000000" },
    });
    fireEvent.submit(
      screen.getByRole("button", { name: /verify & continue/i }),
    );

    await waitFor(() => {
      expect(screen.getByText(/invalid otp/i)).toBeInTheDocument();
    });
  });

  it("3. Redirection Logic: navigates to home on success", async () => {
    mockVerifyEmail.mockResolvedValue({ success: true });
    renderComponent();

    fireEvent.change(screen.getByPlaceholderText(/123456/i), {
      target: { value: "123456" },
    });
    fireEvent.submit(
      screen.getByRole("button", { name: /verify & continue/i }),
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });
});
