import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SignupForm from "./SignupForm";
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

describe("SignupForm Component", () => {
  const mockRegister = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useUserContext as any).mockReturnValue({
      register: mockRegister,
      loading: false,
    });
  });

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <SignupForm />
      </BrowserRouter>,
    );

  it("1. Validation: shows errors for invalid inputs", async () => {
    renderComponent();

    fireEvent.submit(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/username must be at least 3 characters/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
      expect(
        screen.getByText(/password must be at least 6 characters/i),
      ).toBeInTheDocument();
    });
  });

  it("2. Context Interaction: calls register with correct data", async () => {
    mockRegister.mockResolvedValue({ success: true });
    renderComponent();

    fireEvent.change(screen.getByPlaceholderText(/johndoe/i), {
      target: { value: "newuser" },
    });
    fireEvent.change(screen.getByPlaceholderText(/john@example.com/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), {
      target: { value: "password123" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        username: "newuser",
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  it("3. UI Feedback: shows error on registration failure", async () => {
    mockRegister.mockResolvedValue({
      success: false,
      message: "User already exists",
    });
    renderComponent();

    fireEvent.change(screen.getByPlaceholderText(/johndoe/i), {
      target: { value: "newuser" },
    });
    fireEvent.change(screen.getByPlaceholderText(/john@example.com/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), {
      target: { value: "password123" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText(/user already exists/i)).toBeInTheDocument();
    });
  });

  it("4. Redirection Logic: navigates to verify-email on success", async () => {
    mockRegister.mockResolvedValue({ success: true });
    renderComponent();

    fireEvent.change(screen.getByPlaceholderText(/johndoe/i), {
      target: { value: "newuser" },
    });
    fireEvent.change(screen.getByPlaceholderText(/john@example.com/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), {
      target: { value: "password123" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/verify-email");
    });
  });
});
