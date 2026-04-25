import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import LoginForm from "./LoginForm";
import { useUserContext } from "../../contexts/user.context";
import { BrowserRouter } from "react-router-dom";

// Mock the context hook
vi.mock("../../contexts/user.context", () => ({
  useUserContext: vi.fn(),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const actual = (await vi.importActual("react-router-dom")) as any;

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("LoginForm Component", () => {
  const mockLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useUserContext as any).mockReturnValue({
      login: mockLogin,
      loading: false,
    });
  });

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>,
    );

  it("1. Context Interaction: calls login with correct credentials", async () => {
    mockLogin.mockResolvedValue({ success: true });
    renderComponent();

    fireEvent.change(screen.getByPlaceholderText(/johndoe/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), {
      target: { value: "password123" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        username: "testuser",
        password: "password123",
      });
    });
  });

  it("2. UI Feedback: shows error message on failed login", async () => {
    mockLogin.mockResolvedValue({
      success: false,
      message: "Invalid credentials",
    });
    renderComponent();

    fireEvent.change(screen.getByPlaceholderText(/johndoe/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), {
      target: { value: "password123" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  it("3. Redirection Logic: navigates to home on success", async () => {
    mockLogin.mockResolvedValue({ success: true });
    renderComponent();

    fireEvent.change(screen.getByPlaceholderText(/johndoe/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), {
      target: { value: "password123" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("4. Redirection Logic: navigates to verify-email if user is not verified", async () => {
    mockLogin.mockResolvedValue({
      success: false,
      data: { isVerified: false },
      message: "Please verify your email",
    });
    renderComponent();

    fireEvent.change(screen.getByPlaceholderText(/johndoe/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), {
      target: { value: "password123" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/verify-email");
    });
  });
});
